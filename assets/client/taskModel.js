var Utils = require('../utils.js');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var Q = require('q');

var TaskModel = function (key) {
	this.key = key;
	var loadData = Utils.store(key);
	this.version = loadData.version || 0;
	this.skin = loadData.skin || "";
	this.message = loadData.message || {id: 0, show: false, value: ""};
	this.customStyle = loadData.customStyle || "";
	this.favorites = loadData.favorites || [];
	this.backup = loadData.backup || {};
	this.Multibill = loadData.Multibill || [];
	this.tasks = loadData.tasks || loadData;
	this.tasks.forEach(function(task){
		if (!(task.stopTime)){
			chrome.runtime.sendMessage({running: true}, function(response) {});
		}
	});

	this.onChanges = [];
	this.updateDataVersion();
};

TaskModel.prototype.updateDataVersion = function () {
	switch (this.version){
		case 0:
			this.tasks = this.tasks.map(function (task) {
				return Utils.extend({}, task, {Multibill: null});
			});
			break;
	}

	this.version = 1;
	this.inform();
};

TaskModel.prototype.subscribe = function (onChange) {
	this.onChanges.push(onChange);
};

TaskModel.prototype.inform = function () {
	var store = { tasks: this.tasks, backup: this.backup, favorites: this.favorites, skin: this.skin, customStyle: this.customStyle, message: this.message, version: this.version, Multibill: this.Multibill }
	Utils.store(this.key, store);
	this.onChanges.forEach(function (cb) { cb(); });
};

TaskModel.prototype.addTask = function (task, start, stop) {
	var isFavorite = this.checkIfFavorite(task.ticketID);
	var newTask = {
		id: Utils.uuid(),
		title: task.title,
		startTime: start || Moment().format(),
		ticketID: task.ticketID || null,
		projectID: task.projectID || null,
		note: task.note || null,
		categoryID: task.categoryID,
		isFavorite: isFavorite,
		Multibill: task.Multibill,
		gap: {}
	};
	if (stop){
		this.tasks = this.tasks.map(function (taskToStop) {
			return taskToStop !== task ?
				taskToStop :
				Utils.extend({}, taskToStop, { stopTime: stop });
		});
	}

	chrome.runtime.sendMessage({running: true}, function(response) {});
	this.tasks.unshift(newTask);
	this.inform();
};

TaskModel.prototype.splitTask = function (task, start, stop) {
	var newTask = {
		id: Utils.uuid(),
		title: task.title,
		startTime: start,
		stopTime: stop,
		ticketID: task.ticketID || null,
		projectID: task.projectID || null,
		note: task.note || null,
		categoryID: task.categoryID,
		isFavorite: task.isFavorite,
		Multibill: Multibill,
		gap: {}
	};
	this.tasks = this.tasks.map(function (taskExpanded) {
		return taskExpanded.expanded ?
			Utils.extend({}, taskExpanded, { expanded: false })
			: taskExpanded;
	});
	this.tasks.unshift(newTask);
	this.inform();
};

TaskModel.prototype.addMultibill = function () {
	var newID = 0;
	for (var i = 0; i < this.Multibill.length; i++)
	{
		if (this.Multibill[i].id >= newID)
			newID = this.Multibill[i].id + 1;
	}

	this.Multibill.push({id: newID, title: "Multi-bill List " + newID, tasks: []});

	this.inform();
};

TaskModel.prototype.removeMultibill = function(id){
	this.Multibill = this.Multibill.filter(function (item) {
		return parseInt(item.id) !== parseInt(id);
	});
	
	this.tasks = this.tasks.map(function (task) {
		if (parseInt(task.Multibill) === parseInt(id)){
			return Utils.extend({}, task, {title: "", Multibill: null, hasChanged: true});
		}
		return task;
	});

	this.inform();
}

