var React = require('react');

var LogItem = React.createClass({
   render: function() {
    return (
      <div className="updateLog">
        <h1>GScheduler Version: 0.1.8 Changelog:</h1>
        
        <ul>
          <p>Draggable Tasks</p>
          <li>Project tasks (blue) can now be dragged into other programs</li>
          <li>Dragging a task and dropping it will pass the task's genome url to the drop location:</li>
          <ul>
            <li>Drag and drop into chrome to go to the genome page for that task</li>
            <li>Drop into emails/instant messengers to share the url</li>
          </ul>
          
          <div className="divider"></div>
          <p>Genome Integration</p>
          <li>When opening a task in genome, a "Track in GScheduler" button will now float in the bottom middle of the page</li>
          <ul>
            <li><strong>Note: No button appears if the task status is closed</strong></li>
          </ul>
          <li>Clicking the button will open GScheduler and begin tracking the task</li>
          <li>An option has been added to enable/disable the button</li>

          <div className="divider"></div>
          <p>Change Log</p>
          <li>Updated change log icon</li>
          
        </ul>

        <h1>GScheduler Version: 0.1.7 Changelog:</h1>
        
        <ul>
          <p>Warnings</p>
          <li>Added warning tooltips to notify users of issues with tasks:</li>
          <ul>
            <li>Warning will appear when a task is less than one minute in length to notify that it will not be saved</li>
            <li>Warning will appear when a task's stop time overlaps a later task's start time</li>
          </ul>
          
          <div className="divider"></div>
          <p>Gaps</p>
          <li>GScheduler now detects gaps between tasks of one minute or more and offers options for filling the time:</li>
          <ul>
            <li>Users can create a new task which will automatically set the start and stop time to fill the gap</li>
            <li>Users can extend the previous task's stop time</li>
            <li>Users can extend the next task's start time</li>
          </ul>
         
          <div className="divider"></div>
          <p>Non-Project</p>
          <li>Non-Project tasks can now be selected while editting a task by clicking the 'Non-project?' checkbox and selecting from the dropdown</li>
          
          <div className="divider"></div>
          <p>Backup Tasks</p>
          <li>The last set of tasks saved to genome will now be set as a backup task list</li>
          <li>When a backup is available, users can click a button to restore the previously saved tasks to GScheduler. These will be added to the task list and will not overwrite any new tasks</li>
          
          <div className="divider"></div>
          <p>Options</p>
          <li>Removed rounding option. All tasks now round down to the nearest minute to avoid conflicts when saving to genome</li>
          <li>Added option to reverse the order of tasks (newest last) to match genome schedule if desired</li>
          <li>Added option to show/hide the backup button after saving</li>
          
          <div className="divider"></div>
          <p>Bug Fixes</p>
          <li>Dates can no longer be in the future</li>
          <li>Fixed a bug that showed the wrong duration for tasks that were left in GScheduler overnight</li>
        </ul>
        <a className="destroy" onClick={this.props.closeLog}>
          <i className="fa fa-remove"></i>
        </a>
      </div>
    );
  }
});

module.exports = LogItem;