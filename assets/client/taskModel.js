var Utils = require('../utils.js');
var Moment = require('moment');
var GenomeAPI = require('./GenomeAPI.js');
var $ = require('jquery');
var Q = require('q');

var TaskModel = function (key) {
	this.key = key;
	this.tasks = Utils.store(key);
	this.onChanges = [];
};


TaskModel.prototype.subscribe = function (onChange) {
	this.onChanges.push(onChange);
};

TaskModel.prototype.inform = function () {
	Utils.store(this.key, this.tasks);
	this.onChanges.forEach(function (cb) { cb(); });
};

TaskModel.prototype.addTask = function (task) {

	var newTask = {
		id: Utils.uuid(),
		title: task.title,
		startTime: Moment().format(),
		ticketID: task.ticketID || null,
		projectID: task.projectID || null,
		isClientBillable: task.isClientBillable || null,
		type: task.type || null,
		note: task.note || null
	};

	console.log('addTask:', newTask)

	this.tasks.unshift(newTask);
	this.inform();
};

TaskModel.prototype.stop = function (taskToStop) {
	this.tasks = this.tasks.map(function (task) {
		if(task === taskToStop)
		{	
			if (!task.stopTime){
				document.getElementById(task.id + "-stop-time-edit").value = Moment().format('HH:mm:ss DD/MM/YY');
				return Utils.extend({}, task, {stopTime: Moment().format() });
			}
		}
		return task;
	});

	this.inform();
};

TaskModel.prototype.expand = function (taskToExpand) {
	this.tasks = this.tasks.map(function (task) {
		return task !== taskToExpand ?
			task :
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

TaskModel.prototype.handleIdChange = function (taskToChange) {
		var scope = this;
		var ticketid = document.getElementById(taskToChange.id + "-ticketid-edit").value;
		//		return Utils.extend({}, task, {ticketID: ticketid});
		
  		GenomeAPI.getProjectInfo(ticketid).then(function(ticketData){
  						console.log("pass");
			scope.tasks = scope.tasks.map(function (task) {
				if (task === taskToChange){
			
		  			if (!(ticketData.Entries[0].TicketStatusName === "closed"))
		  			{	
		  	
		  				document.getElementById(task.id + "-title-edit").value = ticketData.Entries[0].Title;
		  				return Utils.extend({}, task,
								{ticketID: ticketid,
								projectID: ticketData.Entries[0].ProjectID,
						      	title: ticketData.Entries[0].Title});
		  			}
		  			else
		  				return Utils.extend({}, task, {ticketID: ticketid});	
		  		
  				}
  				else
  					return task;
  			});
  			scope.inform();
  		}).fail(function(error){
			console.log("fail");
			scope.tasks = scope.tasks.map(function (task) {
				if (task === taskToChange)
					return Utils.extend({}, task, {ticketID: ticketid, projectID: null});
				else
  					return task;
  			});
  			scope.inform();
  		});

  		if (ticketid === "") {
  			console.log("query");
  			scope.tasks = scope.tasks.map(function (task) {
				if (task === taskToChange)
					return Utils.extend({}, task, {ticketID: ticketid, projectID: null});
				else
  					return task;
  			});
  			scope.inform();
  		}
  		
};

TaskModel.prototype.handleTitleChange = function (taskToChange) {
	  	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange)
			   	return Utils.extend({}, task, {title: document.getElementById(task.id + "-title-edit").value});
			
			return task;
		});

		this.inform();
};

TaskModel.prototype.handleNoteChange = function (taskToChange) {
	  	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange)
			   	return Utils.extend({}, task, {note: document.getElementById(task.id + "-note-edit").value});
			
			return task;
		});

		this.inform();
};

TaskModel.prototype.handleStartChange = function (taskToChange) {
	  	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange){
			 	var start = Moment(document.getElementById(task.id + "-start-time-edit").value, 'HH:mm:ss DD/MM/YY').format();
		      	if (Moment(start).isValid())
			        return Utils.extend({}, task, {startTime: start});
				    
			}
			return task;
		});

		this.inform();
};

TaskModel.prototype.handleStopChange = function (taskToChange) {
	  	this.tasks = this.tasks.map(function (task) {
			if (task === taskToChange){
				var stop = Moment(document.getElementById(task.id + "-stop-time-edit").value, 'HH:mm:ss DD/MM/YY').format();
			    if (Moment(stop).isValid())
		        	return Utils.extend({}, task, {stopTime: stop});
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

