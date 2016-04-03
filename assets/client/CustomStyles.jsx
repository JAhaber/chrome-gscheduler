
var React = require('react');
var styles = "";

var customStyles = React.createClass({
  getInitialState: function() {
    return {
      showRecent: false
    };
  },
  render: function() {
    return (
      <style>
        {styles}          
      </style>
    );
  }
});


chrome.storage.sync.get({
    customStyles: ""
  }, function(items) {
    styles = items.customStyles;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
     customStyles: ""
  }, function(items) {
    styles = items.customStyles;
  });
});


module.exports = customStyles;