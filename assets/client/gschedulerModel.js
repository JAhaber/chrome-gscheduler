var Utils = require('../utils.js');

var GSchedulerModel = function (key) {
	this.key = key;
	this.tasks = Utils.store(key);
	this.onChanges = [];
};

GSchedulerModel.prototype.subscribe = function (onChange) {
	this.onChanges.push(onChange);
};

GSchedulerModel.prototype.inform = function () {
	Utils.store(this.key, this.tasks);
	this.onChanges.forEach(function (cb) { cb(); });
};

GSchedulerModel.prototype.addTask = function (title) {
	this.tasks = this.tasks.concat({
		id: Utils.uuid(),
		title: title,
		startTime: Date.now(),
		paused: false
	});

	this.inform();
};

GSchedulerModel.prototype.togglePaused = function (taskToToggle) {
	this.tasks = this.tasks.map(function (task) {
		return task !== taskToToggle ?
			task :
			Utils.extend({}, task, {paused: !task.paused });
	});

	this.inform();
};

GSchedulerModel.prototype.destroy = function (task) {
	this.tasks = this.tasks.filter(function (candidate) {
		return candidate !== task;
	});

	this.inform();
};

GSchedulerModel.prototype.save = function (taskToSave, text) {
	this.tasks = this.tasks.map(function (task) {
		return task !== taskToSave ? task : Utils.extend({}, task, {title: text});
	});

	this.inform();
};

module.exports = GSchedulerModel;

