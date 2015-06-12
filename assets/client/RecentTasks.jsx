
var React = require('react');
var Moment = require('moment');
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
            var match = false;
            for (var j = 0; j < tasks.length; j++)
            {
              if (results.Entries[i].TicketID === tasks[j].TicketID){
                match = true;
                break;
              }
            }
            if (!match)
              tasks.push(results.Entries[i]);
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
	render: function() {
    var taskList;
    if (tasks === null)
      taskList = "Loading...";
    else if (tasks === "fail")
      taskList = "Failed to load recent tasks from Genome."
    else if (tasks.length === 0)
      taskList = "No entries found";
    else{
      taskList = tasks.map(function (task) {
        return (
          <li className='task'>
            <div className="task-wrapper" draggable onDragStart={this.dragStart} id={task.id + "-draggable"}>
              <label>
                {task.TicketID}
              </label>
              <label>
                {task.TicketTitle}
              </label>
           
              <div className="controls">
                <a className="play"><i className="fa fa-play"></i></a>
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
          <ul className="content">
            {taskList}
          </ul>
        </section>

    );
  }
});


module.exports = RecentTasks;