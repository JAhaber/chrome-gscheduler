
var React = require('react');
var style = "";
var skin = "";

var customStyles = React.createClass({
  getInitialState: function() {
    return {
      style: this.props.model.customStyle
    };
  },
  componentDidUpdate: function(){
    if (this.props.model.skin !== skin || this.props.model.customStyle !== style){
      this.props.model.updateStyles(style, skin);
      this.setState({style: style});
    }
    
  },
  render: function() {
    return (
      <style>
        {this.state.style}          
      </style>
    );
  }
});


chrome.storage.sync.get({
    customStyles: "",
    skin: ""
  }, function(items) {
    style = items.customStyles;
    skin = items.skin;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
     customStyles: "",
     skin: "",
  }, function(items) {
    style = items.customStyles;
    skin = items.skin;
  });
});


module.exports = customStyles;