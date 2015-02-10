

var GSchedulerItem = React.createClass({
  render: function() {
    return (
      <li className="timer">
        {this.props.children.toString()}
        <i className="fa fa-times-circle" onClick={this.props.removeTimer}></i>
      </li>
    );
  }
});

module.exports = GSchedulerItem;