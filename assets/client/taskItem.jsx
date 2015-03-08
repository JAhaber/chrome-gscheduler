
var React = require('react');
var Moment = require('moment');

var TaskItem = React.createClass({
	getInitialState: function () {
		return {timeElapsed: ''};
	},
  tick: function() {
  	var endTime = !this.props.task.stopTime ? new Date().valueOf() : this.props.task.stopTime;
		var elapsedMilliseconds = (endTime - this.props.task.startTime.valueOf());
		var timeElapsed = Moment().hour(0).minute(0).second(elapsedMilliseconds/1000).format('HH:mm:ss');
  	this.setState({timeElapsed: timeElapsed});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 100);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render: function() {
  	var title = this.props.task.title;
    return (
      <li className={this.props.task.stopTime ? 'task stopped' : 'task'}>
				<label>
					{title}
				</label>
				<div className="controls">
					<span className="timeElapsed">{this.state.timeElapsed}</span>
					<a className="play" onClick={this.props.onPlay}><i className="fa fa-play"></i></a>
					<a className="stop" onClick={this.props.onStop}><i className="fa fa-stop"></i></a>
					<a className="destroy" onClick={this.props.onDestroy}><i className="fa fa-times"></i></a>
				</div>
      </li>
    );
  }
});

module.exports = TaskItem;