

var Scheduler = React.createClass({displayName: "Scheduler",
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

    $.ajax({
      url: genomeActivityEndPoint,
      dataType: 'json',
      data: { 
        UserID: this.state.userID, 
        Date: '2015-02-03'
      },
      success: function(data) {
        this.setState({data: data.Entries});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(currentUserEndPoint, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadUserID();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      React.createElement("div", {className: "scheduler"}, 
        React.createElement("h1", null, "Projects"), 
        React.createElement(ProjectList, {data: this.state.data})
      )
    );
  }
});

var ProjectList = React.createClass({displayName: "ProjectList",
  render: function() {
    var projectNodes = this.props.data.map(function(project, index) {
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
          this.props.projectID
        ), 
        React.createElement("span", null, this.props.children.toString())
      )
    );
  }
});


React.render(
  React.createElement(Scheduler, {pollInterval: 2000}),
  document.getElementById('content')
);

