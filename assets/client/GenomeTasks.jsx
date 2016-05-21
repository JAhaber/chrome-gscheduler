
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
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
  onPlay: function(task, event){
    this.props.onPlay({
      title: task.Title,
      ticketID: task.TicketID,
      projectID: task.ProjectID
    });
  },
  dragStart: function(ticketid, event){
    var url = "https://genome.klick.com/tickets/#/details/" + ticketid;
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/uri-list", url);
    event.dataTransfer.setData("text/plain", url);
  },
  openTask: function(ticketid, event){
    chrome.tabs.create({ url : "https://genome.klick.com/tickets/#/details/" + ticketid});
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
      if (recentNewestFirst === true)
        tasks.reverse();
      taskList = tasks.map(function (task) {
        return (
          <li className='task' key={task.TicketID}>
            <div className="task-wrapper" draggable="true" onDragStart={scope.dragStart.bind(scope, task.TicketID)}>
              <div className="recent-ticketID-wrapper">
                <label>
                  <span className="taskID" onClick={scope.openTask.bind(scope, task.TicketID)}>{" " + task.TicketID}</span>
                </label>
              </div>
              <div className="recent-task-wrapper">
                <label>
                   <span title={task.Title}>{task.Title}</span>
                   <span className="recent-project-wrapper" title={task.ProjectName}>{task.ProjectName}</span>
                </label>
              </div>
              <div className="controls">
                <a className="play" onClick={scope.onPlay.bind(scope, task)}><i className="fa fa-play"></i></a>
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