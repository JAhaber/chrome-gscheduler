var Utils = require('../utils.js');
var Moment = require('moment');

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
		type: task.type || null
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

TaskModel.prototype.handleChange = function (taskToChange, field) {

	this.tasks = this.tasks.map(function (task) {
		if (task === taskToChange){
			if (field === "title"){
		    	return Utils.extend({}, task, {title: document.getElementById(task.id + "-title-edit").value});
		    }
	      	else if (field === "id")
       			return Utils.extend({}, task, {ticketID: document.getElementById(task.id + "-ticketid-edit").value});
		        
		    else if (field === "start"){
		     	var start = Moment(document.getElementById(task.id + "-start-time-edit").value, 'HH:mm:ss DD/MM/YY').format();
		      	if (Moment(start).isValid())
			        return Utils.extend({}, task, {startTime: start});
			}
			  
		    else if (field === "stop"){
			    var stop = Moment(document.getElementById(task.id + "-stop-time-edit").value, 'HH:mm:ss DD/MM/YY').format();
			    if (Moment(stop).isValid())
		        	return Utils.extend({}, task, {stopTime: stop});
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

