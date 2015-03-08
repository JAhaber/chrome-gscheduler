
var React = require('react');
var TaskItem = require('./taskItem.jsx');
var ENTER_KEY = 13;


var GSchedulerApp = React.createClass({
  getInitialState: function() {
    return {
      tasks: []
    };
  },
  componentDidMount: function() {
    // Router stuff
  },
  handleNewTaskKeyDown: function(event) {
    if (event.which !== ENTER_KEY) {
      return;
    }
    event.preventDefault();

    var val = this.refs.newField.getDOMNode().value.trim();

    if (val) {
      this.addTask(val);
      this.refs.newField.getDOMNode().value = '';
    }
  },

  addTask: function (val) {
    this.props.model.addTask(val);
  },

  stop: function (task) {
    this.props.model.stop(task);
  },

  destroy: function (task) {
    this.props.model.destroy(task);
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
          <ul id="task-list">
            {taskItems}
          </ul>
        </section>
      );
    }

    return (
      <div>
        <header id="header">
          <input
            type="text"
            ref="newField"
            id="new-task"
            placeholder="Task Name/ID"
            onKeyDown={this.handleNewTaskKeyDown}
            autoFocus={true}
          />
          <a className="play"><i className="fa fa-play"></i></a>
        </header>
        {main}
      </div>
    );
  }
});


module.exports = GSchedulerApp;



