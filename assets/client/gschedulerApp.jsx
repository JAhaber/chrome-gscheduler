var Timer = require('./gschedulerItem.jsx');
var ENTER_KEY = 13;


var ProjectList = React.createClass({
  render: function() {
    var projectNodes = this.props.projects.map(function(project, index) {
      return (
        <Project projectID={project.ID} key={index}>
          {project.ShortDesc}
        </Project>
      );
    });
    return (
      <ul className="projectList">
        {projectNodes}
      </ul>
    );
  }
});

var Project = React.createClass({
  render: function() {
    return (
      <li className="project">
        <strong className="projectID">
          {this.props.projectID}&nbsp;:
        </strong>
        <span>{this.props.children.toString()}</span>
      </li>
    );
  }
});

var TimerCreator = React.createClass({
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
      <div className="timerCreator">
        <input ref="timerInput" type="text" placeholder="Task or Project" onKeyDown={this.handleKeyDown} />
        <input type="button" value="Set" onClick={this.create} />
      </div>
    );
  }
});

var TimerList = React.createClass({
  render: function() {
    var self = this;
    var timerNodes = this.props.timers.map(function(timer, index) {
      return (
        <Timer key={index} removeTimer={self.props.removeTimer} >
          {timer.shortDesc +' - '+ timer.time}
        </Timer>
      );
    }); 
    return (
      <ul className="timerList">
        {timerNodes}
      </ul>
    );
  }
});

var GSchedulerApp = React.createClass({
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
      <div className="scheduler">
        <TimerCreator addTimer={this.addTimer} />

        <h2>Timers:</h2>
        <TimerList timers={this.state.timers} removeTimer={this.removeTimer} />

        <h2>Recently visited:</h2>
        <ProjectList projects={this.state.recentProjects} />
      </div>
    );
  }
});

module.exports = GSchedulerApp;
