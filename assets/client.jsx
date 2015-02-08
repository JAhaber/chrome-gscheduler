


var Scheduler = React.createClass({
    getInitialState: function() {
    var Background = chrome.extension.getBackgroundPage();
    console.log(Background);
    var timers = localStorage.getItem('genomeTimers') === null ? [] : JSON.parse(localStorage.getItem('genomeTimers'));
    return {
      recentProjects: [],
      timers: timers
    };
  },
  componentDidMount: function() {
    this.loadUserID();
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
  addTimer: function(timer) {
    var timers = this.state.timers;
    timers.push(timer);

    localStorage.setItem('genomeTimers', JSON.stringify(timers));
    this.setState({timers: timers});
  },
  render: function() {
    return (
      <div className="scheduler">
        <TimerCreator addTimer={this.addTimer} />

        <h2>Timers:</h2>
        <TimerList timers={this.state.timers} />

        <h2>Recently visited:</h2>
        <ProjectList projects={this.state.recentProjects} />
      </div>
    );
  }
});

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
    var timerNodes = this.props.timers.map(function(timer, index) {
      return (
        <Timer timerID={timer.ID} key={index}>
          {timer.shortDesc}
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

var Timer = React.createClass({
  render: function() {
    return (
      <li className="timer">
        {this.props.children.toString()}
      </li>
    );
  }
});


React.render(
  <Scheduler pollInterval={2000} />,
  document.getElementById('content')
);

