var React = require('react');
var timer = null;

var SaveScreen = React.createClass({
  getInitialState: function () {
    return {
      savingText: "Saving"
    };
  },

  componentDidMount: function() {
    var that = this;
    timer = setInterval(function(){
      if (that.state.savingText == "Saving..."){
        that.setState({savingText: "Saving"});
      }
      else{
        that.setState({savingText: that.state.savingText + "."})
      }
    }, 400);
  },

  componentWillUnmount: function() {
    clearInterval(timer);
    timer = null;
  },


  render: function() {  
   return (
    <div className="save-screen">
      {this.state.savingText}
      <div className="footnotes">
        Please wait while your tasks are saved to Genome. If this screen has not disappeared after 60 seconds, please check that Genome is working properly and that you are still logged in. It could be an issue with Genome running slowly.<br/><br/>You can continue to wait for a response, or close/refresh the program to halt the save attempt and try again another time.
      </div>
    </div>

    );
  }
});

module.exports = SaveScreen;