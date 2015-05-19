
var React = require('react');
var Moment = require('moment');
var $ = require('jquery');
var GapItem = React.createClass({
  addTask: function(){
    var start = this.props.task.stopTime;
    var stop = Moment(start).add(this.props.gap.duration, 's').format();
    this.props.model.addGap(start, stop);
  },
  extendLast: function(){
    var stop = Moment(this.props.task.stopTime).add(this.props.gap.duration, 's').format();
    this.props.onLast(stop);
  },
  extendNext: function(){
    chrome.runtime.sendMessage({gap: this.props.gap}, function(response) {});
    console.log("sent");
  },
	render: function() {

   var gap = this.props.gap;
   var task = this.props.task;

   return (

      <span className="gap">
        Gap Duration: {Moment().hour(0).minutes(0).second(gap.duration).format("HH:mm:ss")}
        <div className="controls">
          <a className="add" onClick={this.addTask}>Add Task <i className="fa fa-caret-square-o-right"></i></a>
          <a className="last" onClick={this.extendLast}>Extend Last <i className="fa fa-caret-square-o-up"></i></a>
          <a className="next" onClick={this.extendNext}>Extend Next <i className="fa fa-caret-square-o-down"></i></a>
        </div>
      </span>

    );
  }
});


module.exports = GapItem;