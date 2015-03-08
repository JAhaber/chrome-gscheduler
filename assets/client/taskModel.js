var Utils = require('../utils.js');

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

TaskModel.prototype.addTask = function (title) {
	this.tasks.unshift({
		id: Utils.uuid(),
		title: title,
		startTime: Date.now(),
		paused: false
	});

	this.inform();
};

TaskModel.prototype.stop = function (taskToStop) {
	this.tasks = this.tasks.map(function (task) {
		return task !== taskToStop ?
			task :
			Utils.extend({}, task, {stopTime: Date.now() });
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