TaskModel.prototype.handleMultibillTaskIDChange = function(MultibillID, taskID, value){
	var scope = this;

	if (value.indexOf("https://") > -1) //Allow the user to paste a genome url or hask of the ticket
	{
		value = value.substring(value.lastIndexOf("/") + 1);
	}
	else if (value.indexOf("#") === 0){
		value = value.substring(1);
	}

	for (var i = 0; i < this.Multibill.length; i++){
		if (parseInt(this.Multibill[i].id) === parseInt(MultibillID)){
			if (value === "") { //Remove the task completely if the value is null
				this.Multibill[i].tasks = this.Multibill[i].tasks.filter(function(task){
					return parseInt(task.id) !== parseInt(taskID);
				});
				scope.inform();
			}
			else{
				var duplicate = false; //Check if the task already exists in the list to prevent duplicates
				for (var j = 0; j < this.Multibill[i].tasks.length; j++){
					if (parseInt(this.Multibill[i].tasks[j].id) === parseInt(value)){
						duplicate = true;
						break;
					}
				}
				if (duplicate === false){
					GenomeAPI.getProjectInfo(value).then(function(ticketData){
						if (parseInt(taskID) === -1){ //Add a new task to the list if the id is -1
							scope.Multibill[i].tasks.push({ key: Utils.uuid(), id: value, projectID: ticketData.Entries[0].ProjectID, title: ticketData.Entries[0].Title, projectName: ticketData.Entries[0].ProjectName});
						}
						else{ //Find the task that was edited and update it with the new content
							scope.Multibill[i].tasks = scope.Multibill[i].tasks.map(function (task) {
								if (parseInt(task.id) === parseInt(taskID)){
									return { id: value, projectID: ticketData.Entries[0].ProjectID, title: ticketData.Entries[0].Title, projectName: ticketData.Entries[0].ProjectName};
				  				}
				  				else
				  					return task;
				  			});
						}
			  			scope.inform();
			  		}).fail(function(error){});
				}
			}
			break;
		}
	}
}

TaskModel.prototype.addGap = function (start, stop) {
	var newTask = {
		id: Utils.uuid(),
		title: "",
		startTime: start,
		stopTime: stop,
		ticketID: null,
		projectID: null,
		note: null,
		categoryID: null,
		Multibill: null,
		expanded: true
	};
	this.tasks = this.tasks.map(function (taskExpanded) {
			return taskExpanded.expanded ?
				Utils.extend({}, taskExpanded, { expanded: false })
				: taskExpanded;
		});
	this.tasks.unshift(newTask);
	this.inform();
};

TaskModel.prototype.stop = function (taskToStop, stopTime) {
	this.tasks = this.tasks.map(function (task) {
		if(task === taskToStop)
		{	
			if (!task.stopTime){
				return Utils.extend({}, task, {stopTime: stopTime ? stopTime : Moment(task.startTime).hour(Moment().hour()).minute(Moment().minute()).second(Moment().second()).millisecond(Moment().millisecond()).format(), hasChanged: true });
			}
		}
		return task;
	});
	this.inform();
};

TaskModel.prototype.updateMessage = function (message) {
	this.message = {};
	this.message.id = message.id;
	this.message.show = true;

	this.inform();
};

TaskModel.prototype.hideMessage = function () {
	this.message.show = false;
	
	this.inform();
};

TaskModel.prototype.backUp = function (taskList) {
	this.backup = taskList;
	this.inform();
};

TaskModel.prototype.restoreBackUp = function () {
	var scope = this;
	this.backup.forEach(function(task){
		scope.tasks.unshift(task);
	});
	this.backup = {};
	this.inform();
};
TaskModel.prototype.removeBackUp = function () {
	this.backup = {};
	this.inform();
};

TaskModel.prototype.addFavorite = function (task) {
	var scope = this;
	var newTask = {
		id: Utils.uuid(),
		title: task.title,
		ticketID: task.ticketID || null,
		projectID: task.projectID || null
	};

	if (newTask.projectID){
		this.tasks = this.tasks.map(function (task) {
			if (task.ticketID === newTask.ticketID)
			   	return Utils.extend({}, task, {isFavorite: true, hasChanged: true});
			return task;
		});

		GenomeAPI.getProjectInfo(newTask.ticketID).then(function(ticket){
        	newTask.ProjectName = ticket.Entries[0].ProjectName;
        	scope.favorites.unshift(newTask);
			scope.inform();
     	});
	}
	else{
		this.favorites.unshift(newTask);
		this.inform();
	}
		
	
};

