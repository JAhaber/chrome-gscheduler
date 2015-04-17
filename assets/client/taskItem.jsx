
var React = require('react');
var Moment = require('moment');

var TaskItem = React.createClass({
	getInitialState: function () {
		return {timeElapsed: ''};
	},
  tick: function() {
    var task = this.props.task;
    var stopTime = !this.props.task.stopTime ? Moment().format() : this.props.task.stopTime;
    var elapsedMilliseconds = Moment.duration(Moment(stopTime).diff(Moment(task.startTime))).asMilliseconds();
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
  	var task = this.props.task;
    return (
      <div className="border-left">
        <li className={this.props.task.stopTime ? 'task stopped' : 'task'}>
          
            <label className={this.props.task.expanded ? 'open' : 'closed'}>
              <a className="expand" onClick={this.props.expandItems}><i className="fa fa-plus"></i></a>
              <a className="contract" onClick={this.props.contractItems}><i className="fa fa-minus"></i></a> {task.title}
            </label>
         
          <div className="controls">
            <span className="timeElapsed">{this.state.timeElapsed}</span>
            <a className="play" onClick={this.props.onPlay}><i className="fa fa-play"></i></a>
            <a className="stop" onClick={this.props.onStop}><i className="fa fa-stop"></i></a>
            <a className="destroy" onClick={this.props.onDestroy}><i className="fa fa-remove"></i></a>
          </div>
        </li>
        <div className={this.props.task.expanded ? 'details on' : 'details'}>
            <label>
             Title:
            </label>
            <input 
              id="title-edit"
              type="text" 
              name="title-edit" 
              className="form-control" 
              placeholder="Enter Title"
              defaultValue={task.title}
              />
            
          <label>
            Ticket ID:
            </label>
            <input 
              id="ticketid-edit"
              type="text" 
              name="ticketid-edit" 
              className="form-control" 
              placeholder="Enter Ticket ID"
              defaultValue={task.ticketID}
              />
            <label>
             Start:
            </label>
            <input 
              id="start-time-edit"
              type="text" 
              name="start-time-edit" 
              className="form-control" 
              placeholder="Enter Start Time"
              defaultValue={task.startTime}
              />
            <label>
             Stop:
            </label>
            <input 
              id="stop-time-edit"
              type="text" 
              name="stop-time-edit" 
              className="form-control" 
              placeholder="Enter Stop Time"
              defaultValue={task.stopTime}
              />
        </div>
      </div>
    );
  }
});

module.exports = TaskItem;