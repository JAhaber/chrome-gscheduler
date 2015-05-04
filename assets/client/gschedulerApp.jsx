
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
var TAB_KEY = 9;

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

  saveTaskTitle: function(title, e) {
    saveTask = {title: title};
    this.handleNoteKeyDown(e)
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
    if (saveTask)
      saveTask.note = $('#new-note').val();
    else
     saveTask = {title: $('#new-note').val()};
    this.props.model.addTask(saveTask);

    this.clearText();

    $('#new-task').focus();
  },
  clearText: function(){
    $('.typeahead').typeahead('val', '');
    $('#new-note').val('');
    saveTask = null;
    console.log("Clear");
  },
  
  stopTask: function (task) {
    chrome.runtime.sendMessage({running: false}, function(response) {});
    this.stop(task);
  },
  stop: function (task) {
    chrome.browserAction.setBadgeText({text : ""});
    this.props.model.stop(task);
  },

  stopAll: function() {
    _.each(this.props.model.tasks, this.stop);
  },

  destroy: function (task) {
    if (!(task.stopTime))
    {
      chrome.browserAction.setBadgeText({text : ""});
      chrome.runtime.sendMessage({running: false}, function(response) {});
    }
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
    chrome.runtime.sendMessage({running: false}, function(response) {});
    var tasks = scope.props.model.tasks;
    if (tasks.length > 0) {
      GenomeAPI.postTimeEntries(tasks)
      .then(function(data){
        _.each(tasks, scope.destroy);
      });
    }
  },
  
  handleTitleChange: function(task, value){
      this.props.model.handleTitleChange(task, value);  
  },
  handleIdChange: function(task, value, scope){
      this.props.model.handleIdChange(task, value, scope);  
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
  handleDateChange: function(task){
      this.props.model.handleDateChange(task);  
  },
  openOptions: function(){
    chrome.tabs.create({ url : 'chrome://extensions?options=' + chrome.runtime.id});
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
    var model = this.props.model;
    var tasks = this.props.model.tasks;
    var sortedList = _.sortBy(tasks, function(o){ return o.startTime; });
    sortedList.reverse();
    var TodayFirst = [];

     _.each(sortedList, function(l){

      if(Moment(l.startTime).isSame(curDate, 'day' ))
        TodayFirst.push(l);
    });
    _.each(sortedList, function(l){
      if(!(Moment(l.startTime).isSame(curDate, 'day' )))
        TodayFirst.push(l);
    });
    
    var taskItems = TodayFirst.map(function (task) {

      if(Moment(task.startTime).isSame(curDate, 'day' ))
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
            model={model}
            onPlay={this.createTask.bind(this, task)}
            onStop={this.stopTask.bind(this, task)}
            onDestroy={this.destroy.bind(this, task)}
            expandItems={this.expand.bind(this,task)}
            contractItems={this.contract.bind(this,task)}
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
          <a className="options" onClick={this.openOptions}>
            <i className="fa fa-cog"></i>
          </a>
          <button disabled={taskItems.length ? "" : "disabled"} type="button" onClick={this.save}>Save</button>
          
        </footer>

      </div>
    );
  }
});

module.exports = GSchedulerApp;



