var React = require('react');
var Moment = require('moment');
var Analytics = require('./analytics.js');

var saveToGenome = 'all';

var Footer = React.createClass({
	openOptions: function(){
    chrome.tabs.create({ url : 'chrome://extensions?options=' + chrome.runtime.id});
    Analytics.send("App", "View", "Options");
  },
  toggleHelp: function(){
    chrome.tabs.create({ url : 'https://github.com/iDVB/chrome-gscheduler/blob/master/README.md'});
    Analytics.send("App", "View", "Readme");
  },
  save: function(){
    var dateToSave = 'all';
    if (!(saveToGenome == 'all')){
      dateToSave = Moment().format("YYYY-MM-DD");
    }
    this.props.save(dateToSave);
  },
  render: function() {
  
   return (
    <footer>
      <a className="options" onClick={this.openOptions} title="Options">
        <i className="fa fa-cog"></i>
      </a>
      <a className="log" onClick={this.props.toggleLog} title="Change Log">
        <i className="fa fa-info-circle"></i>
      </a>
      <a className="help" onClick={this.toggleHelp} title="Help">
        <i className="fa fa-question-circle"></i>
      </a>
      <div className={this.props.length ? "save-btn" : "save-btn disabled"} onClick={this.save} title="Click to send your tasks to your Genome Schedule">Save to Genome</div>
      
    </footer>

    );
  }
});

chrome.storage.sync.get({
    saveToGenome: 'all'
  }, function(items) {
    saveToGenome = items.saveToGenome;  
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
    saveToGenome: 'all'
  }, function(items) {
    saveToGenome = items.saveToGenome;
  });
});

module.exports = Footer;