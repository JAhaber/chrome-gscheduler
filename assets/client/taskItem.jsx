
var React = require('react');
var Moment = require('moment');

var TaskItem = React.createClass({
	getInitialState: function () {
    var task = this.props.task;
    
		return {
      isFavorite: task.isFavorite || false,
      timeElapsed: '',
      date: Moment(task.startTime).format('YYYY-MM-DD'),
      title: task.title,
      ticketID: task.ticketID,
      note: task.note,
      startTime: Moment(task.startTime).format('HH:mm:ss'),
      stopTime: task.stopTime ? Moment(task.stopTime).format('HH:mm:ss') : "",
      nonProjectActive: task.categoryID ? true : false,
      autobillActive: task.autobill ? true : false
    };
	},
  componentDidMount: function() {
    if (!this.props.task.stopTime)
      this.interval = setInterval(this.tick, 500);
    else{
      this.updateDuration();
    }
  },
  componentDidUpdate: function(){
   var task = this.props.task;
   if (!task.ticketID){
    this.refs.wrapper.getDOMNode().setAttribute('draggable', 'false');
   }
   if (task.hasChanged){
    this.setState({
      startTime: Moment(task.startTime).format('HH:mm:ss'),
      stopTime: task.stopTime ? Moment(task.stopTime).format('HH:mm:ss') : "",
      title: task.title,
      ticketID: task.ticketID,
      isFavorite: task.isFavorite
    });
    this.updateDuration(Moment(task.stopTime).format('HH:mm:ss'), Moment(task.startTime).format('HH:mm:ss'));
    /*task.flash = true;
    setTimeout(function(){
      task.flash = false;
    }, 300);*/
    task.hasChanged = false;
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
    if (Moment(event.target.value, "YYYY/MM/DD").isAfter(Moment()))
      this.setState({date: Moment(this.props.task.startTime).format("YYYY-MM-DD")})
    else
      this.props.model.handleDateChange(this.props.task, event.target.value);
  },
  dragStart: function(event){
    var url = "https://genome.klick.com/tickets/#/details/" + this.props.task.ticketID;
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/uri-list", url);
    event.dataTransfer.setData("text/plain", url);
  },
  durationBlur: function(event) {
      var task = this.props.task;
      if (Moment(this.state.timeElapsed, 'HH:mm:ss').isValid()){
        var duration = Moment(event.target.value, ["HH:mm:ss", "HHmm:ss", "HH:mmss", "HHmmss"] ).format("HH:mm:ss");
        var stop = Moment(this.state.startTime, "HH:mm:ss").add(Moment.duration(duration));
        
        if (Moment(stop).diff(Moment().hour(23).minute(59).second(59), 's') >= 0){
          stop = Moment("23:59:59", "HH:mm:ss");
        }

        this.props.model.handleStartStopChange(task, this.state.startTime, stop);
      }
      else{
        this.updateDuration();  
      }
      
  },
  durationChange: function(event) {
    this.setState({timeElapsed: event.target.value});
  },
  handleProjectChange: function(event){
    if (event.target.value === "nonProject")
      this.setState({nonProjectActive: true, autobillActive: false});
    else if (event.target.value === "autoBill")
      this.setState({nonProjectActive: false, autobillActive: true});
    else
      this.setState({nonProjectActive: false, autobillActive: false});
  },
  idBlur: function(event) {
    this.props.model.handleIdChange(this.props.task, event.target.value, this);
  },

  idChange: function(event) {
    this.setState({ticketID: event.target.value});
  },
  nonProjectChange: function(event){
    this.props.model.handleNonProjectChange(this.props.task, event.target.value, this.props.nonBillables);
  },
  autobillChange: function(event){
    this.props.model.handleAutoBillChange(this.props.task, event.target.value);
  },
  noteChange: function(event) {
    this.setState({note: event.target.value});
    this.props.model.handleNoteChange(this.props.task, event.target.value);
  },
  onStop: function(event){
    this.setState({stopTime: Moment().format('HH:mm:ss')});
    this.props.onStop();
  },
  onFav: function(event){
    var task = this.props.task;
    if (!this.state.isFavorite){
      this.props.model.addFavorite(task);
    }
    else{
      this.props.model.removeFavorite(task);
    }
    
  },
  onSplit: function(event){
    var task = this.props.task;
    var newStart;
    var newStop;
    var elapsedMilliseconds = Moment.duration(Moment(task.stopTime).diff(Moment(task.startTime))).asMilliseconds();

    var newStop = Moment(task.startTime).add(elapsedMilliseconds / 2, 'ms');
    var newStart = Moment(task.startTime).add(elapsedMilliseconds / 2, 'ms').add(1, 's');

    this.props.model.handleStartStopChange(task, Moment(task.startTime).format('HH:mm:ss'), Moment(newStop).format('HH:mm:ss'));

    this.props.model.splitTask(task, Moment(task.startTime, "YYYY-MM-DD").hour(Moment(newStart).hour()).minute(Moment(newStart).minute()).second(Moment(newStart).second()).format(), task.stopTime)
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
          duration = Moment.duration(this.state.timeElapsed);
          stop = Moment(start, "HH:mm:ss").add(duration);

          if (Moment(stop).diff(Moment().hour(23).minute(59).second(59), 's') > 0){
            stop = Moment("23:59:59", "HH:mm:ss");
          }
        }
      }
      else{
        if (Moment(start, "HH:mm:ss").isAfter(Moment()))
          start = Moment().format('HH:mm:ss');
      }    
      this.props.model.handleStartStopChange(task, start, stop);
    }
    else{
      this.setState({startTime: Moment(task.startTime).format('HH:mm:ss')});
    }
    
  },
  startChange: function(event) {
    this.setState({startTime: event.target.value});
  },
  stopBlur: function(event) {
    var task = this.props.task;
         
    if (Moment(this.state.stopTime, 'HH:mm:ss').isValid()){
      var duration;
      var stop = Moment(event.target.value, ["HH:mm:ss", "HHmm:ss", "HH:mmss", "HHmmss"] ).format("HH:mm:ss");
      var start = this.state.startTime;
     
        
      if (Moment(start, "HH:mm:ss").isAfter(Moment(stop, "HH:mm:ss")))
       {
        duration = Moment.duration(this.state.timeElapsed);
        start = Moment(stop, "HH:mm:ss").subtract(duration);

        if (Moment(start).diff(Moment(task.stop).hour(0).minute(0).second(0), 's') < 0)
          start = Moment("00:00:00", "HH:mm:ss");
       }
      this.props.model.handleStartStopChange(task, start, stop);
    }
    else{
      this.setState({stopTime: Moment(task.stopTime).format('HH:mm:ss')});
    }
   
  },
  stopChange: function(event) {
    this.setState({stopTime: event.target.value});
  },
  tick: function() {
    var task = this.props.task;

    var stopTime = !task.stopTime ? Moment().format() : task.stopTime;

    if (Moment(stopTime).isAfter(Moment(task.startTime).add(3, 'days'), 'day')){
      stopTime = Moment(task.startTime).hour(23).minute(59).second(59).millisecond(99);
      this.props.model.stop(task, Moment(stopTime).format());
    }
    else if (Moment(stopTime).isAfter(task.startTime, 'day')){
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
  titleChange: function(event) {
    this.setState({title: event.target.value});
    this.props.model.handleTitleChange(this.props.task, event.target.value);

  },
  updateDuration: function(value, start){
      var task = this.props.task;
      start = start || this.state.startTime;
      var stopTime = value ? Moment(value, 'HH:mm:ss').format('HH:mm:ss') : Moment(this.props.task.stopTime).format("HH:mm:ss");
      var elapsedMilliseconds = Moment.duration(Moment(stopTime, 'HH:mm:ss').diff(Moment(start, 'HH:mm:ss').format())).asMilliseconds();
     
      if (elapsedMilliseconds < 0)
        elapsedMilliseconds= elapsedMilliseconds * (-1);
      
      var timeElapsed = Moment().hour(0).minute(0).second(elapsedMilliseconds/1000).format('HH:mm:ss');
      this.setState({timeElapsed: timeElapsed});
  },
 
  render: function() {
    var task = this.props.task;

    var colorClass = "border-left";
    var isLessThanOne = false;

    if (task.projectID)
      colorClass = "border-left hasID";
    else if (task.categoryID)
      colorClass = "border-left hasCategory";
    else if (task.autobill)
      colorClass = "border-left hasAutobill";
    
    if (task.stopTime){
      var stopTime = Moment(task.stopTime).format();
      if (Moment.duration(Moment(stopTime).diff(Moment(task.startTime).format())).asMinutes() < 1)
        isLessThanOne = true;
      else
        isLessThanOne = false
    }
    else
      isLessThanOne = false


    var nonBillList = this.props.nonBillables.Entries.map(function (entry) {
      return (
        <option value={entry.TimeSheetCategoryID}>
          {entry.Name}
        </option>
        );
    }, this);

    var autobillList = this.props.model.autobill.map(function (entry) {
      return (
        <option value={entry.id}>
          {entry.title}
        </option>
        );
    }, this);

    var projectTypeSelector = (
      <span>
        <label className="projectType">Project Type</label>
        <div className="radio-wrapper">
          <label className="radio">
            <input
              type="radio"
              name="projectType"
              value="project"
              defaultChecked={!this.state.nonProjectActive && !this.state.autobillActive}
              onChange={this.handleProjectChange}
            /> Default
          </label>
          <label className="radio">
            <input
              type="radio"
              name="projectType"
              value="nonProject"
              defaultChecked={this.state.nonProjectActive}
              onChange={this.handleProjectChange}
            /> Non-project
            </label>
          <label className="radio">
            <input
              type="radio"
              name="projectType"
              value="autoBill"
              defaultChecked={this.state.autobillActive}
              onChange={this.handleProjectChange}
            /> Autobill
          </label>
        </div>
      </span>
    );

    return (
        
        <li className={task.stopTime ? 'task stopped' : 'task'}>
          <div className={colorClass}>
            <div className="task-wrapper" draggable={task.ticketID ? "true" : "false" } onDragStart={this.dragStart} ref="wrapper">
              <label>
                {!task.expanded ?
                <a className="expand" onClick={this.props.expandItems}>
                  <i className="fa fa-plus"></i>
                </a>
                : <a className="contract" onClick={this.props.contractItems}>
                  <i className="fa fa-minus"></i>
                </a>}
                &nbsp;&nbsp;{task.title}
              </label>
           
              <div className="controls">
                {isLessThanOne ? 
                  <a className="zero tip" title="Tasks with a duration of < 1 minute will not be saved">
                    <i className="fa fa-info-circle"></i>
                  </a>
                : "" }
                {task.overlap ? 
                  <a className="overlap tip" title="This task's end time is overlapping another task">
                    <i className="fa fa-exclamation-triangle"></i>
                  </a>
                : "" }
                <span className="timeElapsed">
                  {this.state.timeElapsed}
                </span>
                <span className="icons-wrapper">
                  <a className={this.state.ticketID ? "fav" : "fav disabled"} onClick={this.state.ticketID ? this.onFav : ""} title={this.state.ticketID ? this.state.isFavorite ? "Remove this task from your favorites" : "Add this task to your favorites" : "Only billable tasks can be added to favorites"}>
                    {this.state.isFavorite ?
                      <i className="fa fa-star"></i>
                      : <i className="fa fa-star-o"></i>
                    }
                  </a>
                  { task.stopTime ?
                    <span>
                      <a className="split" onClick={this.onSplit} title="Split task into two even length tasks">
                        <i className="fa fa-unlink"></i>
                      </a>
                      <a className="play" onClick={this.props.onPlay} title="Begin tracking this task">
                        <i className="fa fa-play"></i>
                      </a>
                    </span>
                    : <a className="stop" onClick={this.onStop} title="Stop tracking this task">
                      <i className="fa fa-stop"></i>
                    </a>
                  }
                  <a className="destroy" onClick={this.props.onDestroy} title="Remove this task">
                    <i className="fa fa-remove"></i>
                  </a>
                </span>
              </div>
              
            </div>
          {task.expanded ? 
          <div className='details'>
            <div className="item-row">
              <div className="item-wrap full">
              {projectTypeSelector}
              </div>
            </div>
            { this.state.nonProjectActive ? 
              <div className="item-row">
                <div className="item-wrap full">
                  <label>Non-Project Category</label>
                  <select value={task.categoryID} onChange={this.nonProjectChange}>
                    <option value=""></option>
                    {nonBillList}
                  </select>
                </div>
              </div>
            : this.state.autobillActive ? 
              <div className="item-row">
                <div className="item-wrap full">
                  <label>Autobill List</label>
                  <div className="autobillSelect">
                    <select value={task.autobill} onChange={this.autobillChange}>
                      <option value=""></option>
                      {autobillList}
                    </select>
                    &nbsp;&nbsp;
                    <a className="edit-autobill" onClick={this.props.toggleAutoBill} title="Edit your Autobill Lists">
                      <i className="fa fa-edit"> Edit</i>
                    </a>
                  </div>
                </div>
              </div>
            : <div className="item-row">
                <div className="item-wrap">
                  <label>
                    Title:
                  </label>
                  <input 
                    type="text" 
                    name="title-edit" 
                    className="form-control" 
                    placeholder="Enter Title"
                    value={this.state.title}
                    onChange={this.titleChange}
                  />
                </div>
                <div className="item-wrap">
                  <label>Task ID:</label>
                  <input
                    type="text"
                    placeholder="Enter Task ID"
                    name="ticketid-edit"
                    className="form-control" 
                    value={this.state.ticketID}
                    onChange={this.idChange}
                    onBlur={this.idBlur}
                  />
                </div>
              </div>
            }
            <div className="item-row">
              <div className="item-wrap">
                <label>
                  Start:
                </label>
                <input 
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
            <div className="item-row">
              <div className="item-wrap">
                <label>
                  Date:
                </label>
                <input 
                  type="date" 
                  name="date-edit" 
                  className="form-control"
                  max={Moment().format("YYYY-MM-DD")}
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
            <div className="item-row">
              <label>
                Note:
              </label>
              <textarea 
                name="note-edit" 
                className="form-control" 
                placeholder=""
                value={this.state.note}
                onChange={this.noteChange}
              />
            </div>
          </div> : ""}
        </div>
      </li>
    );
  }
});

module.exports = TaskItem;