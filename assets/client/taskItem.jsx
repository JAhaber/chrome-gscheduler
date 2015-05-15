
var React = require('react');
var Moment = require('moment');
var $ = require('jquery');
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

    var stopTime = !task.stopTime ? Moment().format() : task.stopTime;

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

  },
  dateBlur: function(event) {
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
  },
  idBlur: function(event) {
    this.props.model.handleIdChange(this.props.task, event.target.value, this);
  },
  stopChange: function(event) {
    this.setState({stopTime: event.target.value});
  },
  stopBlur: function(event) {
    var task = this.props.task;
         
    if (Moment(this.state.stopTime, 'HH:mm:ss').isValid()){
      var duration;
      var stop = Moment(event.target.value, ["HH:mm:ss", "HHmm:ss", "HH:mmss", "HHmmss"] ).format("HH:mm:ss");
      var start = this.state.startTime;
     
        
      if (Moment(start, "HH:mm:ss").isAfter(Moment(stop, "HH:mm:ss")))
       {
        duration = Moment.duration($("#"+task.id + "-duration-edit").val());
        start = Moment(stop, "HH:mm:ss").subtract(duration);

        if (Moment(start).diff(Moment(task.stop).hour(0).minute(0).second(0), 's') < 0)
          start = Moment("00:00:00", "HH:mm:ss");
       }
      this.setState({startTime: Moment(start, "HH:mm:ss").format('HH:mm:ss'), stopTime: Moment(stop, "HH:mm:ss").format('HH:mm:ss')});
     
      this.props.model.handleStartStopChange(task, start, stop);
      this.updateDuration(stop, start);
    }
    else{
      this.setState({stopTime: Moment(task.stopTime).format('HH:mm:ss')});
    }
   
  },
  durationChange: function(event) {
    this.setState({timeElapsed: event.target.value});
    
  },
  durationBlur: function(event) {
      var task = this.props.task;
      if (Moment(this.state.timeElapsed, 'HH:mm:ss').isValid()){
        var duration = Moment(event.target.value, ["HH:mm:ss", "HHmm:ss", "HH:mmss", "HHmmss"] ).format("HH:mm:ss");
        var stop = Moment(this.state.startTime, "HH:mm:ss").add(Moment.duration(duration));
        
        if (Moment(stop).diff(Moment().hour(23).minute(59).second(59), 's') > 0){
          stop = Moment("23:59:59", "HH:mm:ss");
        }

        this.setState({stopTime: Moment(stop).format('HH:mm:ss')});
        this.props.model.handleStartStopChange(task, this.state.startTime, stop);
        this.updateDuration(stop);
      }
      else{
        this.updateDuration();  
      }
      
  },
  updateDuration: function(value, start){
      var task = this.props.task;
      start = start || this.state.startTime;
      var stopTime = value ? Moment(value, 'HH:mm:ss').format() : this.props.task.stopTime;
      var elapsedMilliseconds = Moment.duration(Moment(stopTime).diff(Moment(start, 'HH:mm:ss').format())).asMilliseconds();
     
      if (elapsedMilliseconds < 0)
        elapsedMilliseconds= elapsedMilliseconds * (-1);
      
      var timeElapsed = Moment().hour(0).minute(0).second(elapsedMilliseconds/1000).format('HH:mm:ss');
     
      this.setState({timeElapsed: timeElapsed});
  },
  startChange: function(event) {
    this.setState({startTime: event.target.value});
  },
  startBlur: function(event) {
    var task = this.props.task;
    if (Moment(this.state.startTime, 'HH:mm:ss').isValid()){
      var duration;
      var stop = this.state.stopTime;
      var start = Moment(event.target.value, ["HH:mm:ss", "HHmm:ss", "HH:mmss", "HHmmss"] ).format("HH:mm:ss");
      if (task.stopTime){
        
        if (Moment(start, "HH:mm:ss").isAfter(Moment(stop, "HH:mm:ss")))
         {
          duration = Moment.duration($("#"+task.id + "-duration-edit").val());
          stop = Moment(start, "HH:mm:ss").add(duration);

          if (Moment(stop).diff(Moment().hour(23).minute(59).second(59), 's') > 0){
            stop = Moment("23:59:59", "HH:mm:ss");
          }
         }
         
        this.setState({startTime: Moment(start, "HH:mm:ss").format('HH:mm:ss'), stopTime: Moment(stop, "HH:mm:ss").format('HH:mm:ss')});
      }
      else{
        if (Moment(start, "HH:mm:ss").isAfter(Moment()))
          start = Moment().format('HH:mm:ss');        
        this.setState({startTime: start});
      }    
      this.props.model.handleStartStopChange(task, start, stop);
      this.updateDuration(stop, start);
    }
    else{
      this.setState({startTime: Moment(task.startTime).format('HH:mm:ss')});
    }
    
  },

  onStop: function(event){
    this.setState({stopTime: Moment().format('HH:mm:ss')});
    this.props.onStop();
  },

  appendZeroTip: function(event){
    $("span.tooltip").remove();
    var value = "Tasks with a duration of < 1 minute will not be saved";
    var color = "rgba(255,235,153,0.9)";
    $("body").append("<span class='tooltip'>" + value + "</span>");
    $("span.tooltip").css({"top": ($(event.target).offset().top + 20) + "px", "left": ($(event.target).offset().left - 100) + "px", "background": color});

  },
   appendOverlapTip: function(event){
    $("span.tooltip").remove();
    var value = "This task's end time is overlapping another task";
    var color = "rgba(237,49,99,0.9)";
    $("body").append("<span class='tooltip'>" + value + "</span>");
    $("span.tooltip").css({"top": ($(event.target).offset().top + 20) + "px", "left": ($(event.target).offset().left - 100) + "px", "background": color});

  },
  removeTip: function(event){
    $("span.tooltip").remove();
  },
  render: function() {
   
  	var task = this.props.task;
    var colorClass = "border-left";
    if (this.props.task.projectID)
      colorClass = "border-left hasID";
    else if (this.props.task.categoryID)
      colorClass = "border-left hasCategory";
    
    var stopTime = Moment(task.stopTime).format() || Moment().format();
   
    return (
      
      
        <li className={task.stopTime ? 'task stopped' : 'task'}>
          <div className={colorClass}>
            <div className="task-wrapper">
              <label className={task.expanded ? 'open' : 'closed'}>
                <a className="expand" onClick={this.props.expandItems}><i className="fa fa-plus"></i></a>
                <a className="contract" onClick={this.props.contractItems}><i className="fa fa-minus"></i></a> {task.title}
              </label>
           
              <div className="controls">
                {Moment.duration(Moment(stopTime).diff(Moment(task.startTime).format())).asMinutes() < 1 ? 
                  <a className="zero tip" onMouseEnter={this.appendZeroTip} onMouseLeave={this.removeTip}><i className="fa fa-info-circle"></i></a>
                  : "" }
                {task.overlap ? 
                  <a className="overlap tip" onMouseEnter={this.appendOverlapTip} onMouseLeave={this.removeTip}><i className="fa fa-exclamation-triangle"></i></a>
                  : "" }
                <span className="timeElapsed">{this.state.timeElapsed}</span>
                <a className="play" onClick={this.props.onPlay}><i className="fa fa-play"></i></a>
                <a className="stop" onClick={this.onStop}><i className="fa fa-stop"></i></a>
                <a className="destroy" onClick={this.props.onDestroy}><i className="fa fa-remove"></i></a>
              </div>
              
            </div>
          <div className={task.expanded ? 'details on' : 'details'}>
          <div>
            <div className="item-wrap">
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
              </div>
            <div className="item-wrap">
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
                onBlur={this.idBlur}
                />
              </div>
            </div>
            <div>
            <div className="item-wrap">
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
                onBlur={this.startBlur}
                />
              </div>
              <div className="item-wrap">
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
                onBlur={this.stopBlur}
                disabled={task.stopTime ? "" : "disabled"}
                />
                </div>
            </div>
              <div>
              <div className="item-wrap">
              <label>
               Date:
              </label>
              <input 
                id={task.id +"-date-edit"}
                type="date" 
                name="date-edit" 
                className="form-control"
                value={this.state.date}
                disabled={task.stopTime ? "" : "disabled"}
                onChange={this.dateChange}
                onBlur={this.dateBlur}
                />
                </div>
                <div className="item-wrap">
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
                onBlur={this.durationBlur}
                disabled={task.stopTime ? "" : "disabled"}
                />
              </div>
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
      </li>
    );
  }
});


module.exports = TaskItem;