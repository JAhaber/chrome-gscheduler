
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var $ = require('jquery');
var showRecent = false;
var tasks = null;

var RecentTasks = React.createClass({
  toggleRecent: function(){
    showRecent = !showRecent;
    if (showRecent){
      GenomeAPI.getUser().then(function(user){
        return GenomeAPI.getSchedule(user.UserID);
      }).then(function(results){
        tasks = [];
        for (var i = 0; i < results.Entries.length; i++)
        {
          if (results.Entries[i].Type === "Project"){
              GenomeAPI.getProjectInfo(results.Entries[i].TicketID).then(function(ticket){
                tasks.push(ticket.Entries[0]);
              });              
          }
        }
      }).fail(function(err){
        tasks = "fail";
      });
      $("#recent").addClass("open");
    }
    else{
      tasks = null;
      $("#recent").removeClass("open");
    }
      
     
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
    console.log($(event.target).data("ticketid"));
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
      tasks = _.sortBy(tasks, function(o){ return o.TicketID; });
      tasks = _.uniq(tasks, true, function(o){ return o.TicketID; });
      taskList = tasks.map(function (task) {
        return (
          <li className='task'>
            <div className="task-wrapper" draggable="true" onDragStart={scope.dragStart} data-ticketid={task.TicketID}>
              <div className="recent-ticketID-wrapper">
                <label>
                  {task.TicketStatusName === "closed" ?
                    <i className="fa fa-lock" title="This task is closed in genome. You can still bill to it if the project is open."></i>
                    : <i className="fa fa-unlock-alt" title="This task is open in genome."></i>
                  }
                  
                  {" " + task.TicketID}
                </label>
              </div>
              <div className="recent-task-wrapper">
                <label>
                   <span>{task.Title}</span>
                   <span className="recent-project-wrapper">{task.ProjectName}</span>
                </label>
              </div>
              <div className="controls">
                <a className="play" onClick={scope.onPlay} data-ticketid={task.TicketID}><i className="fa fa-play" data-ticketid={task.TicketID}></i></a>
              </div>
            </div>
          </li>
        );
      });
    }
     
   return (

      <section id="recent">
          <a className="arrow" onClick={this.toggleRecent} title="Recent Tasks">
          Recent Tasks
            <i className="fa up fa-arrow-circle-o-up"></i>
            <i className="fa down fa-arrow-circle-o-down"></i>
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


module.exports = RecentTasks;