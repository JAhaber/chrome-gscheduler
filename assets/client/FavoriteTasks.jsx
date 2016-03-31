
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var $ = require('jquery');
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
    _.each($("#favorites .task"), function(el, i){
      if($("#favorites .task").eq(i).find(".play").attr("data-ticketid") !== undefined)
        $("#favorites .task").eq(i).find("task-wrapper").attr("draggable", true);
    });
      // GenomeAPI.getUser().then(function(user){
      //   return GenomeAPI.getSchedule(user.UserID);
      // }).then(function(results){
      //   tasks = [];
      //   for (var i = 0; i < results.Entries.length; i++)
      //   {
      //     if (results.Entries[i].Type === "Project"){
      //         GenomeAPI.getProjectInfo(results.Entries[i].TicketID).then(function(ticket){
      //           tasks.push(ticket.Entries[0]);
      //         });              
      //     }
      //   }
      // });
  },
  onPlay: function(event){
    var task = null;
    for (var i = 0; i < tasks.length; i++)
    {
      if (tasks[i].TicketID === $(event.target).data("ticketid")){
        task = {
          title: tasks[i].Title,
          ticketID: tasks[i].TicketID,
          projectID: tasks[i].ProjectID
        };
        break;
      }
    }
    if (task)
      this.props.onPlay(task);
  },
  dragStart: function(event){
    var url = "https://genome.klick.com/tickets/#/details/" + $(event.target).data("ticketid");
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
            <div className="task-wrapper" draggable="false" onDragStart={scope.dragStart} data-ticketid={task.ticketID}>
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
                <a className="play" onClick={scope.onPlay} data-ticketid={task.ticketID}><i className="fa fa-play" data-ticketid={task.ticketID}></i></a>
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