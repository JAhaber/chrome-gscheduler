var React = require('react');

var Footer = React.createClass({
	openOptions: function(){
    chrome.tabs.create({ url : 'chrome://extensions?options=' + chrome.runtime.id});
  },
  toggleHelp: function(){
    chrome.tabs.create({ url : 'https://github.com/iDVB/chrome-gscheduler/blob/master/README.md'});
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
      <div className={this.props.length ? "save-btn" : "save-btn disabled"} onClick={this.props.save} title="Click to send your tasks to your Genome Schedule">Save to Genome</div>
      
    </footer>

    );
  }
});

module.exports = Footer;