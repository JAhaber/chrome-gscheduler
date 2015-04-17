
var React = require('react');
var _ = require('underscore');
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
    window.onblur = this.closeScheduler;
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
    this.stopAll();
    var task = {title: title};
    this.addTask(task);
  },

  addTask: function (task) {
    this.stopAll();
    this.props.model.addTask(task);
  },

  stop: function (task) {
    this.props.model.stop(task);
  },

  stopAll: function() {
    _.each(this.props.model.tasks, this.stop);
  },

  destroy: function (task) {
    this.props.model.destroy(task);
  },
  
  expand: function(task){
    this.props.model.expand(task);
  },

  contract: function(task){
    this.props.model.contract(task);
  },

  save: function () {
    var scope = this;
    scope.stopAll();

    var tasks = scope.props.model.tasks;
    if (tasks.length > 0) {
      GenomeAPI.postTimeEntries(tasks)
      .then(function(data){
        _.each(tasks, scope.destroy);
      });
    }
  },

  closeScheduler: function() {
    window.close();
  },

  getTotalTaskTime: function(tasks) {
    var totalElapsedMilliseconds = _.reduce(tasks, function(totalElapsedMilliseconds, task){
      var stopTime = !task.stopTime ? Moment().format() : task.stopTime;
      var elapsedMilliseconds = Moment.duration(Moment(stopTime).diff(Moment(task.startTime))).asMilliseconds();
      return totalElapsedMilliseconds + elapsedMilliseconds;
    }, 0);

    this.setState({totalTaskTime: Moment().hour(0).minute(0).second(totalElapsedMilliseconds/1000).format('H[hrs] mm[mins]')});
  },

  render: function() {
    var main;
    var tasks = this.props.model.tasks;

    var taskItems = tasks.map(function (task) {
      return (
        <TaskItem
          key={task.id}
          task={task}
          onPlay={this.createTask.bind(this, task.title)}
          onStop={this.stop.bind(this, task)}
          onDestroy={this.destroy.bind(this, task)}
          expandItems={this.expand.bind(this,task)}
          contractItems={this.contract.bind(this,task)}
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
        <div className="input-wrap">
          <SearchBox 
            onSelect={this.addTask} onCreate={this.createTask}
          />
          <input 
            id="new-note"
            type="text" 
            name="note" 
            className="form-control note" 
            placeholder="Note"
            
            />
        </div>
           <dl>
            <dt>Today</dt>
            <dd>{this.state.totalTaskTime}</dd>
          </dl>
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



