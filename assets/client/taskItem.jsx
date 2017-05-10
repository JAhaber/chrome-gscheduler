var Analytics = require('./analytics.js');
var React = require('react');
var Moment = require('moment');
var GenomeAPI = require('./GenomeAPI.js');
var showProject = false;

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
      projectName: null,
      error: task.error,
      showErrorMsg: false
    };
	},
  componentDidMount: function() {
    if (!this.props.task.stopTime)
      this.interval = setInterval(this.tick, 500);
    else{
      this.updateDuration();
    }
    this.getProjectName();
  },
  getProjectName: function(){
    var that = this;
    if (this.props.task.projectID !== null){
      GenomeAPI.getProjectInfo(this.props.task.ticketID).then(function(results){
          
          for (var i = 0; i < results.Entries.length; i++)
          {
            if (results.Entries[i].ProjectID){
                  that.setState({projectName: results.Entries[i].ProjectName})            
            }
          }
        });
    }
    else{
      that.setState({projectName: null})
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
      isFavorite: task.isFavorite,
      error: task.error
    });
    this.updateDuration(Moment(task.stopTime).format('HH:mm:ss'), Moment(task.startTime).format('HH:mm:ss'));

    this.getProjectName();
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
      this.setState({nonProjectActive: true});
    else
      this.setState({nonProjectActive: false});
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
  onPlay: function(event){
    Analytics.send("Tasks", "Start", "Existing Task");
    this.props.onPlay(this.props.task);
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
  toggleShowErrorMsg: function() {
    this.setState({showErrorMsg: !this.state.showErrorMsg});
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
        <option value={entry.TimeSheetCategoryID} key={entry.TimeSheetCategoryID}>
          {entry.Name}
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
              defaultChecked={!this.state.nonProjectActive}
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
                      <a className="play" onClick={this.onPlay} title="Begin tracking this task">
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
              
            {this.state.projectName && showProject ? <div className="projectName" title={"Project: " + this.state.projectName}>{this.state.projectName}</div> : ""}
            {this.state.error !== null ? 
              <div className="saveError">
              <span className="retryText">An error has occured. Please try saving again or manually enter this task into Genome.</span>
              <br/><br/>
              {this.state.showErrorMsg ?
                <span> 
                  {this.state.error} <br/><br/><a onClick={this.toggleShowErrorMsg}>&lt; Hide Details</a>
                </span>
                : <a onClick={this.toggleShowErrorMsg}>Show Details &gt;</a> }
               </div> : ""}
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

chrome.storage.sync.get({
    showProject: false
  }, function(items) {
    showProject = items.showProject;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
    showProject: false
  }, function(items) {
    showProject = items.showProject;
  });
});

module.exports = TaskItem;