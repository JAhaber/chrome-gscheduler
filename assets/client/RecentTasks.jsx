var Analytics = require('./analytics.js');
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var tasks = null;
var recentNewestFirst = false;

var RecentTasks = React.createClass({
  getInitialState: function() {
    return {
      showRecent: false
    };
  },
  toggleRecent: function(){
    
    if (!this.props.showRecent){
      GenomeAPI.getUser().then(function(user){
        return GenomeAPI.getSchedule(user.UserID);
      }).then(function(results){
        tasks = [];
        for (var i = 0; i < results.Entries.length; i++)
        {
          if (results.Entries[i].Type === "Project"){
              var date = results.Entries[i].Stopped.replace("/Date(", "").replace("-0000)/", "");
              GenomeAPI.getProjectInfo(results.Entries[i].TicketID, date).then(function(ticket){
                tasks.push(ticket.Entries[0]);                
              });              
          }
        }
      }).fail(function(err){
        tasks = "fail";
      });
    }
    else{
      tasks = null;
    }
    
    this.props.toggleRecent();
     
  },
  onPlay: function(task, event){
    Analytics.send("Tasks", "Start", "Recent");
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
      taskList = "Loading Tasks...";
    else if (tasks === "fail")
      taskList = "Failed to load recent tasks from Genome."
    else if (tasks.length === 0)
      taskList = "Loading Tasks...";
    else{
      tasks = _.sortBy(tasks, function(o){ return o.TicketID; });
      tasks.reverse();
      tasks = _.uniq(tasks, true, function(o){ return o.TicketID; });
      
      if (recentNewestFirst === "oldID")
        tasks.reverse();
      else if (recentNewestFirst === "billed"){
        tasks = _.sortBy(tasks, function(o){ return o.sortDate; });
        tasks.reverse();
      }
      
      taskList = tasks.map(function (task) {
        return (
          <li className='task' key={task.TicketID}>
            <div className="task-wrapper" draggable="true" onDragStart={scope.dragStart.bind(scope, task.TicketID)}>
              <div className="recent-ticketID-wrapper">
                <label>
                  {task.TicketStatusName === "closed" ?
                    <i className="fa fa-lock" title="This task is closed in genome. You can still bill to it if the project is open."></i>
                    : <i className="fa fa-unlock-alt" title="This task is open in genome."></i>
                  }
                  
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

      <section id="recent" className={this.props.showRecent ? "open" : ""}>
          <a className="arrow" onClick={this.toggleRecent} title="View tasks you recently billed to">
            Recent Tasks <i className="fa fa-history"></i>
          </a>
          {this.props.showRecent ?
            <div className="content-wrapper">
              <ul className="content">
                {taskList}
              </ul>
            </div>
          : ""}
        </section>

    );
  }
});


chrome.storage.sync.get({
    recentNewestFirst: "oldID"
  }, function(items) {
    if (items.recentNewestFirst == "true")
      recentNewestFirst = "newID";
    else if (items.recentNewestFirst == "false")
      recentNewestFirst = "oldID";
    else
      recentNewestFirst = items.recentNewestFirst;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
     recentNewestFirst: "oldID"
  }, function(items) {
    recentNewestFirst = items.recentNewestFirst;
  });
});


module.exports = RecentTasks;