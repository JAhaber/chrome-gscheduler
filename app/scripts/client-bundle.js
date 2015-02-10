(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var GSchedulerApp = require('./client/gschedulerApp.jsx');
//var GSchedulerModel = require('./client/gschedulerModel.js');
//var model = new GSchedulerModel('gscheduler-tasks');

function render() {
  React.render(
    React.createElement(GSchedulerApp, null),
    document.getElementById('gschedulerapp')
  );
}

//model.subscribe(render);
render();
},{"./client/gschedulerApp.jsx":2}],2:[function(require,module,exports){
var Timer = require('./gschedulerItem.jsx');
var ENTER_KEY = 13;


var ProjectList = React.createClass({displayName: "ProjectList",
  render: function() {
    var projectNodes = this.props.projects.map(function(project, index) {
      return (
        React.createElement(Project, {projectID: project.ID, key: index}, 
          project.ShortDesc
        )
      );
    });
    return (
      React.createElement("ul", {className: "projectList"}, 
        projectNodes
      )
    );
  }
});

var Project = React.createClass({displayName: "Project",
  render: function() {
    return (
      React.createElement("li", {className: "project"}, 
        React.createElement("strong", {className: "projectID"}, 
          this.props.projectID, " :"
        ), 
        React.createElement("span", null, this.props.children.toString())
      )
    );
  }
});

var TimerCreator = React.createClass({displayName: "TimerCreator",
  componentDidMount: function() {
    this.refs.timerInput.getDOMNode().focus();
  },
  create: function(e){
    var newTimer = {
      shortDesc: this.refs.timerInput.getDOMNode().value
    };
    this.props.addTimer(newTimer);
    this.refs.timerInput.getDOMNode().value = '';
  },
  handleKeyDown: function(e) {
    if (e.which == 13)
    this.create();
  },
  render: function()  {
    return (
      React.createElement("div", {className: "timerCreator"}, 
        React.createElement("input", {ref: "timerInput", type: "text", placeholder: "Task or Project", onKeyDown: this.handleKeyDown}), 
        React.createElement("input", {type: "button", value: "Set", onClick: this.create})
      )
    );
  }
});

var TimerList = React.createClass({displayName: "TimerList",
  render: function() {
    var self = this;
    var timerNodes = this.props.timers.map(function(timer, index) {
      return (
        React.createElement(Timer, {key: index, removeTimer: self.props.removeTimer}, 
          timer.shortDesc +' - '+ timer.time
        )
      );
    }); 
    return (
      React.createElement("ul", {className: "timerList"}, 
        timerNodes
      )
    );
  }
});

var GSchedulerApp = React.createClass({displayName: "GSchedulerApp",
  getInitialState: function() {
    return {
      recentProjects: [],
      timers: []
    };
  },
  componentDidMount: function() {
    var self = this;
    chrome.runtime.onMessage.addListener(function(request, sender, respond) {
      if (request.updateTimers) {
        var newTimers = JSON.parse(request.updateTimers);
        self.updateTimers(newTimers);
      }
    });

    this.loadUserID();
  },
  handleNewTodoKeyDown: function(event) {
    if (event.which !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    var val = this.refs.newField.getDOMNode().value.trim();

    if (val) {
      this.props.model.addTodo(val);
      this.refs.newField.getDOMNode().value = '';
    }
  },
  loadUserID: function() {
    var currentUserEndPoint = 'http://genome.klick.com:80/api/User/Current';

    $.ajax({
      url: currentUserEndPoint,
      dataType: 'json',
      success: function(data) {
        this.setState({userID: data.Entries[0].UserID});
        this.loadProjectsFromServer();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(currentUserEndPoint, status, err.toString());
      }.bind(this)
    });
  },
  loadProjectsFromServer: function() {
    var genomeActivityEndPoint = 'http://genome.klick.com:80/api/GenomeActivity';
    var todayDate = new Date();
    todayDate = todayDate.getFullYear()+'-'+(todayDate.getMonth()+1)+'-'+todayDate.getDate();

    $.ajax({
      url: genomeActivityEndPoint,
      dataType: 'json',
      data: { 
        UserID: this.state.userID,
        Date: todayDate
      },
      success: function(data) {
        this.setState({recentProjects: data.Entries});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(currentUserEndPoint, status, err.toString());
      }.bind(this)
    });
  },
  updateTimers: function(timers) {
    this.setState({timers: timers});
  },
  addTimer: function(timer) {
    chrome.runtime.sendMessage({addTimer: JSON.stringify(timer)});
  },
  removeTimer: function(e) {
    console.log('REMOVE!');
    chrome.runtime.sendMessage({removeTimer: '0'});
  },
  render: function() {
    return (
      React.createElement("div", {className: "scheduler"}, 
        React.createElement(TimerCreator, {addTimer: this.addTimer}), 

        React.createElement("h2", null, "Timers:"), 
        React.createElement(TimerList, {timers: this.state.timers, removeTimer: this.removeTimer}), 

        React.createElement("h2", null, "Recently visited:"), 
        React.createElement(ProjectList, {projects: this.state.recentProjects})
      )
    );
  }
});

module.exports = GSchedulerApp;

},{"./gschedulerItem.jsx":3}],3:[function(require,module,exports){


var GSchedulerItem = React.createClass({displayName: "GSchedulerItem",
  render: function() {
    return (
      React.createElement("li", {className: "timer"}, 
        this.props.children.toString(), 
        React.createElement("i", {className: "fa fa-times-circle", onClick: this.props.removeTimer})
      )
    );
  }
});

module.exports = GSchedulerItem;
},{}]},{},[1]);
