
var React = require('react');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var TaskItem = require('./taskItem.jsx');
var GapItem = require('./gapItem.jsx');
var SearchBox = require('./SearchBox.jsx');
var BuildLog = require('./BuildLog.jsx');
var TaskLists = require('./TaskLists.jsx');
var CustomStyles = require('./CustomStyles.jsx');
var Footer = require('./Footer.jsx');
var $ = require('jquery');
window.jQuery = $;
var Moment = require('moment');
var saveTask;
var ENTER_KEY = 13;
var TAB_KEY = 9;
var newestFirst = true;
var showBackup = true;
var nonBillables = { "Entries" : [] };
var genomeTask = null;
var messageInterval = null;

var GSchedulerApp = React.createClass({
  getInitialState: function() {
    return {
      tasks: [],
      totalTaskTime: '',
      showLog: false,
    };
  },
  componentDidMount: function() {
    //window.onblur = this.closeScheduler;
    this.interval = setInterval(this.tick, 1000);
    messageInterval = setInterval(this.checkMessage, 7200000);
    this.getNonBillables();
    this.checkMessage();
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
    clearInterval(messageInterval);
  },
  componentDidUpdate: function(){
    if(genomeTask) {
      this.createTask(genomeTask);
      genomeTask = null;
    }
  },
  checkMessage: function(){
    var message;
    var scope = this;
    GenomeAPI.getMessage().then(function(data){
      message = JSON.parse(data);
      if (scope.props.model.message.id < message.id){
        scope.props.model.updateMessage(message);
      }
    });
  },
  hideMessage: function(){
    this.props.model.hideMessage();
  },
  getNonBillables: function(){
      GenomeAPI.getNonBillableTasks().then(function(ticketData){
        nonBillables = ticketData;
      }).fail(function(error){
        nonBillables = "fail";
      });
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
    if ($('#new-note').val() !== "" || $('#new-task').val() !== ""){
      this.stopAll();
      if (saveTask)
        saveTask.note = $('#new-note').val();
      else if (!saveTask && $('#new-task').val() !== "")
        saveTask = {title: $('#new-task').val(), note: $('#new-note').val()};
      else
       saveTask = {title: $('#new-note').val()};
      this.props.model.addTask(saveTask);

      this.clearText();

      $('#new-task').focus();
    }
    
  },
  clearText: function(){
    $('.typeahead').typeahead('val', '');
    $('#new-note').val('');
    saveTask = null;
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
  extendNext: function(task){
    var taskToChange;
    _.each(this.props.model.tasks, function(l, id){
      if (l.id === task.gap.nextId){
        taskToChange = l;
      }
    });
    var start = Moment(taskToChange.startTime).subtract(task.gap.duration, 's').format();
    start = Moment(start).format("HH:mm:ss");
    this.props.model.handleStartStopChange(taskToChange, start, Moment(taskToChange.stopTime).format("HH:mm:ss"));
  },
  extendLast: function(task){
    var stop = Moment(task.stopTime).add(task.gap.duration, 's').format();
    stop = Moment(stop).format("HH:mm:ss");
    this.props.model.handleStartStopChange(task, Moment(task.startTime).format("HH:mm:ss"), stop);
  },
  backUp: function(tasks){
    this.props.model.backUp(tasks);
  },
  restoreTasks: function(){
    this.props.model.restoreBackUp();
  },
  removeBackup: function(){
    this.props.model.removeBackUp();
  },
  save: function () {
    var scope = this;
    scope.stopAll();
    chrome.runtime.sendMessage({running: false}, function(response) {});
    var tasks = scope.props.model.tasks;
    if (tasks.length > 0) {
      GenomeAPI.postTimeEntries(tasks)
      .then(function(data){scope.backUp(tasks);})
      .then(function(data){
        _.each(tasks, scope.destroy);
      }).then(function(){console.log(scope.props.model.backup);});
    }
  },
  openGenome: function(task){
    var date = Moment(task.startTime).format("YYYY-MM-DD") || Moment().format("YYYY-MM-DD");
    chrome.tabs.create({ url : 'https://genome.klick.com/scheduler/#/day/' + date});
  },
  clearTasksByDate: function(task){
    var scope = this;
    var date = Moment(task.startTime).format("YYYY-MM-DD") || Moment().format("YYYY-MM-DD");
    _.each(this.props.model.tasks, function(l){
      if(Moment(l.startTime).isSame(date, 'day' ))
        scope.destroy(l);
    });
  },
  
  closeScheduler: function() {
    window.close();
  },

  getTotalTaskTime: function(tasks) {
    var totalElapsedMilliseconds = _.reduce(tasks, function(totalElapsedMilliseconds, task){
      if(Moment(task.startTime).isSame(Moment(), 'day' )){
        var stopTime = !task.stopTime ? Moment().format() : task.stopTime;
        var elapsedMilliseconds = Moment.duration(Moment(stopTime).diff(Moment(task.startTime))).asMilliseconds();
        return totalElapsedMilliseconds + elapsedMilliseconds;  
      }
      else
        return totalElapsedMilliseconds
    }, 0);

    this.setState({totalTaskTime: Moment().hour(0).minute(0).second(totalElapsedMilliseconds/1000).format('H[hrs] mm[mins]')});
  },
  toggleLog: function(){
    this.setState({showLog: !this.state.showLog});
    
  },
  render: function() {
    var main;
    var curDate = Moment();
    var newDate = null;
    var model = this.props.model;
    var tasks = this.props.model.tasks;
    var sortedList = _.sortBy(tasks, function(o){ return o.startTime; });
    if (nonBillables === "fail")
    {
      nonBillables = { "Entries" : [] };
      this.getNonBillables();
    }
    
    if(sortedList.length > 1){
      _.each(sortedList, function(l, id){
        l.gap = {};
        if (id < sortedList.length - 1)
        {
          if (Moment(l.stopTime).isAfter(Moment(sortedList[id + 1].startTime)))
            l.overlap = true;
          else
            l.overlap = false;
          if(Moment(l.startTime).isSame(sortedList[id+1].startTime, 'day')){
            if (Moment.duration(Moment(sortedList[id+1].startTime).diff(Moment(l.stopTime))).asMinutes() >= 1){
              l.gap.duration = Moment.duration(Moment(sortedList[id+1].startTime).diff(Moment(l.stopTime))).asSeconds();
              l.gap.nextId = sortedList[id+1].id;
              l.gap.hasGap = true;
            }
            else
              l.gap.hasGap = false;
          }
          else
            l.gap.hasGap = false;
        }
        else{
          l.overlap = false;
          l.gap.hasGap = false;
        }
          
      });
    }
    else if (sortedList.length === 1){
      sortedList[0].overlap = false;
      sortedList[0].gap.hasGap = false;
    }

    if (newestFirst === true)
      sortedList.reverse();

    var TodayFirst = [];

    _.each(sortedList, function(l){

     if(Moment(l.startTime).isSame(curDate, 'day' ))
        TodayFirst.push(l);
    });

    _.each(sortedList, function(l, id){
      
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
            <span onClick={this.openGenome.bind(this,task)} title={"Open " + Moment(curDate).format('MMMM D, YYYY') + " in Genome"}>{Moment(curDate).format('MMMM D, YYYY')}</span>
            <a className="remove-day" onClick={this.clearTasksByDate.bind(this,task)} title={"Remove all entries from " + Moment(curDate).format('MMMM D, YYYY')}>Remove all&nbsp;&nbsp;<i className="fa fa-remove"></i></a>
          </label>
          );
      }
      return (
          <span>
          {newDate}
          {newestFirst ?
            <span>
            {task.gap.hasGap ?
            <GapItem 
            task={task}
            model={this.props.model}
            gap={task.gap}
            newestFirst={newestFirst}
            onLast={this.extendLast.bind(this, task)}
            onNext={this.extendNext.bind(this, task)}
             />

            : ""}
            </span>
          : ""}
          
          <TaskItem
            key={task.id}
            task={task}
            model={model}
            nonBillables={nonBillables}
            onPlay={this.createTask.bind(this, task)}
            onStop={this.stopTask.bind(this, task)}
            onDestroy={this.destroy.bind(this, task)}
            expandItems={this.expand.bind(this,task)}
            contractItems={this.contract.bind(this,task)}
          />
          {!newestFirst ? 
            <span>
            {task.gap.hasGap ?
            <GapItem 
            task={task}
            model={this.props.model}
            gap={task.gap}
            newestFirst={newestFirst}
            onLast={this.extendLast.bind(this, task)}
            onNext={this.extendNext.bind(this, task)}
             />
            : ""}
            </span>
          : ""}
          </span>
        );
      
      
    }, this);
    
    main = (
      <section id="main">
        {taskItems.length ?
          <div className="todayInfo">
            <div className="today" onClick={this.openGenome} title="Open today in genome">Today</div>
            <div className="duration">{this.state.totalTaskTime}</div>
          </div>
        : "" }
        {taskItems.length ?
          <ul id="task-list">
            {taskItems}
          </ul>
        : "" }

        {this.props.model.message.show ? 
          <div className="showMessage" onClick={this.hideMessage}>
            {this.props.model.message.value}
            <div className="close-msg">
              Click to permanently hide this notification
            </div>
          </div> : ""
        }

        {this.props.model.backup.length > 0 && showBackup ?
          <span className="restore-tasks">
            <a className="restore" title="Restore the last set of tasks that were saved to Genome. This will not affect any new tasks." onClick={this.restoreTasks}>Restore from Backup <i className="fa fa-undo"></i></a>
            <br /><a className="remove" onClick={this.removeBackup}>Remove Backup <i className="fa fa-trash"></i></a>
          </span>
        : ""}
        
      </section>
    );
   
    return (
      <div className={this.props.model.skin === "custom" || this.props.model.skin === "" ? "" : "skin-" + this.props.model.skin}>
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

        <TaskLists onPlay={this.createTask} model={this.props.model} />
        <Footer toggleLog={this.toggleLog} length={taskItems.length} save={this.save} />        
        {this.state.showLog ? 
        <BuildLog closeLog={this.toggleLog} />
        : ""}

        <CustomStyles model={this.props.model}/>
      </div>
    );
  }
});

$("html").on("dragover", function(e){
  e.preventDefault();
  e.stopPropagation();
});
$("html").on("drop", function(e){
  e.preventDefault();
  e.stopPropagation();
});
chrome.storage.sync.get({
    newestFirst: true,
    showBackup: true
  }, function(items) {
    newestFirst = items.newestFirst;
    showBackup = items.showBackup;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
    newestFirst: true,
    showBackup: true
  }, function(items) {
    newestFirst = items.newestFirst;
    showBackup = items.showBackup;
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var scope = this;
    if ('newTask' in request){
      genomeTask = request.newTask;
    }
  });


module.exports = GSchedulerApp;       