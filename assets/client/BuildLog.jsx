var React = require('react');

var LogItem = React.createClass({
   render: function() {
    return (
      <div className="updateLog">

      <h1>GScheduler Version: 0.4.4 Changelog:</h1>
        
        <ul>
          <p>Project Name</p>
          <li>An option to view project names under the task information has been added.</li>

        </ul>

      <h1>GScheduler Version: 0.4.3 Changelog:</h1>
        
        <ul>
          <p>Multi-bill</p>
          <li>When clicking the edit button, the Multi-bill page will now default to the list item you had selected in your task, or the first list item if none was selected</li>

          <div className="divider"></div>

          <p>Bug Fixes</p>
          <li>Fixed issue with Multi-bill where only the first list would save properly, and other lists would save as a note</li>
       </ul>

      <h1>GScheduler Version: 0.4.2 Changelog:</h1>
        
        <ul>
          <p>Search Box</p>
          <li>Multi-bill lists now show up in the search box</li>

          <div className="divider"></div>

          <p>Bug Fixes</p>
          <li>Fixed issue with Multi-bill where only the first list would save properly, and other lists would save as a note</li>
       </ul>


      <h1>GScheduler Version: 0.4.1 Changelog:</h1>
        
        <ul>
          <p>Bug Fixes</p>
          <li>Fixed issue with Multi-bill where after removing your last remaining list you would be unable to create a new list until you restart the app</li>
       </ul>

       <h1>GScheduler Version: 0.4.0 Changelog:</h1>
        
        <ul>
          <p>Multi-bill (Beta)</p>
          <li>Introducting Multi-bill, a new way to track your time when you have multiple projects on the go</li>
          <li>Multi-bill allows you to track multiple tasks at once and divides your tracked time evenly among them when you save to Genome</li>
          <li>Select multi-bill as your task type and use the dropdown to choose a list to bill to</li>
          <li>Use the "edit" button that appears in your task to change, add, or remove lists. Each list has it's own set of tasks for billing</li>
          <li><strong>Warning: When saving to Genome, your Multi-bill tasks will save to whatever is on the Multi-bill list at the time of saving, not what was on the list when you started the task.</strong> If you want different Multi-bill tasks, create different lists!</li>
          <li>This release should be stable, but if you find any bugs with Multi-bill, please email them to jhaber@katalystadvantage.com</li>

          <div className="divider"></div>

          <p>Bug Fixes</p>
          <li>Many React warnings have been fixed and should no longer appear in the console</li>
       </ul>

      <h1>GScheduler Version: 0.3.2 Changelog:</h1>
        
        <ul>
          <p>Recent, Favorite, and Genome Tasks</p>
          <li>Task IDs in the Recent, Favorite and Genome Task lists can now be clicked to open the task in Genome</li>
       </ul>
       
      <h1>GScheduler Version: 0.3.1 Changelog:</h1>
        
        <ul>
          <p>Task Auto-rollover</p>
          <li>When you leave a task running without opening GScheduler for 3 or more days, the task will now automatically be stopped at midnight of the day it was started instead of rolling over and creating a new task each day</li>
          <li>This is meant to prevent cases where someone left a task going and stopped using GScheduler, and upon using it again days/months later, had to wait while GScheduler added all the additional tasks since that task had started</li>
          <li>Daily task rollovers will still work as intended, starting a new task at midnight to continue billing for the new day, as long as GScheduler is opened at some point within 3 days of the task being started</li>
          
          <div className="divider"></div>

          <p>Search/Notes Fields</p>
          <li>Functionality has been adjusted for the Search and Notes field to allow for the Notes field to be hidden when skinning</li>
          <li>If the Notes field in the header is set to display:none, all tasks typed/found from the Search field will now be created immediately when selected or enter is pressed (normal functionality: the Notes field will gain focus and only after pressing enter there will the task be created)</li>

          <div className="divider"></div>

          <p>Skins</p>
          <li>The following new skins have been added:</li>
          <ul>
            <li>NightRei</li>
          </ul>

          <div className="divider"></div>

          <p>Bug Fixes</p>
          <li>The location that the notification system searches for messages no longer exists and was throwing an error in the console. The call has been updated to point to the new location.</li>

       </ul>
      <h1>GScheduler Version: 0.3.0 Changelog:</h1>
        
        <ul>
          <p>Favorites</p>
          <li>You can now store a list of favorite tasks for ease of use</li>
          <li>Genome tasks can now be added or removed from your favorites list by clicking the star next to the task</li>
          <li>A yellow outlined star means a task has not been favorited, a filled yellow star means it is a favorite, and a grey outline means the task cannot be favorited</li>
          <li>Click the <em>Favorite Tasks</em> button in the footer to open your favorites list, where you can start tracking a task or remove it from the list</li>
          <div className="divider"></div>
          <p>Genome Tasks</p>
          <li>Click the <em>Genome Tasks</em> button in the footer to bring up a list of tasks currently assigned to you in Genome</li>
          <li>You can start tracking a new task directly from this menu, just like the Recent Tasks list</li>
          <div className="divider"></div>
          <p>Splitting Tasks</p>
          <li>The new broken link icon can be used to quickly split a task in half</li>
          <li>Clicking the broken link icon next to a task will divide the task into 2 parts with equal durations</li>
          <li>You can only split tasks that have been stopped</li>
          <div className="divider"></div>
          <p>Tooltips</p>
          <li>All the old mouseover tooltips have been removed and replaced with title text for simplicity</li>   
          <div className="divider"></div>
          <p>Notifications</p>
          <li>GScheduler can now receive notifications. These will appear below your tasks and above the <em>Restore Tasks</em> button (when visible)</li>
          <li>Notifications will show until either a new notification is received or you click to hide it, at which point the same notification will not appear again</li>
          <li>Notifications may be used in future to provide information about updates or issues with GScheduler</li>
          <div className="divider"></div>
          <p>Skins</p>
          <li>Custom skins have been added in the options menu</li>       
          <li>You can now choose one of a few default skins, or select custom skin and enter your own css to style GScheduler to your preference</li>       
          <li>Additional skins will be added in future updates and you can submit send in your own designs to have them added to the list</li>
          <div className="divider"></div>
          <p>Options</p>
          <li>The save button on the options page has been removed. Any changes in options should now auto-save and GScheduler will immediately reflect the changes</li>       

       </ul>
      <h1>GScheduler Version: 0.2.9 Changelog:</h1>
        
        <ul>
          <p>Bug Fixes</p>
          <li>Fixed a bug where I broke everything fixing the last bug...</li>
       
       </ul>
      <h1>GScheduler Version: 0.2.8 Changelog:</h1>
        
        <ul>
          <p>Bug Fixes</p>
          <li>Removed the Alert that appears when before taking you to the log in page for Genome when you are not logged in</li>
       
       </ul>
      <h1>GScheduler Version: 0.2.7 Changelog:</h1>
        
        <ul>
          <p>Task ID</p>
          <li>Pasting a Genome Task url into the Task ID field of an entry will now find the proper task based on the number in the url</li>
       
       </ul>

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