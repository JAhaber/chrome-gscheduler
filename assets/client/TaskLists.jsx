var Analytics = require('./analytics.js');
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var tasks = null;
var RecentTasks = require('./RecentTasks.jsx');
var FavoriteTasks = require('./FavoriteTasks.jsx');
var GenomeTasks = require('./GenomeTasks.jsx');

var TaskLists = React.createClass({
  getInitialState: function() {
    return {
      showRecent: false,
      showFavorite: false,
      showGenome: false
    };
  },
  toggleRecent: function(){
    if (!this.state.showRecent){
      Analytics.send("App", "View", "Recent");
    }
    this.changeStates(!this.state.showRecent, false, false);
  },
  toggleFavorite: function(){
    if (!this.state.showFavorite){
      Analytics.send("App", "View", "Favorites");
    }
    this.changeStates(false, !this.state.showFavorite, false);
  },
  toggleGenome: function(){
    if (!this.state.showGenome){
      Analytics.send("App", "View", "Genome Tasks");
    }
    this.changeStates(false, false, !this.state.showGenome);
  },
  changeStates: function(recent, fav, genome){
    this.props.isTaskListOpen(recent || fav || genome ? true : false);
    this.setState({showRecent: recent, showFavorite: fav, showGenome: genome});
  },
  render: function() {
  
   return (
    <div className={this.state.showRecent || this.state.showFavorite || this.state.showGenome ? "TaskButtons open" : "TaskButtons"}>
      <RecentTasks 
        onPlay={this.props.onPlay} showRecent={this.state.showRecent} toggleRecent={this.toggleRecent}/>
      <FavoriteTasks 
        onPlay={this.props.onPlay} showFavorite={this.state.showFavorite} toggleFavorite={this.toggleFavorite} model={this.props.model} favorites={this.props.model.favorites} />
      <GenomeTasks 
        onPlay={this.props.onPlay} showGenome={this.state.showGenome} toggleGenome={this.toggleGenome}/>
      
    </div>

    );
  }
});

module.exports = TaskLists;