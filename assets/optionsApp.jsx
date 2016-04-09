var $ = require('jquery');
var React = require('react');
var timer = null;
// Saves options to chrome.storage.sync.
var OptionScript = React.createClass({
  saveOptions: function () {

    chrome.storage.sync.set({
      newestFirst: $('#newestFirst').prop('checked'),
      recentNewestFirst: $('#recentNewestFirst').prop('checked'),
      showBackup: $('#showBackup').prop('checked'),
      saveType: $('input[name=type]:checked').val(),
      autoRemind: $('#autoReminder').val(),
      startHour: $('#startHour').val(),
      startMin: $('#startMin').val(),
      recentTasks: $('#recentTasks').val(),
      genomeTask: $('#showGenomeTask').prop('checked'),
      customStyles: $('input[name=skin]:checked').val() === "custom" ? $('#customStyles').val() : "",
      skin: $('input[name=skin]:checked').val()

    }, function() {
      // Update status to let user know options were saved.
      
      $('#status').removeClass("active");
      clearTimeout(timer);
      timer = null;
      setTimeout(function(){

        $('#status').addClass("active");
        
        timer = setTimeout(function() {
          $('#status').removeClass("active");
        }, 1500);

      }, 200);
    });
  },

  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  restoreOptions: function () {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      newestFirst: true,
      recentNewestFirst: false,
      showBackup: true,
      saveType: 'Actual',
      autoRemind: 'Never',
      startHour: "9",
      startMin: "0",
      recentTasks: "1",
      genomeTask: true,
      customStyles: "",
      skin: ""
    }, function(items) {
      var radioType = $('input[name=type]');
      for (i = 0; i < radioType.length; i++) {
        if ( radioType[i].value === items.saveType ) {
          radioType[i].checked = true;
          break;
        }
      }

      var radioType = $('input[name=skin]');
      for (i = 0; i < radioType.length; i++) {
        if ( radioType[i].value === items.skin ) {
          radioType[i].checked = true;
          break;
        }
      }

      $('#autoReminder').val(items.autoRemind);
      $('#startHour').val(items.startHour);
      $('#startMin').val(items.startMin);
      $('#recentTasks').val(items.recentTasks);
      $('#customStyles').val(items.customStyles);
      $('#newestFirst').prop('checked', items.newestFirst);
      $('#recentNewestFirst').prop('checked', items.recentNewestFirst);
      $('#showBackup').prop('checked', items.showBackup);
      $('#showGenomeTask').prop('checked', items.genomeTask);
    });
  },

  openShortcut: function(){
      chrome.tabs.create({url:'chrome://extensions/configureCommands'});      
  },
  render: function(){
    this.restoreOptions();

    return (
      <div>
      <div className="option">
      <h2>Save tasks as:</h2>
        <div className="form-wrapper">
            <span className="radio"><input type="radio" name="type" value="Actual" defaultChecked onClick={this.saveOptions}/>Actual</span>
            <span className="radio"><input type="radio" name="type" value="Sequenced" onClick={this.saveOptions}/>Sequenced</span>
        </div>
        <p><span className="emph">Actual</span> - Save tasks using start and stop times.<br />
        <span className="emph">Sequenced</span> - Save tasks in order using duration starting from<br />
        <select id="startHour" onChange={this.saveOptions}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
        </select><b> :</b>
        <select id="startMin" onChange={this.saveOptions}>
          <option value="0">00</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="45">45</option>
        </select><br />
        </p>
      </div>


      <div className="option">
        <h2>Hotkey:</h2>
        <p>You can edit the default hotkey for GScheduler on the <a id="openShortcuts" onClick={this.openShortcut}>Chrome Keyboard Shortcuts</a> page</p>
      </div>

      <div className="option">
        <h2>Auto-reminder:</h2>
        <p>Remind me that I have a task running every: 
          <select id="autoReminder" className="long" onChange={this.saveOptions}>
            <option value="Never">Never</option>
            <option value="15">15 Mins</option>
            <option value="30">30 Mins</option>
            <option value="45">45 Mins</option>
            <option value="60">1 Hour</option>
            <option value="120">2 Hours</option>
            <option value="240">4 Hours</option>
            <option value="480">8 Hours</option>
          </select>
        </p>
      </div>
      
      <div className="option">
        <h2>Recent Tasks:</h2>
        <p>Load recent tasks from the last:
          <select id="recentTasks" className="long" onChange={this.saveOptions}>
            <option value="1">1 Week</option>
            <option value="2">2 Weeks</option>
            <option value="3">3 Weeks</option>
            <option value="4">4 Weeks</option>
          </select>
        </p>
      </div>

      <div className="option">
        <input type="checkbox" id="newestFirst" defaultChecked onClick={this.saveOptions}/> Sort tasks by newest first
       </div>
       <div className="option">
        <input type="checkbox" id="recentNewestFirst" onClick={this.saveOptions}/> Sort recent tasks list by newest first
       </div>
       <div className="option">
        <input type="checkbox" id="showGenomeTask" defaultChecked onClick={this.saveOptions}/> Show a button in Genome to add tasks to GScheduler
       </div>
       <div className="option">
        <input type="checkbox" id="showBackup" defaultChecked onClick={this.saveOptions}/> Allow me to restore the last set of saved tasks
       </div>

      <div className="option">
        <h2>Skins:</h2>
        <span className="radio"><input type="radio" name="skin" value="" defaultChecked onClick={this.saveOptions}/>Default</span>
        <span className="radio"><input type="radio" name="skin" value="noir" onClick={this.saveOptions}/>Noir</span>
        <span className="radio"><input type="radio" name="skin" value="midnight" onClick={this.saveOptions}/>Midnight</span>
        <span className="radio"><input type="radio" name="skin" value="fuzzy-peaches" onClick={this.saveOptions}/>Fuzzy Peaches</span>
        <br/>
        <br/><span className="radio"><input type="radio" name="skin" value="custom" onClick={this.saveOptions}/>Custom (uses styles below)</span>
        <textarea id="customStyles" onChange={this.saveOptions}/>
        <p>Don't like how GScheduler looks? Enter your own css here to style it your way. Email me your custom skin to have it included as a theme in a future release! (jhaber@katalystadvantage.com)</p>
       </div>

        <div id="status">Options saved.</div>
      </div>
      );

  }
});




module.exports = OptionScript;