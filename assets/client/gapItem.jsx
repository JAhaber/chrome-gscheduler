
var React = require('react');
var Moment = require('moment');
var $ = require('jquery');
var GapItem = React.createClass({
  addTask: function(){
    var start = this.props.task.stopTime;
    var stop = Moment(start).add(this.props.gap.duration, 's').format();
    this.props.model.addGap(start, stop);
  },
	render: function() {

   var gap = this.props.gap;
   var task = this.props.task;

   return (

      <span className="gap">
        Gap Duration: {Moment().hour(0).minutes(0).second(gap.duration).format("HH:mm:ss")}
        <div className="controls">
          <a className="add" onClick={this.addTask}>Add Task <i className="fa fa-caret-square-o-right"></i></a>
          <a className="last" onClick={this.props.onLast}>Extend Last <i className={this.props.newestFirst ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i></a>
          <a className="next" onClick={this.props.onNext}>Extend Next <i className={this.props.newestFirst ? "fa fa-arrow-down" : "fa fa-arrow-up"}></i></a>
        </div>
      </span>

    );
  }
});


module.exports = GapItem;