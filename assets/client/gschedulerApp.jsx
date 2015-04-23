
var React = require('react');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var TaskItem = require('./taskItem.jsx');
var SearchBox = require('./SearchBox.jsx');
var $ = require('jquery');
window.jQuery = $;
var Moment = require('moment');
var saveTask;
var ENTER_KEY = 13;

var GSchedulerApp = React.createClass({
  getInitialState: function() {
    return {
      tasks: [],
      totalTaskTime: ''
    };
  },
  componentDidMount: function() {
    //window.onblur = this.closeScheduler;
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  tick: function (val) {
    var tasks = this.props.model.tasks;
    this.getTotalTaskTime(tasks);
  },

  createTask: function(task) {
    this.stopAll();
    this.props.model.addTask(task);
  },

  saveTaskTitle: function(title) {
    saveTask = {title: title};
  },

  addTask: function (task) {
    //this.stopAll();
    //this.props.model.addTask(task);
    saveTask = task;
  },

  handleNoteKeyDown: function(event){
    if (event.which !== ENTER_KEY) {
      return;
    }
    this.stopAll();
    saveTask.note = $('#new-note').val();
    this.props.model.addTask(saveTask);
    $('.typeahead').val('');
    $('#new-note').val('');
    saveTask = null;
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
  
  handleTitleChange: function(task){
      this.props.model.handleTitleChange(task);  
  },
  handleIdChange: function(task){
      this.props.model.handleIdChange(task);  
  },
  handleStartChange: function(task){
      this.props.model.handleStartChange(task);  
  },
  handleStopChange: function(task){
      this.props.model.handleStopChange(task);  
  },
  handleNoteChange: function(task){
      this.props.model.handleNoteChange(task);  
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
    var curDate = Moment();
    var newDate = null;

    var tasks = this.props.model.tasks;
    var sortedList = _.sortBy(tasks, function(o){ return o.startTime; });
    sortedList.reverse();
    var TodayFirst = [];

     _.each(sortedList, function(l){
      if(Moment(l.startTime).date() === curDate.date())
        TodayFirst.push(l);
    });
    _.each(sortedList, function(l){
      if(!(Moment(l.startTime).date() === curDate.date()))
        TodayFirst.push(l);
    });
    
    var taskItems = TodayFirst.map(function (task) {

      if(Moment(task.startTime).date() === curDate.date())
        newDate = null;
      else{
        curDate = Moment(task.startTime);
        newDate = (
          <label className="date-label">
          {Moment(curDate).format('MMMM D, YYYY')}
          </label>
          );
      }
      return (
          <span>
          {newDate}
          <TaskItem
            key={task.id}
            task={task}
            onPlay={this.createTask.bind(this, task)}
            onStop={this.stop.bind(this, task)}
            onDestroy={this.destroy.bind(this, task)}
            expandItems={this.expand.bind(this,task)}
            contractItems={this.contract.bind(this,task)}
            titleChange={this.handleTitleChange.bind(this,task)}
            idChange={this.handleIdChange.bind(this,task)}
            startChange={this.handleStartChange.bind(this,task)}
            stopChange={this.handleStopChange.bind(this,task)}
            noteChange={this.handleNoteChange.bind(this,task)}
          />
          </span>
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
        <div className="input-wrap">
          <SearchBox
            id="new-task"
            name="search"
            placeholder="Task name/ID"
            onSelect={this.addTask} onCreate={this.saveTaskTitle}
          />
          <input 
            id="new-note"
            type="text" 
            name="note" 
            className="form-control note" 
            placeholder="Note"
            onKeyDown={this.handleNoteKeyDown}
            />
        </div>
           
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



