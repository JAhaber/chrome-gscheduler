
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');


var AutoBill = React.createClass({
  getInitialState: function () {
    return {
      autobillSelected: this.props.autobill.length > 0 ? this.props.autobill[0].id : -1,
      title: this.props.autobill.length > 0 ? this.props.autobill[0].title : "",
      status: null
    };
  },
  componentDidUpdate: function(){
    if (this.state.status === "add"){
      this.setState({autobillSelected: this.props.autobill[this.props.autobill.length - 1].id, status: null, title: this.props.autobill[this.props.autobill.length - 1].title});
    }
    else if (this.state.status === "remove"){
      if (this.props.autobill.length > 0){
        this.setState({autobillSelected: this.props.autobill[0].id, status: null, title: this.props.autobill[0].title});
      }
      else{
        this.setState({autobillSelected: -1, status: null, title: ""});
      }      
    }
  },
  addAutobillList: function(){
    this.setState({status: "add"});
    this.props.addAutobillList();
  },
  removeAutobillList: function(){
    this.setState({status: "remove"});
    this.props.removeAutobillList(this.state.autobillSelected);
  },
  autobillChange: function(e){
    var autobill = this.props.autobill;
    for (var i = 0; i < autobill.length; i++){
      if (parseInt(autobill[i].id) === parseInt(e.target.value)){
        this.setState({autobillSelected: e.target.value, title: autobill[i].title});
      }
    }
    
  },
  handleTaskIDChange: function(e, id){
    this.props.model.handleAutobillTaskIDChange(this.state.autobillSelected, event.target.getAttribute("data-id"), event.target.value)
  },
  titleChange: function(e){
    this.setState({title: event.target.value});
    this.props.model.handleAutobillTitleChange(this.state.autobillSelected, event.target.value);
  },
	render: function() {
    var scope = this;

    var autobillList = this.props.autobill.map(function (entry) {
      return (
        <option value={entry.id}>
          {entry.title}
        </option>
        );
    }, this);

    var autobillTasks = this.props.autobill.map(function (entry){
      if (parseInt(entry.id) === parseInt(this.state.autobillSelected)){
        return entry.tasks.map(function (task){
          return (
            <div>
              <div className="id-wrapper">
                <label>Task ID:</label>
                <input 
                  type="text" 
                  name="id-edit" 
                  className="form-control" 
                  placeholder="Enter ID"
                  defaultValue={task.id}
                  data-id={task.id}
                  onBlur={scope.handleTaskIDChange}
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

    var autobillData =  (
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
        {autobillTasks}

        <div>
          <label>Task ID:</label>
          <input 
            type="text" 
            name="id-edit" 
            className="form-control" 
            placeholder="Enter ID"
            data-id={-1}
            onBlur={scope.handleTaskIDChange}
          />

        </div>
      </span>
    );
    

    return (
      <section id="edit-autobill">
        <a className="destroy" onClick={this.props.closeAutobill}>
          <i className="fa fa-remove"></i>
        </a>
        {this.props.autobill.length > 0 ?
          <span>
            <select onChange={this.autobillChange} value={this.state.autobillSelected}>
              {autobillList}
            </select>
            <a className="add-autobill" onClick={this.addAutobillList}><i className="fa fa-plus-square"></i> Add New List</a>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a className="remove-autobill" onClick={this.removeAutobillList}><i className="fa fa-minus-square"></i> Remove Current List</a>
            <hr/>
            {autobillData}
          </span>
        : <div className="no-autobill">
          No autobill lists found. <a onClick={this.addAutobillList}>Click here</a> to add a new list
        </div> }

      </section>
    );
  }
});


module.exports = AutoBill;