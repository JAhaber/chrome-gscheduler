
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');


var Multibill = React.createClass({
  getInitialState: function () {
    return {
      MultibillSelected: this.props.Multibill.length > 0 ? this.props.Multibill[0].id : -1,
      title: this.props.Multibill.length > 0 ? this.props.Multibill[0].title : "",
      status: null,
      newTaskID: ""
    };
  },
  componentDidUpdate: function(){
    if (this.state.status === "add"){
      this.setState({MultibillSelected: this.props.Multibill[this.props.Multibill.length - 1].id, status: null, title: this.props.Multibill[this.props.Multibill.length - 1].title});
    }
    else if (this.state.status === "remove"){
      if (this.props.Multibill.length > 0){
        this.setState({MultibillSelected: this.props.Multibill[0].id, status: null, title: this.props.Multibill[0].title});
      }
      else{
        this.setState({MultibillSelected: -1, status: null, title: ""});
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
  handleTaskIDBlur: function(e){
    var id = event.target.getAttribute("data-id");
    if (parseInt(id) === -1)
      this.setState({newTaskID: ""});
    this.props.model.handleMultibillTaskIDChange(this.state.MultibillSelected, id, event.target.value)
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

    var MultibillTasks = this.props.Multibill.map(function (entry){
      if (parseInt(entry.id) === parseInt(this.state.MultibillSelected)){
        return entry.tasks.map(function (task){
          return (
            <div key={task.key}>
              <div className="id-wrapper">
                <label>Task ID:</label>
                <input 
                  type="text" 
                  name="id-edit" 
                  className="form-control" 
                  placeholder="Enter ID"
                  defaultValue={task.id}
                  data-id={task.id}
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
      }
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
            onBlur={this.handleTaskIDBlur}
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
          No Multibill lists found. <a onClick={this.addMultibillList}>Click here</a> to add a new list
        </div> }

      </section>
    );
  }
});


module.exports = Multibill;