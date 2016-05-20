
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
      tasks: this.props.Multibill[0].tasks,
      status: null,
      newTaskID: ""
    };
  },
  componentDidUpdate: function(){
    if (this.state.status === "add"){
      this.setState({MultibillSelected: this.props.Multibill[this.props.Multibill.length - 1].id, status: null, title: this.props.Multibill[this.props.Multibill.length - 1].title, tasks: this.props.Multibill[this.props.Multibill.length - 1].tasks,});
    }
    else if (this.state.status === "remove"){
      if (this.props.Multibill.length > 0){
        this.setState({MultibillSelected: this.props.Multibill[0].id, status: null, title: this.props.Multibill[0].title, tasks: this.props.Multibill[0].tasks});
      }
      else{
        this.setState({MultibillSelected: -1, status: null, title: "", tasks: ""});
      }      
    }
  },
  addMultibillList: function(){
    this.setState({status: "add"});
    this.props.addMultibillList();
  },
  removeMultibillList: function(){
    this.setState({status: "remove"});
    this.props.removeMultibillList(this.state.MultibillSelected);
  },
  MultibillChange: function(e){
    var Multibill = this.props.Multibill;
    for (var i = 0; i < Multibill.length; i++){
      if (parseInt(Multibill[i].id) === parseInt(e.target.value)){
        this.setState({MultibillSelected: e.target.value, title: Multibill[i].title});
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
  storeID: function(e){
    if (taskVal === null)
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

  handleTaskIDBlur: function(e){
    var value = e.target.value;
    var tasks = this.state.tasks;
    var Multibill = this.props.Multibill;
    var scope = this;
    var key = e.target.getAttribute("data-key");
    
    if (value.indexOf("https://") > -1) //Allow the user to paste a genome url or hask of the ticket
    {
      value = value.substring(value.lastIndexOf("/") + 1);
    }
    else if (value.indexOf("#") === 0){
      value = value.substring(1);
    }

    
    if (value === "") { //Remove the task completely if the value is null
      tasks = tasks.filter(function(task){
        return task.key !== key;
      });
      scope.setState({tasks:tasks});
      this.props.model.handleMultibillTaskIDChange(this.state.MultibillSelected, tasks);
    }
    else{
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
          scope.props.model.handleMultibillTaskIDChange(scope.state.MultibillSelected, tasks);
          scope.setState({tasks:tasks});
          
        }, function(error){
          tasks = tasks.map(function (task) {
            if (task.key === key){
              return { key: task.key, id: taskVal, projectID: task.projectID, title: task.title, projectName: task.projectName};
            }
            else
              return task;
          });
          taskVal = null;
          scope.setState({tasks:tasks});
        });
      }
      else{
        
        tasks = tasks.map(function (task) {
          if (task.key === key){
            return { key: task.key, id: taskVal, projectID: task.projectID, title: task.title, projectName: task.projectName};
          }
          else
            return task;
        });
        taskVal = null;
        scope.setState({tasks:tasks});
      }
    }
  },

  titleChange: function(e){
    this.setState({title: event.target.value});
    this.props.model.handleMultibillTitleChange(this.state.MultibillSelected, event.target.value);
  },
	render: function() {
    var scope = this;

    var MultibillList = this.props.Multibill.map(function (entry) {
      return (
        <option value={entry.id}>
          {entry.title}
        </option>
        );
    }, this);

    var MultibillTasks = this.state.tasks.map(function (task){
      return (
        <div key={task.key}>
          <div className="id-wrapper">
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
            <div className="task-title">Title: {task.title}</div>
            <div className="task-project">Project: {task.projectName}</div>
          </div>
          <hr/>
        </div>
      );
    }, this);

    var MultibillData =  (
      <span>
        <label>List Title:</label>
        <input 
          type="text" 
          name="title-edit" 
          className="form-control" 
          placeholder="Enter Title"
          value={this.state.title}
          onChange={this.titleChange}
        />
        <hr/>
        {MultibillTasks}

        <div className="id-wrapper">
          <label>New Task ID:</label>
          <input 
            type="text" 
            name="id-edit" 
            className="form-control" 
            placeholder="Enter ID"
            data-id={-1}
            value={this.state.newTaskID}
            onChange={this.handleNewTaskIDChange}
            onBlur={this.handleNewTaskIDBlur}
          />

        </div>
      </span>
    );
    

    return (
      <section id="edit-Multibill">
        <a className="destroy" onClick={this.props.closeMultibill}>
          <i className="fa fa-remove"></i>
        </a>
        {this.props.Multibill.length > 0 ?
          <span>
            <select onChange={this.MultibillChange} value={this.state.MultibillSelected}>
              {MultibillList}
            </select>
            <a className="add-Multibill" onClick={this.addMultibillList}><i className="fa fa-plus-square"></i> Add New List</a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a className="remove-Multibill" onClick={this.removeMultibillList}><i className="fa fa-minus-square"></i> Remove Current List</a>
            <hr/>
            {MultibillData}
          </span>
        : <div className="no-Multibill">
          No Multi-bill lists found. <a onClick={this.addMultibillList}>Click here</a> to add a new list
        </div> }

      </section>
    );
  }
});


module.exports = Multibill;