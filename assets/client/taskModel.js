var Utils = require('../utils.js');
var Moment = require('moment');
var GenomeAPI = require('./GenomeAPI.js');
var $ = require('jquery');
var Q = require('q');

var TaskModel = function (key) {
	this.key = key;
	this.tasks = Utils.store(key);
	this.tasks.forEach(function(task){
		if (!(task.stopTime)){
			chrome.runtime.sendMessage({running: true}, function(response) {});
		}
	});
	this.onChanges = [];
};


TaskModel.prototype.subscribe = function (onChange) {
	this.onChanges.push(onChange);
};

TaskModel.prototype.inform = function () {
	Utils.store(this.key, this.tasks);
	this.onChanges.forEach(function (cb) { cb(); });
};

TaskModel.prototype.addTask = function (task, start, stop) {
	var newTask = {
		id: Utils.uuid(),
		title: task.title,
		startTime: start || Moment().format(),
		ticketID: task.ticketID || null,
		projectID: task.projectID || null,
		isClientBillable: task.isClientBillable || null,
		type: task.type || null,
		note: task.note || null,
		categoryID: task.categoryID,
		gap: {}
	};
	if (stop){
		this.tasks = this.tasks.map(function (taskToStop) {
			return taskToStop !== task ?
				taskToStop :
				Utils.extend({}, taskToStop, { stopTime: stop });
		});
	}

	console.log('addTask:', newTask)
	chrome.runtime.sendMessage({running: true}, function(response) {});
	this.tasks.unshift(newTask);
	this.inform();
};

TaskModel.prototype.addGap = function (start, stop) {
	var newTask = {
		id: Utils.uuid(),
		title: "",
		startTime: start,
		stopTime: stop,
		ticketID: null,
		projectID: null,
		isClientBillable: null,
		type: null,
		note: null,
		categoryID: null,
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

TaskModel.prototype.stop = function (taskToStop) {
	this.tasks = this.tasks.map(function (task) {
		if(task === taskToStop)
		{	
			if (!task.stopTime){
				return Utils.extend({}, task, {stopTime: Moment(task.startTime).hour(Moment().hour()).minute(Moment().minute()).second(Moment().second()).millisecond(Moment().millisecond()).format() });
			}
		}
		return task;
	});
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
		
  		GenomeAPI.getProjectInfo(value).then(function(ticketData){
			scope.tasks = scope.tasks.map(function (task) {
				if (task === taskToChange){
			
		  			if (!(ticketData.Entries[0].TicketStatusName === "closed"))
		  			{	
		  	
		  				itemScope.setState({title: ticketData.Entries[0].Title});
		  				return Utils.extend({}, task,
								{ticketID: value,
								projectID: ticketData.Entries[0].ProjectID,
						      	title: ticketData.Entries[0].Title,
						      	categoryID: null});
		  			}
		  			else
		  				return Utils.extend({}, task, {ticketID: value});	
		  		
  				}
  				else
  					return task;
  			});
  			scope.inform();
  		}).fail(function(error){
			scope.tasks = scope.tasks.map(function (task) {
				if (task === taskToChange)
					return Utils.extend({}, task, {ticketID: value, projectID: null});
				else
  					return task;
  			});
  			scope.inform();
  		});

  		if (value === "") {
  			scope.tasks = scope.tasks.map(function (task) {
				if (task === taskToChange)
					return Utils.extend({}, task, {ticketID: value, projectID: null});
				else
  					return task;
  			});
  			scope.inform();
  		}
  		
};

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
						return Utils.extend({}, task, {categoryID: value, title: nonBillables.Entries[i].Name, projectID: null, ticketID: null, hasChanged: true});	
				}
				return Utils.extend({}, task, {categoryID: value, title: "", projectID: null, ticketID: null, hasChanged: true});	
			}
			return task;
		});

		this.inform();
};

TaskModel.prototype.handleStartStopChange = function (taskToChange, start, stop) {
	  	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange){
			 	start = Moment(start, 'HH:mm:ss').format();
			 	stop = Moment(stop, 'HH:mm:ss').format();
		      	if (Moment(start).isValid() && Moment(stop).isValid() && task.stopTime){
		      		start = Moment($("#" + task.id + "-date-edit").val(), "YYYY-MM-DD").hour(Moment(start).hour()).minute(Moment(start).minute()).second(Moment(start).second()).format();
		      		stop = Moment($("#" + task.id + "-date-edit").val(), "YYYY-MM-DD").hour(Moment(stop).hour()).minute(Moment(stop).minute()).second(Moment(stop).second()).format();
				 	
				 	return Utils.extend({}, task, {startTime: start, stopTime: stop, hasChanged: true});
		      		
		      	}
		      	else if (Moment(start).isValid()){
		      		start = Moment($("#" + task.id + "-date-edit").val(), "YYYY-MM-DD").hour(Moment(start).hour()).minute(Moment(start).minute()).second(Moment(start).second()).format();
		      		return Utils.extend({}, task, {startTime: start, hasChanged: true});
		      	}
			    else if (Moment(stop).isValid()){
			    	stop = Moment($("#" + task.id + "-date-edit").val(), "YYYY-MM-DD").hour(Moment(stop).hour()).minute(Moment(stop).minute()).second(Moment(stop).second()).format();
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

