
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
    if (this.state.status === "add")
      this.setState({autobillSelected: this.props.autobill[this.props.autobill.length - 1].id, status: null});
  },
  addAutobillList: function(){
    this.setState({status: "add"});
    this.props.addAutobillList();
  },
  autobillChange: function(e){
    var autobill = this.props.autobill;
    for (var i = 0; i < autobill.length; i++){
      if (parseInt(autobill[i].id) === parseInt(e.target.value)){
        this.setState({autobillSelected: e.target.value, title: autobill[i].title});
      }
    }
    
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

    var autobillData =  (
          <span>
            <label>Title:</label>
            <input 
              type="text" 
              name="title-edit" 
              className="form-control" 
              placeholder="Enter Title"
              value={this.state.title}
              onChange={this.titleChange}
            />
          </span>
    );
    

    return (
      <section id="edit-autobill">
        <a className="destroy" onClick={this.props.closeAutobill}>
          <i className="fa fa-remove"></i>
        </a>
        {this.props.autobill.length > 0 ?
          <span>
            <select onChange={this.autobillChange}>
              {autobillList}
            </select>
            <a className="add-autobill" onClick={this.addAutobillList}><i className="fa fa-plus-square"></i> Add New List</a>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <a className="remove-autobill"><i className="fa fa-minus-square"></i> Remove Current List</a>
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