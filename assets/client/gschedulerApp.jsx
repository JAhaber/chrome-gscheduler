
var React = require('react');
var GenomeAPI = require('./GenomeAPI.js');
var TaskItem = require('./taskItem.jsx');
var SearchBox = require('./SearchBox.jsx');
var Moment = require('moment');

var GSchedulerApp = React.createClass({
  getInitialState: function() {
    return {
      tasks: [],
      totalTaskTime: ''
    };
  },
  componentDidMount: function() {
    // Router stuff to go here

    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  tick: function (val) {
    var tasks = this.props.model.tasks;
    this.getTotalTaskTime(tasks);
  },

  createTask: function(title) {
    var task = {title: title};
    this.addTask(task);
  },

  addTask: function (task) {
    this.props.model.addTask(task);
  },

  stop: function (task) {
    this.props.model.stop(task);
  },

  save: function () {
    var tasks = this.props.model.tasks;
    if (tasks.length > 0) {
      GenomeAPI.postTimeEntries(tasks).done();
    }
  },

  destroy: function (task) {
    this.props.model.destroy(task);
  },

  getTotalTaskTime: function(tasks) {
    var totalTaskTime = 0;
    var formatedTotalTaskTime = '';

    for (var i = tasks.length - 1; i >= 0; i--) {
      var task = tasks[i];
      var endTime = !task.stopTime ? new Date().valueOf() : task.stopTime;
      var elapsedMilliseconds = (endTime - task.startTime.valueOf());
      totalTaskTime += elapsedMilliseconds;
    };
    formatedTotalTaskTime = Moment().hour(0).minute(0).second(totalTaskTime/1000).format('H[hrs] mm[mins]');

    this.setState({totalTaskTime: formatedTotalTaskTime});
  },

  render: function() {
    var main;
    var tasks = this.props.model.tasks;

    var taskItems = tasks.map(function (task) {
      return (
        <TaskItem
          key={task.id}
          task={task}
          onPlay={this.addTask.bind(this, task.title)}
          onStop={this.stop.bind(this, task)}
          onDestroy={this.destroy.bind(this, task)}
        />
      );
    }, this);

    if (taskItems.length) {
      main = (
        <section id="main">
          <dl>
            <dt>Today</dt>
            <dd>{this.state.totalTaskTime}</dd>
          </dl>
          <ul id="task-list">
            {taskItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header id="header">
          <SearchBox 
            onSelect={this.addTask} onCreate={this.createTask}
          />
        </header>
        {main}
        <footer>
          <button type="button" onClick={this.save}>Save</button>
        </footer>
      </div>
    );
  }
});


module.exports = GSchedulerApp;



