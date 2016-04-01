
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var tasks = null;
var recentNewestFirst = false;

var FavoriteTasks = React.createClass({
  getInitialState: function() {
    return {
      showFavorite: false
    };
  },
  componentDidMount: function(){
    this.updateFavorites();
  },
  componentDidUpdate: function(){
    this.updateFavorites();
  },
  updateFavorites: function(){
    tasks = this.props.favorites;      
  },
  onPlay: function(ticketid, event){
    var task = null;
    for (var i = 0; i < tasks.length; i++)
    {
      if (tasks[i].ticketID === ticketid){
        task = {
          title: tasks[i].title,
          ticketID: tasks[i].ticketID,
          projectID: tasks[i].projectID
        };
        break;
      }
    }
    if (task)
      this.props.onPlay(task);
  },
  onDestroy: function(task, event){
    this.props.model.removeFavorite(task);
  },
  dragStart: function(ticketid, event){
    var url = "https://genome.klick.com/tickets/#/details/" + ticketid;
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/uri-list", url);
    event.dataTransfer.setData("text/plain", url);
  },
	render: function() {
    var taskList;
    var scope = this;
    if (tasks === null)
      taskList = "Loading...";
    else if (tasks === "fail")
      taskList = "Failed to load recent tasks from Genome."
    else if (tasks.length === 0)
      taskList = "No entries found";
    else{
      tasks = _.sortBy(tasks, function(o){ return o.ticketID; });
      
      taskList = tasks.map(function (task) {
        return (
          <li className='task'>
            <div className="task-wrapper" draggable="true" onDragStart={scope.dragStart.bind(scope, task.ticketID)}>
              <div className="recent-ticketID-wrapper">
                <label>
                  {task.ticketID}
                </label>
              </div>
              <div className="recent-task-wrapper">
                <label>
                   <span title={task.title}>{task.title}</span>
                   <span className="recent-project-wrapper" title={task.ProjectName}>{task.ProjectName}</span>
                </label>
              </div>
              <div className="controls">
                <a className="play" onClick={scope.onPlay.bind(scope, task.ticketID)}><i className="fa fa-play"></i></a>
                <a className="destroy" onClick={scope.onDestroy.bind(scope, task)} title="Remove this task from favorites"><i className="fa fa-remove"></i></a>
              </div>
            </div>
          </li>
        );
      });
    }
     
   return (

      <section id="favorites" className={this.props.showFavorite ? "open" : ""}>
          <a className="arrow" onClick={this.props.toggleFavorite} title="Favorite Tasks">
            Favorite Tasks <i className="fa fa-star"></i>      
          </a>
          <div className="content-wrapper">
            <ul className="content">
              {taskList}
            </ul>
          </div>
        </section>

    );
  }
});

module.exports = FavoriteTasks;