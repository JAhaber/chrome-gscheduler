
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var $ = require('jquery');
var tasks = null;
var recentNewestFirst = false;

var GenomeTasks = React.createClass({
  getInitialState: function() {
    return {
      showGenome: false
    };
  },
  toggleGenome: function(){
    
    if (!this.props.showGenome){
      GenomeAPI.getUser().then(function(user){
        return GenomeAPI.getAssignedTasks(user.UserID);
      }).then(function(results){
        
        tasks = [];
        for (var i = 0; i < results.Entries.length; i++)
        {
          console.log(results.Entries[i]);
          if (results.Entries[i].ProjectID){
              //GenomeAPI.getProjectInfo(results.Entries[i].TicketID).then(function(ticket){
                //console.log(ticket.Entries[0]);
                tasks.push(results.Entries[i]);
              //});              
          }
        }
      }).fail(function(err){
        tasks = "fail";
      });
    }
    else{
      tasks = null;
    }
    
    this.props.toggleGenome();
     
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
      taskList = "Failed to load current task list from Genome."
    else if (tasks.length === 0)
      taskList = "No entries found";
    else{
      tasks = _.sortBy(tasks, function(o){ return o.TicketID; });
      tasks = _.uniq(tasks, true, function(o){ return o.TicketID; });
      if (recentNewestFirst === true)
        tasks.reverse();
      taskList = tasks.map(function (task) {
        return (
          <li className='task'>
            <div className="task-wrapper" draggable="true" onDragStart={scope.dragStart} data-ticketid={task.TicketID}>
              <div className="recent-ticketID-wrapper">
                <label>
                  {task.TicketID}
                </label>
              </div>
              <div className="recent-task-wrapper">
                <label>
                   <span title={task.Title}>{task.Title}</span>
                   <span className="recent-project-wrapper" title={task.ProjectName}>{task.ProjectName}</span>
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

      <section id="genometasks" className={this.props.showGenome ? "open" : ""}>
          <a className="arrow" onClick={this.toggleGenome} title="View tasks currently assigned to you in Genome">
            Genome Tasks <i className="fa up fa-list"></i>
          </a>
          {this.props.showGenome ?
            <div className="content-wrapper">
              <ul className="content">
                {taskList}
              </ul>
            </div>
          : "" }
        </section>

    );
  }
});

chrome.storage.sync.get({
    recentNewestFirst: false
  }, function(items) {
    recentNewestFirst = items.recentNewestFirst;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
     recentNewestFirst: false
  }, function(items) {
    recentNewestFirst = items.recentNewestFirst;
  });
});

module.exports = GenomeTasks;