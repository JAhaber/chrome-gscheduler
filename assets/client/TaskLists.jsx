var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var tasks = null;
var RecentTasks = require('./RecentTasks.jsx');

var TaskLists = React.createClass({
  getInitialState: function() {
    return {
      showRecent: false
    };
  },
  toggleRecent: function(){
  	this.changeStates(!this.state.showRecent);
  },
  changeStates: function(recent){
  	this.setState({showRecent: recent});
  },
  render: function() {
  
   return (
   	<div className={this.state.showRecent ? "TaskButtons open" : "TaskButtons"}>
      <RecentTasks 
        onPlay={this.props.createTask} showRecent={this.state.showRecent} toggleRecent={this.toggleRecent}/>
    </div>

    );
  }
});

module.exports = TaskLists;