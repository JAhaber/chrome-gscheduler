
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');
var taskVal = null;

var Multibill = React.createClass({
  getInitialState: function () {
    return {
      MultibillSelected: this.props.Multibill.length > 0 ? this.props.Multibill[0].id : -1,
      title: this.props.Multibill.length > 0 ? this.props.Multibill[0].title : "",
      tasks: this.props.Multibill.length > 0 ? this.props.Multibill[0].tasks : [],
      status: null,
      newTaskID: "",
      confirmRemove: false
    };
  },
  componentDidUpdate: function(){
    if (this.state.status === "add"){
      this.setState({MultibillSelected: this.props.Multibill[this.props.Multibill.length - 1].id, status: null, title: this.props.Multibill[this.props.Multibill.length - 1].title, tasks:  this.props.Multibill[this.props.Multibill.length - 1].tasks});
    }
    else if (this.state.status === "remove"){
      if (this.props.Multibill.length > 0){
        this.setState({MultibillSelected: this.props.Multibill[0].id, status: null, title: this.props.Multibill[0].title, tasks: this.props.Multibill[0].tasks});
      }
      else{
        this.setState({MultibillSelected: -1, status: null, title: "", tasks: []});
      }      
    }
  },
  addMultibillList: function(){
    this.setState({status: "add"});
    this.props.model.addMultibill();
  },
  cloneMultibillList: function(){
    this.setState({status: "add"});
    this.props.model.cloneMultibill(this.state.MultibillSelected);
    
  },
  confirmRemove: function(){
    this.setState({confirmRemove: true});
  },
  removeMultibillList: function(e){
    var conf = e.target.getAttribute("data-confirm");
    if (conf === "true"){
      this.setState({confirmRemove: false, status: "remove"});
      this.props.model.removeMultibill(this.state.MultibillSelected);
    }
    else
      this.setState({confirmRemove: false});
  },
  MultibillChange: function(e){
    var Multibill = this.props.Multibill;
    for (var i = 0; i < Multibill.length; i++){
      if (parseInt(Multibill[i].id) === parseInt(e.target.value)){
        this.setState({MultibillSelected: e.target.value, title: Multibill[i].title, tasks: Multibill[i].tasks});
      }
    }
    
  },
  handleNewTaskIDChange: function(e){
    this.setState({newTaskID: e.target.value});
  },
  handleNewTaskIDBlur: function(e){
    this.setState({newTaskID: ""});
    this.props.model.addMultibillTask(this.state.MultibillSelected, event.target.value);
  },
  handleNewTaskIDKeyPress: function(e){
    if (e.which === 13){
      this.setState({newTaskID: ""});
      this.props.model.addMultibillTask(this.state.MultibillSelected, event.target.value);
    }
  },
  storeID: function(e){
    taskVal = e.target.value;
  },
  handleTaskIDChange: function(e){
    var key = event.target.getAttribute("data-key");
    var tasks = this.state.tasks.map(function(task){
      if (task.key === key){
        task.id = e.target.value;
      }
      return task;
    });

    this.setState({tasks: tasks});
  },
  handleTaskRemove: function(e){
    var key = e.target.getAttribute("data-key") || e.target.parentNode.getAttribute("data-key");
    var tasks = this.state.tasks;
    var selected = this.state.MultibillSelected;

    tasks = tasks.filter(function(task){
      return task.key !== key;
    });
    if (selected === this.state.MultibillSelected)
      this.setState({tasks:tasks});
    this.props.model.handleMultibillTaskIDChange(selected, tasks);
  },
  handleTaskIDBlur: function(e){
    var value = e.target.value;
    var tasks = this.state.tasks;
    var Multibill = this.props.Multibill;
    var selected = this.state.MultibillSelected;
    var scope = this;
    var key = e.target.getAttribute("data-key");
    
    if (value.indexOf("https://") > -1) //Allow the user to paste a genome url or hask of the ticket
    {
      value = value.substring(value.lastIndexOf("/") + 1);
    }
    else if (value.indexOf("#") === 0){
      value = value.substring(1);
    }

    scope.resetTask(key, tasks, selected);

    if (value === "") { //Remove the task completely if the value is null
     this.handleTaskRemove(e);
    }
    else if (value == parseInt(value, 10)){
      var duplicate = false; //Check if the task already exists in the list to prevent duplicates
      for (var j = 0; j < tasks.length; j++){
        if (parseInt(tasks[j].id) === parseInt(value) && tasks[j].key !== key){
          duplicate = true;
          break;
        }
      }
      if (duplicate === false){
        GenomeAPI.getProjectInfo(value).then(function(ticketData){
          tasks = tasks.map(function (task) {
            if (task.key === key){
              return { key: task.key, id: value, projectID: ticketData.Entries[0].ProjectID, title: ticketData.Entries[0].Title, projectName: ticketData.Entries[0].ProjectName};
            }
            else
              return task;
          });
          scope.props.model.handleMultibillTaskIDChange(selected, tasks);
          if (selected === scope.state.MultibillSelected)
            scope.setState({tasks:tasks});
          
        }, function(error){});
      }
    }
    
  },

  resetTask: function(key, tasks, selected){
    tasks = tasks.map(function (task) {
      if (task.key === key){
        return { key: task.key, id: taskVal, projectID: task.projectID, title: task.title, projectName: task.projectName};
      }
      else
        return task;
    });
    taskVal = null;
    if (selected === this.state.MultibillSelected)
      this.setState({tasks:tasks});
    this.props.model.handleMultibillTaskIDChange(selected, tasks);
  },
  titleChange: function(e){
    this.setState({title: event.target.value});
    this.props.model.handleMultibillTitleChange(this.state.MultibillSelected, event.target.value);
  },
	render: function() {
    var scope = this;

    var MultibillList = this.props.Multibill.map(function (entry) {
      return (
        <option value={entry.id} key={entry.id}>
          {entry.title}
        </option>
        );
    }, this);

    var MultibillTasks = this.state.tasks.map(function (task, id){
      return (
        <div key={task.key}>
          { id > 0 ? <hr/> : ""}
          <div className="id-wrapper editTask">
            <a className="taskRemove" onClick={scope.handleTaskRemove} data-key={task.key}><i className="fa fa-remove"></i></a>
            <label>Task ID:</label>
            <input 
              type="text" 
              name="id-edit" 
              className="form-control" 
              placeholder="Enter ID"
              value={task.id}
              data-key={task.key}
              onFocus={scope.storeID}
              onChange={scope.handleTaskIDChange}
              onBlur={scope.handleTaskIDBlur}
            />
          </div>
          <div className="details-wrapper">
            <div className="task-title" title={task.title}>Title: {task.title}</div>
            <div className="task-project" title={task.projectName}>Project: {task.projectName}</div>
          </div>
        </div>
      );
    }, this);

    var MultibillData =  (
      <div className="multibill-data">
        <label>Edit List Name:</label>
        <input 
          type="text" 
          name="title-edit" 
          className="form-control" 
          placeholder="Enter Title"
          value={this.state.title}
          onChange={this.titleChange}
        />
        <hr/>

        <div className="id-wrapper newTask">
          <label>Add Task to List:</label>
          <input 
            type="text" 
            name="id-edit" 
            className="form-control" 
            placeholder="Enter ID"
            data-id={-1}
            value={this.state.newTaskID}
            onChange={this.handleNewTaskIDChange}
            onBlur={this.handleNewTaskIDBlur}
            onKeyPress={this.handleNewTaskIDKeyPress}
          />
        </div>
  
      </div>
    );
    

    return (
      <section id="edit-Multibill">
        <a className="destroy" onClick={this.props.closeMultibill}>
          <i className="fa fa-remove"></i>
        </a>
        {this.props.Multibill.length > 0 ?
          <span>
            <div className="multibill-header">
              <label className="multibill-select-label">Select List to Edit:</label>
              <select onChange={this.MultibillChange} value={this.state.MultibillSelected}>
                {MultibillList}
              </select>
              <div className="list-controls">
                <a className="add-Multibill" onClick={this.addMultibillList}><i className="fa fa-plus-square">&nbsp;Add&nbsp;New&nbsp;List</i></a>
                <a className="clone-Multibill" onClick={this.cloneMultibillList}><i className="fa fa-copy">&nbsp;Clone&nbsp;Selected&nbsp;List</i></a>
                <a className="remove-Multibill" onClick={this.confirmRemove}><i className="fa fa-minus-square">&nbsp;Remove&nbsp;Selected&nbsp;List</i></a>
              </div>
            </div>
            {MultibillData}

            <div className="task-wrapper">
            {this.state.tasks.length > 0 ?
              <label className="task-headline"><u>{this.state.tasks.length} Tasks</u>:
                <br/><small>(To remove a task, delete it's ID)</small></label>
            : ""}
              {MultibillTasks}
            </div>
          </span>
        : <div className="no-Multibill">
          No Multi-bill lists found. <a onClick={this.addMultibillList}>Click here</a> to add a new list
        </div> }
        {this.state.confirmRemove ?
          <div>
            <div className="modal-overlay">
            </div>
            <div className="modal-confirmRemove">
              <div>Are you sure you want to remove {this.state.title}?</div>
              <div className="btn btn-confirm" onClick={this.removeMultibillList} data-confirm="true">Remove</div>
              <div className="btn btn-cancel" onClick={this.removeMultibillList} data-confirm="false">Cancel</div>
            </div>
          </div>
          : ""}
      </section>
    );
  }
});


module.exports = Multibill;