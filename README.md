# GScheduler
*Powered by Genome*

Rapidly track tasks to Genome without having to load your schedule.

GScheduler was built to allow you to track your Genome tasks with ease. Replicating many of the Genome scheduler features, but being available at the click of a button, it is a great tool for recording time spent on a task and tracking how you spend your day at Klick!

## Capabilities

- Track how you spend your time, whether you know the task ID or not. GScheduler allows you to track tasks, notes, and non-project entries and colour coordinates them just like Genome (Blue, Yellow, and Grey respectively)

- Track time from the start, not the end!

    In Genome, you usually fill out your schedule when you have finished working on a task. It's easy to lose track of how much time you spent on a project. Track your task in GScheduler and it will tick away the seconds until you finish your task. This helps you remain aware of how much time you are spending.

- Save your tasks directly to Genome at the end of the day

- Integration with Genome API to search for your tasks by name or ID

- Add a task to GScheduler with the press of a button when looking at the task in Genome


## How To Install

- Log in to your Klick account and go to the [Chrome Web Store](https://chrome.google.com/webstore/category/for_your_domain)

- Install the GScheduler extension

- Click the GScheduler button on your chrome window, or press CTRL+Shift+Comma to open the extension (this hotkey can be changed in the options)

## How To Use

### Creating an Entry

- Select the **Task name/ID** box at the top of the window
- Type in any of the following:

1. **A task ID or the title of a task**: When you type in a valid task ID or title of a task, GScheduler will use the Genome API to locate the task information and offer you a dropdown containing any tasks that match your input.

    Selecting from the dropdown by clicking an option or highlighting an option and pressing enter will associate your new entry in GScheduler with the task in Genome.

    The **Note** field will be focused so you can enter any details you want to add about the task you are tracking. You can choose to fill this out or leave it blank (it can be editted later) and press **Enter** from this field to create the new entry. This entry will be tagged in Blue to indicate it is associated with a task.

2. **The title of a non-project task**: Similar to searching for a task in Genome, GScheduler will check if the content you are typing matches a non-project task.

    Adding a non-project task follows the same procedure as a regular task (selecting from a dropdown, filling out the notes field) but will associate your entry with a non-project category (tagged in Grey) instead of a task ID when the entry is created.

3. **Any other random text**: If you type in the **Task name/ID** field and do not find any matches, or choose not to select a match, you can still press **Enter** to create a new **Note** entry.

    A **Note** entry is tagged in Yellow to indicate it is not associated with anything in Genome. When you save to Genome at the end of the day, the note will be entered in the schedule, but you will need to convert it to a task before you can confirm your schedule.

### Stopping an Entry

When an entry is active, it will continuously count the time elapsed since it was created and a red **stop** button will appear on the right hand side. Click the stop button to finish tracking time on that entry.

Alternatively, creating a new entry will automatically stop any other entry that is running. This allows you to continuously track your time without any gaps in your schedule.

### Duplicating an Entry

A stopped entry will have a blue **play** button on the right hand side. Pressing the button will create a new entry starting at the current time, with the same details (Title, Task ID, Notes). This is ideal if you are switching back and forth between tasks and is faster than adding the task again using the Task name/ID field.

### Editing an Entry

You can edit an entry in GScheduler by clicking the **+** button on the left side of the entry's title. This will expand the field to include a number of different input fields. A few of the fields will not be available for editting until the entry has been stopped.

- **Non-Project checkbox**: If the checkbox is selected, you will see a dropdown with a list of non-projects that can be assigned. If it is not selected, there will be a Title and Task ID field that can be filled out. Toggle the checkbox if you need to change from project to non-project, or vice versa.

- **Title**: Enter the title for your entry. Entering a valid Task ID or Non-Project selection will automatically update this.

- **Task ID**: Enter the Genome task associated with this entry. If a valid task is entered, the title will automatically change to the task title, and the entry will change to blue. If the task is invalid, the entry will change to yellow and will become a note.

- **Non-Project Category**: Select from a list of non-projects to use. Selecting from this list will remove any **Task ID** for the entry and change the title to the non-project name.

- **Start**: Edit the start time of the entry. The format is HH:MM:SS. Changing the start time will affect the duration and stop time. If the start time is before the stop time, the duration will change to be the difference. If it is after the stop time, the duration does not change, and the stop time will be adjusted. Stop time = new start time + duration.

- **Stop**: Edit the stop time of the entry. The format is HH:MM:SS. This field cannot be edited unless the entry has been stopped. Changing the stop time will affect the duration and start time. If the stop time is after the start time, the duration will change to be the difference. If it is before the start time, the duration does not change, and the start time will be adjusted. Start time = new stop time - duration.

- **Date**: Change the date for the entry. This field cannot be edited unless the entry has been stopped. This affects what schedule day the entry will save to on Genome.

- **Duration**: Change the duration of the entry. This field cannot be edited unless the entry has been stopped. Adjusting the duration will change the stop time as the stop time will always be start time + duration.

- **Note**: Change the notes for the entry. If the entry is a task, when saving to Genome your notes will be added to the schedule notes field. If it is not a task (non-project or note), when saving to Genome the notes field will consist of your **Title** plus your **Notes**. This ensures that the notes field in Genome has data since it is required in some instances.

### Deleting an Entry

Press the **X** button on the right hand side of an entry to remove it from GScheduler. If the entry was between two other entries, this will create a **Gap** of untracked time that you can choose to fill in.

### Saving to Genome

Press the **Save** button at any time to send your list of entries to your Genome schedule. This will clear your list of entries from GScheduler when completed. If you see an issue with your Genome schedule after saving, you can restore the entries to GScheduler by clicking **Restore from Backup**, which appears after you save.

### Gaps

When there is a minute or more between two tasks that has not been tracked, a **Gap** will appear indicating how much time is missing between entries. This entry is not a task and can be ignored. It is meant to provide options to help you fill out your schedule properly.

Gaps allow you to:

1. Add a new entry

    Clicking the **Add Task** button will create a new **Note** entry starting from the end of the last entry and continuing until the start of the next one. The start/stop/duration fields will all be filled out, but the rest will all be left empty for you to populate.

2. Extend the last entry

    Clicking the **Extend Last** button will take the previous task and add the duration of the gap to it's stop time, effectively making it run longer.

3. Extend the next entry

    Clicking the **Extend Next** button will take the next task and subtract the duration of the gap from it's start time, effectively making it start earlier.

### Drag and Drop

You can drag any entry that has a task ID (blue) off of GScheduler. It will contain the URL for that task in Genome. Drag it to your browser to go to the Genome page, or drag it into hangouts to share the URL with someone who needs to work on your task.

### Track from Genome

When loading a task page in Genome, if GScheduler is running and the task is not closed (you cannot track time to closed tasks), a **Track in GSchedule** button will appear at the bottom of the page. Click it to automatically create an entry in GScheduler for that task.

## Issues

If you experience any issues/bugs with GScheduler, you can log them on the [GScheduler issues list](https://github.com/iDVB/chrome-gscheduler/issues)


#### Updated 2015/06/04