TaskModel.prototype.updateStyles = function (style, skin) {
	this.skin = skin;
	this.customStyle = style;
	this.inform();
};

TaskModel.prototype.clearFavorite = function () {
	this.favorites = [];
	this.inform();
};

TaskModel.prototype.removeFavorite = function (task) {
	var index = null;
	var that = this;
	_.each(this.favorites, function (fav, i) {
		if ((task.projectID && fav.ticketID === task.ticketID)){
          index = i;
	    }
	});
	if (this.favorites[index].projectID){
		this.tasks = this.tasks.map(function (task) {
			if (task.ticketID === that.favorites[index].ticketID)
			   	return Utils.extend({}, task, {isFavorite: false, hasChanged: true});
			return task;
		});
	}
	
	this.favorites.splice(index,1);
	this.inform();
};

TaskModel.prototype.expand = function (taskToExpand) {
	this.tasks = this.tasks.map(function (task) {
		return task !== taskToExpand ?
			Utils.extend({}, task, { expanded: false }) :
			Utils.extend({}, task, { expanded: true });
	});

	this.inform();
};

TaskModel.prototype.contract = function (taskToExpand) {
	this.tasks = this.tasks.map(function (task) {
		return task !== taskToExpand ?
			task :
			Utils.extend({}, task, { expanded: false });
	});

	this.inform();
};

TaskModel.prototype.handleIdChange = function (taskToChange, value, itemScope) {
	var scope = this;
	//		return Utils.extend({}, task, {ticketID: ticketid});
	if (value.indexOf("https://") > -1)
	{
		value = value.substring(value.lastIndexOf("/") + 1);
	}
	else if (value.indexOf("#") === 0){
		value = value.substring(1);
	}

	if (value === "") {
		scope.tasks = scope.tasks.map(function (task) {
		if (task === taskToChange)
			return Utils.extend({}, task, {ticketID: value, projectID: null, isFavorite: false, hasChanged: true});
		else
				return task;
		});
		scope.inform();
	}
	else{
  		GenomeAPI.getProjectInfo(value).then(function(ticketData){
			scope.tasks = scope.tasks.map(function (task) {
				if (task === taskToChange){
					itemScope.setState({title: ticketData.Entries[0].Title});
					var isFavorite = scope.checkIfFavorite(value);
	  				return Utils.extend({}, task,
							{ticketID: value,
							projectID: ticketData.Entries[0].ProjectID,
					      	title: ticketData.Entries[0].Title,
					      	isFavorite: isFavorite,
					      	categoryID: null,
					      	Multibill: null,
					      	hasChanged: true});
  				}
  				else
  					return task;
  			});
  			scope.inform();
  		}).fail(function(error){
			scope.tasks = scope.tasks.map(function (task) {
				if (task === taskToChange)
					return Utils.extend({}, task, {ticketID: value, projectID: null, isFavorite: false, hasChanged: true});
				else
  					return task;
  			});
  			scope.inform();
  		});
  	}
  	
};

TaskModel.prototype.checkIfFavorite = function(ticket){
	var isFav = false;
	if (ticket){
		this.favorites.forEach(function (fav) {
			if (ticket == fav.ticketID){
				isFav =  true;
			}
			   	
		});
	}

	return isFav;
}

TaskModel.prototype.handleTitleChange = function (taskToChange, value) {
		
	  	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange)
			   	return Utils.extend({}, task, {title: value, categoryID: null});
			
			return task;
		});

		this.inform();
};

TaskModel.prototype.handleDateChange = function (taskToChange, date) {
	  	if(Moment(date, "YYYY-MM-DD").isValid()){
	  		this.tasks = this.tasks.map(function (task) {
				if (task === taskToChange){
					
					var start = task.startTime;
					var stop = task.stopTime;
				 	start = Moment(date, "YYYY-MM-DD").hour(Moment(start).hour()).minute(Moment(start).minute()).second(Moment(start).second()).format();
				 	stop = Moment(date, "YYYY-MM-DD").hour(Moment(stop).hour()).minute(Moment(stop).minute()).second(Moment(stop).second()).format();	
				 	
				   	return Utils.extend({}, task, {startTime: start, stopTime: stop});

				}
				return task;
			});
			this.inform();
		}
		
};

