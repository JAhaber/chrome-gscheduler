
var React = require('react');
var Moment = require('moment');
var _ = require('underscore');
var GenomeAPI = require('./GenomeAPI.js');


var AutoBill = React.createClass({
 
	render: function() {

  var autobillList = this.props.autobill.map(function (entry) {
    return (
      <option value={entry.id}>
        {entry.title}
      </option>
      );
  }, this);

  return (
      <section id="edit-autobill">
        <a className="destroy" onClick={this.props.closeAutobill}>
          <i className="fa fa-remove"></i>
        </a>
        {this.props.autobill.length > 0 ?
          <select onChange={this.autobillChange}>
            {autobillList}
          </select>
        : <div className="no-autobill">
          No autobill lists found. <a onClick={this.props.addAutobillList}>Click here</a> to add a new list
        </div> }

      </section>
    );
  }
});


module.exports = AutoBill;