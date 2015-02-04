

var Scheduler = React.createClass({
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
      <div className="scheduler">
        <h1>Projects</h1>
        <ProjectList data={this.state.data} />
      </div>
    );
  }
});

var ProjectList = React.createClass({
  render: function() {
    var projectNodes = this.props.data.map(function(project, index) {
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
          {this.props.projectID}
        </strong>
        <span>{this.props.children.toString()}</span>
      </li>
    );
  }
});


React.render(
  <Scheduler pollInterval={2000} />,
  document.getElementById('content')
);