TaskModel.prototype.handleNoteChange = function (taskToChange, value) {
	  	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange)
			   	return Utils.extend({}, task, {note: value});
			
			return task;
		});

		this.inform();
};

TaskModel.prototype.handleNonProjectChange = function(taskToChange, value, nonBillables){
	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange){
				for (var i = 0; i < nonBillables.Entries.length; i++)
				{
					if(nonBillables.Entries[i].TimeSheetCategoryID === value)
						return Utils.extend({}, task, {categoryID: value, isFavorite: false, title: nonBillables.Entries[i].Name, projectID: null, ticketID: null, hasChanged: true, Multibill: null});	
				}
				return Utils.extend({}, task, {categoryID: value, isFavorite: false, title: "", projectID: null, ticketID: null, hasChanged: true, Multibill:null});	
			}
			return task;
		});

		this.inform();
};

TaskModel.prototype.handleMultibillChange = function(taskToChange, value){
	var scope = this;
	this.tasks = this.tasks.map(function (task) {
		if (task === taskToChange){
			for (var i = 0; i < scope.Multibill.length; i++)
			{
				if(parseInt(scope.Multibill[i].id) === parseInt(value)){
					return Utils.extend({}, task, {categoryID: null, isFavorite: false, title: scope.Multibill[i].title, projectID: null, ticketID: null, hasChanged: true, Multibill: value});	
				}
			}
			return Utils.extend({}, task, {categoryID: null, isFavorite: false, title: "", projectID: null, ticketID: null, hasChanged: true, Multibill: value});	
		}
		return task;
	});

	this.inform();
};

TaskModel.prototype.handleMultibillTitleChange = function (id, value){
	var scope = this;
	this.Multibill = this.Multibill.map(function (item) {
		if (parseInt(item.id) === parseInt(id)){
			return Utils.extend({}, item, {title: value});
		}
		return item;
	});

	this.tasks = this.tasks.map(function (task) {
		if (parseInt(task.Multibill) === parseInt(id)){
			return Utils.extend({}, task, {title: value});
		}
		return task;
	});

	this.inform();
}

TaskModel.prototype.handleStartStopChange = function (taskToChange, start, stop) {
	  	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange){
			 	start = Moment(start, 'HH:mm:ss').format();
			 	stop = Moment(stop, 'HH:mm:ss').format();
		      	if (Moment(start).isValid() && Moment(stop).isValid() && task.stopTime){
		      		start = Moment(task.startTime, "YYYY-MM-DD").hour(Moment(start).hour()).minute(Moment(start).minute()).second(Moment(start).second()).format();
		      		stop = Moment(task.startTime, "YYYY-MM-DD").hour(Moment(stop).hour()).minute(Moment(stop).minute()).second(Moment(stop).second()).format();
				 	
				 	return Utils.extend({}, task, {startTime: start, stopTime: stop, hasChanged: true});
		      		
		      	}
		      	else if (Moment(start).isValid()){
		      		start = Moment(task.startTime, "YYYY-MM-DD").hour(Moment(start).hour()).minute(Moment(start).minute()).second(Moment(start).second()).format();
		      		return Utils.extend({}, task, {startTime: start, hasChanged: true});
		      	}
			    else if (Moment(stop).isValid()){
			    	stop = Moment(task.startTime, "YYYY-MM-DD").hour(Moment(stop).hour()).minute(Moment(stop).minute()).second(Moment(stop).second()).format();
			    	return Utils.extend({}, task, {stopTime: stop, hasChanged: true});
			    }
				    
			}
			return task;
		});

		this.inform();
};

TaskModel.prototype.destroy = function (task) {
	this.tasks = this.tasks.filter(function (candidate) {
		return candidate !== task;
	});

	this.inform();
};

TaskModel.prototype.save = function (taskToSave, text) {
	this.tasks = this.tasks.map(function (task) {
		return task !== taskToSave ? task : Utils.extend({}, task, {title: text});
	});

	this.inform();
};


module.exports = TaskModel;

