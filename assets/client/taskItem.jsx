
var React = require('react');
var Moment = require('moment');
var TaskItem = React.createClass({
	getInitialState: function () {
    var task = this.props.task;
		return {timeElapsed: '',
    date: Moment(task.startTime).format('YYYY-MM-DD'),
    title: task.title,
    ticketID: task.ticketID,
    note: task.note,
    startTime: Moment(task.startTime).format('HH:mm:ss'),
    stopTime: task.stopTime ? Moment(task.stopTime).format('HH:mm:ss') : ""
    };
	},
  tick: function() {
    var task = this.props.task;

    var stopTime = !this.props.task.stopTime ? Moment().format() : this.props.task.stopTime;

    if (Moment(stopTime).isAfter(task.startTime, 'day'))
    {
      stopTime = Moment(task.startTime).hour(23).minute(59).second(59).millisecond(99);
      this.setState({stopTime: Moment(stopTime).format('HH:mm:ss')});
      this.props.model.addTask(task, Moment(stopTime).add(1,'s').format(), stopTime);
    }


    var elapsedMilliseconds = Moment.duration(Moment(stopTime).diff(Moment(task.startTime))).asMilliseconds();
    var timeElapsed = Moment().hour(0).minute(0).second(elapsedMilliseconds/1000).format('HH:mm:ss');

    if (!this.props.task.stopTime){
      if (Math.floor(Moment.duration(timeElapsed).asMinutes()) > 59)
        chrome.browserAction.setBadgeText({text : Math.floor(Moment.duration(timeElapsed).asHours()) + " hr" });
      else
        chrome.browserAction.setBadgeText({text : Math.floor(Moment.duration(timeElapsed).asMinutes()) + " m" });
      chrome.runtime.sendMessage({tick: elapsedMilliseconds}, function(response) {});
    }
    else{
      this.componentWillUnmount();
    }

  	this.setState({timeElapsed: timeElapsed});
  },
  componentDidMount: function() {
    if (!this.props.task.stopTime)
      this.interval = setInterval(this.tick, 100);
    else{
      this.updateDuration();
    }
  },
  componentWillUnmount: function() {
    
    clearInterval(this.interval);
    this.interval = null;
  },
  dateChange: function(event) {
    this.setState({date: event.target.value});
    this.props.model.handleDateChange(this.props.task, event.target.value);

  },
  titleChange: function(event) {
    this.setState({title: event.target.value});
    this.props.model.handleTitleChange(this.props.task, event.target.value);

  },

  noteChange: function(event) {
    this.setState({note: event.target.value});
    this.props.model.handleNoteChange(this.props.task, event.target.value);

  },

  idChange: function(event) {
    this.setState({ticketID: event.target.value});
    this.props.model.handleIdChange(this.props.task, event.target.value, this);

  },
  stopChange: function(event) {
    this.setState({stopTime: event.target.value});
    this.props.model.handleStopChange(this.props.task, event.target.value);
    this.updateDuration(event.target.value);
  },
  durationChange: function(event) {
    
  },
  updateDuration: function(value){
      var task = this.props.task;
      var stopTime = value ? Moment(value, 'HH:mm:ss').format() : this.props.task.stopTime;
      var elapsedMilliseconds = Moment.duration(Moment(stopTime).diff(Moment(task.startTime))).asMilliseconds();
      var timeElapsed = Moment().hour(0).minute(0).second(elapsedMilliseconds/1000).format('HH:mm:ss');
     
      this.setState({timeElapsed: timeElapsed});
  },
  startChange: function(event) {
    this.setState({startTime: event.target.value});
    this.props.model.handleStartChange(this.props.task, event.target.value);

  },

  onStop: function(event){
    this.setState({stopTime: Moment().format('HH:mm:ss')});
    this.props.onStop();
  },

  render: function() {
  	var task = this.props.task;

    return (
      
      <div className={this.props.task.projectID ? "border-left hasID" : "border-left"}>
        <li className={this.props.task.stopTime ? 'task stopped' : 'task'}>
          
            <label className={this.props.task.expanded ? 'open' : 'closed'}>
              <a className="expand" onClick={this.props.expandItems}><i className="fa fa-plus"></i></a>
              <a className="contract" onClick={this.props.contractItems}><i className="fa fa-minus"></i></a> {task.title}
            </label>
         
          <div className="controls">
            <span className="timeElapsed">{this.state.timeElapsed}</span>
            <a className="play" onClick={this.props.onPlay}><i className="fa fa-play"></i></a>
            <a className="stop" onClick={this.onStop}><i className="fa fa-stop"></i></a>
            <a className="destroy" onClick={this.props.onDestroy}><i className="fa fa-remove"></i></a>
          </div>
        </li>
        <div className={this.props.task.expanded ? 'details on' : 'details'}>
        <div>
            <label>
             Title:
            </label>
            <input 
              id={task.id + "-title-edit"}
              type="text" 
              name="title-edit" 
              className="form-control" 
              placeholder="Enter Title"
              value={this.state.title}
              onChange={this.titleChange}
              />
            
          <label>
            Task ID:
            </label>
            <input
              type="text"
              id={task.id +"-ticketid-edit"}
              placeholder="Enter Task ID"
              name="ticketid-edit"
              className="form-control" 
              value={this.state.ticketID}
              onChange={this.idChange}
              />
              </div>
            
            <div>
            <label>
              Start:
            </label>
            <input 
              id={task.id +"-start-time-edit"}
              type="text" 
              name="start-time-edit" 
              className="form-control" 
              placeholder="hh:mm:ss"
              value={this.state.startTime}
              onChange={this.startChange}
              />
            <label>
             Stop:
            </label>
            <input 
              id={task.id +"-stop-time-edit"}
              type="text" 
              name="stop-time-edit" 
              className="form-control" 
              placeholder="hh:mm:ss"
              value={this.state.stopTime}
              onChange={this.stopChange}
              disabled={this.props.task.stopTime ? "" : "disabled"}
              />
              </div>

            <div>
            <label>
             Date:
            </label>
            <input 
              id={task.id +"-date-edit"}
              type="date" 
              name="date-edit" 
              className="form-control"
              value={this.state.date}
              disabled={this.props.task.stopTime ? "" : "disabled"}
              onChange={this.dateChange}
              />
              <label>
             Duration:
            </label>
            <input 
              id={task.id +"-duration-edit"}
              type="text" 
              name="duration-edit" 
              className="form-control" 
              placeholder="hh:mm:ss"
              value={this.state.timeElapsed}
              onChange={this.durationChange}
              disabled={this.props.task.stopTime ? "" : "disabled"}
              />
            </div>

            <div>
            <label>
             Note:
            </label>
            <textarea 
              id={task.id +"-note-edit"}
              name="note-edit" 
              className="form-control" 
              placeholder=""
              value={this.state.note}
              onChange={this.noteChange}
              />
              </div>
        </div>
      </div>
    );
  }
});


module.exports = TaskItem;