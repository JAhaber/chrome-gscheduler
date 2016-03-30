
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
  toggleRecent: function(){
    
    if (!this.props.showFavorite){
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
    }
    else{
      tasks = null;
    }
    
    this.props.toggleFavorite();
     
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
    
     
   return (

      <section id="favorites" className={this.props.showFavorite ? "open" : ""}>
          <a className="arrow" onClick={this.toggleFavorite} title="Favorite Tasks">
            Favorite Tasks <i className="fa fa-star"></i>      
          </a>
          <div className="content-wrapper">
            <ul className="content">
              
            </ul>
          </div>
        </section>

    );
  }
});

module.exports = FavoriteTasks;