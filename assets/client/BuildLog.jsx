var React = require('react');

var LogItem = React.createClass({
   render: function() {
    return (
      <div className="updateLog">
      <h1>GScheduler Version: 0.2.6 Changelog:</h1>
        
        <ul>
          <p>Bug Fixes</p>
          <li>Selecting a task in the Task name/ID box, changing the focus away from the app without creating the task, then refocusing the box will no longer clear the task information and create a note. It will now properly create the task that was selected.</li>
       
       </ul>

      <h1>GScheduler Version: 0.2.5 Changelog:</h1>
        
        <ul>
          <p>Recent Tasks</p>
          <li>Option added to reverse the order that tasks show up in the recent task list</li>
        

        <div className="divider"></div>

        <p>Bug Fixes</p>
        <li>GScheduler will no longer filter out closed tasks in any of it's search fields</li>
        <li>The "Track in GScheduler" button will now appear on closed task pages in Genome</li>
        <li>When the start time and duration would add up to exactly midnight, the duration will now properly adjust to total 11:59:59</li>
       </ul>

      <h1>GScheduler Version: 0.2.4 Changelog:</h1>
        
        <ul>
          <p>Genome Tracking Button</p>
          <li>Updated style of the button that appears on task pages to work with new Genome design</li>
        </ul>

        <h1>GScheduler Version: 0.2.3 Changelog:</h1>
        
        <ul>
          <p>Search Results</p>
          <li>Projects have been added to the search results to differentiate tasks with similar names</li>
          <li>Restyled the search results dropdown</li>
          <ul>     
            <li>Tasks will appear in blue</li>
            <li>Projects will appear in red and indented slightly</li>
            <li>Task/Project names will be limited to one line and overflow is hidden</li>
            <li>Full Task/Project names can be seen by hovering over the text</li>
          </ul>
          <li>The dropdown will now resize to match the window size</li>

          <div className="divider"></div>
          <p>Recent Tasks</p>
          <li>Recent tasks have been updated to show information and styles similar to the search results</li>

        </ul>

        <h1>GScheduler Version: 0.2.2 Changelog:</h1>
        
        <ul>
          <p>Deleting Old Tasks</p>
          <li>Added 'Remove All' buttons to delete tasks from previous days</li>     
        </ul>

        <h1>GScheduler Version: 0.2.1 Changelog:</h1>
        
        <ul>
          <p>Recent Tasks</p>
          <li>Recent task pane added to the bottom of GScheduler (above the footer)</li>
          <li>Lock symbol indicates whether a task is open or closed in genome</li>
          <li>Play button beside each task to begin tracking to the task</li>
          <li>Drag and drop features implemented for opening/sharing the genome link</li>
          <li>Option added to change the number of weeks to load tasks from (up to 4 weeks)</li>          
        </ul>

        <h1>GScheduler Version: 0.1.10 Changelog:</h1>
        
        <ul>
          <p>Verify Login</p>
          <li>When opening GScheduler, it will now check if you are logged in to Genome</li>
          <li>If you are not logged in, you will be redirected to the google login page</li>
                   
          <div className="divider"></div>
          <p>Readme</p>
          <li>The Readme file for GScheduler has been updated!</li>
          <ul>
            <li>Readme has a How To section that explains how to use most of the GScheduler functionality</li>
            <li>A help button has been added to GScheduler that opens this page in the browser</li>
          </ul>
         
          <div className="divider"></div>
          <p>Genome Schedule</p>
          <li>Clicking on "Today" or a date headline in GScheduler will now open the specified date in your Genome schedule</li>
          
          <div className="divider"></div>
          <p>Bug Fixes</p>
          <li>Dragging a URL onto GScheduler should no longer open the link in the GScheduler window</li>
          <li>GScheduler should now always pop up when adding a new entry by clicking the "Add to GScheduler" button in Genome</li>

        </ul>

        <h1>GScheduler Version: 0.1.9 Changelog:</h1>
        
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
        <h1>GScheduler Version: 0.1.8 Changelog:</h1>
        
        <ul>
          <p>Auto-upload</p>
          <li>Grunt task for uploading to webstore implemented to allow faster deploys of new versions</li>
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