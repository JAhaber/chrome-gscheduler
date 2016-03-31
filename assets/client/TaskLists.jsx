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
    this.changeStates(!this.state.showRecent, false, false);
  },
  toggleFavorite: function(){
    this.changeStates(false, !this.state.showFavorite, false);
  },
  toggleGenome: function(){
    this.changeStates(false, false, !this.state.showGenome);
  },
  changeStates: function(recent, fav, genome){
    this.setState({showRecent: recent, showFavorite: fav, showGenome: genome});
  },
  render: function() {
  
   return (
    <div className={this.state.showRecent || this.state.showFavorite || this.state.showGenome ? "TaskButtons open" : "TaskButtons"}>
      <RecentTasks 
        onPlay={this.props.onPlay} showRecent={this.state.showRecent} toggleRecent={this.toggleRecent}/>
      <FavoriteTasks 
        onPlay={this.props.onPlay} showFavorite={this.state.showFavorite} toggleFavorite={this.toggleFavorite}/>
      <GenomeTasks 
        onPlay={this.props.onPlay} showGenome={this.state.showGenome} toggleGenome={this.toggleGenome}/>
      
    </div>

    );
  }
});

module.exports = TaskLists;