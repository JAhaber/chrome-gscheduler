
var $ = require('jquery');
var _ = require('underscore');
var Promise = require('es6-promise').Promise;
var Q = require('q');
var Moment = require('moment');
var isSequenced;
var sequenceHour = 9;
var sequenceMin = 0;
var recentTaskWeeks = 1;
var saveToGenome = 'all';


var GenomeAPI = {

	ROUND_TO: 1,
	CURRENT_USER: null,
	GENOME_ENDPOINT: 'https://genome.klick.com/api',


  request: function(url, options, task) {
  	var task = task || {};
  	var options = options || {};
  	var deferred = Q.defer();

  	$.ajax(url, options)
  	.done(function(res) {
        deferred.resolve(res);
    })
    .fail(function(err){
    	deferred.resolve(err);
    });

    return deferred.promise;
  },

  get: function(url, options) {
		options.data = options.data || {};
		options.type = 'GET';

    return GenomeAPI.request(url, options);
  },

	post: function(url, options, task) {
		options.data = options.data || {};
		options.type = 'POST';
		var deferred = Q.defer();

		$.ajax(url, options)
	  	.done(function(res) {
	        deferred.resolve({results: res, task: task});
	    })
	    .fail(function(err){
	    	deferred.resolve({err: err, task: task});
	    });

	    return deferred.promise;

	    //return GenomeAPI.request(url, options, task);
  },
  getMessage:function(){
  	var options = {};

  	return GenomeAPI.get("https://raw.githubusercontent.com/JAhaber/chrome-gscheduler/master/sendMessage.json", options);
  },
  verifyUser: function() {
		var options = {};

		return GenomeAPI.get(GenomeAPI.GENOME_ENDPOINT + '/User/Current.json', options);
	},
  getUser: function() {
		var options = {};
		var deferred = Q.defer();
		GenomeAPI.CURRENT_USER ? deferred.resolve(GenomeAPI.CURRENT_USER) : GenomeAPI.get(GenomeAPI.GENOME_ENDPOINT + '/User/Current.json', options)
		.then(function(data){
			if(data.Entries[0]) {
				GenomeAPI.CURRENT_USER = data.Entries[0];
			}
			deferred.resolve(GenomeAPI.CURRENT_USER);
		});

		return deferred.promise;
	},
	getSchedule: function(user) {
		var options = {};
		return GenomeAPI.get(GenomeAPI.GENOME_ENDPOINT + '/TimeEntry.json?StartDate=' + Moment().subtract(7 * recentTaskWeeks, 'days').format("YYYY-MM-DD") + '&EndDate=' + Moment().format("YYYY-MM-DD") + '&UserIDs=' + user, options);		
	},
	getAssignedTasks: function(user) {
		var options = {};
		return GenomeAPI.get(GenomeAPI.GENOME_ENDPOINT + '/Ticket/Filter.json?TicketStatusIsOpen=true&AssignedToUserID=' + user, options);		
	},
	getProjectInfo: function(ticketid) {
		var options = {};
		return GenomeAPI.get(GenomeAPI.GENOME_ENDPOINT + '/Ticket.json?Enabled=true&ForAutocompleter=false&TicketID=' + ticketid, options);
	},
	getNonBillableTasks: function(){
		var options = {};
		return GenomeAPI.get(GenomeAPI.GENOME_ENDPOINT + "/TimeSheetCategory.json?Enabled=true", options);
	},
	postTimeEntry: function(task, options) {
		options = options || {};
		if (!task.note)
			task.note = "";
		options.data = {
			Date: task.startTime,
			Duration: this.getDuration(task, GenomeAPI.ROUND_TO),
			Note: task.title + "\n" + task.note,
			Type: 'Schedule-Note'
		};

		var projectData = {
			TicketID: task.ticketID || null,
			ProjectID: task.projectID || null,
			Type: 'Project',
			Note: task.note || "",
			IsClientBillable: task.isClientBillable || true
		};

		var nonProjectData = {
			TimeSheetCategoryID: task.categoryID || null,
			Type: 'Non-Project'
		}

		task.projectID ? $.extend(options.data, projectData) : false;
		task.categoryID ? $.extend(options.data, nonProjectData) : false;

		return GenomeAPI.getUser()
						.then(function(user){
							options.data.UserID = user.UserID
							return GenomeAPI.post(GenomeAPI.GENOME_ENDPOINT + '/TimeEntry.json', options, task);
						});
	},

	postTimeEntries: function(tasks, multibill, options) {

		options = $.extend({}, options, {
			isSequenced: isSequenced
		});
		var self = this;
		var sortedList = _.sortBy(tasks, function(o){ return o.startTime; });
		var previousTaskEndTime = Moment().startOf('day').hour(sequenceHour).minute(sequenceMin).format();
		var promises = sortedList.map(function (task, index) {
			var deferred = Q.defer();
			var newTask = _.extend({}, task);
			var duration = self.getDuration(task, GenomeAPI.ROUND_TO);
			
			if (!(Moment(previousTaskEndTime).date() === Moment(newTask.startTime).date())){
				previousTaskEndTime = Moment(newTask.startTime).hour(sequenceHour).minute(sequenceMin).format();
			}	
			newTask.startTime = options.isSequenced ? previousTaskEndTime : newTask.startTime;
			setTimeout(function(){
				if (newTask.Multibill){
					var listFound = false;
					for (var i = 0; i < multibill.length; i++){
				      if (parseInt(multibill[i].id) === parseInt(newTask.Multibill) && multibill[i].tasks.length > 0){
				      	listFound = true;
				      	var durationPerTask = Math.floor(duration / multibill[i].tasks.length);
				      	var curTask;
				      	for (var j = 0; j < multibill[i].tasks.length; j++){
				      		curTask = newTask;
				      		curTask.ticketID = multibill[i].tasks[j].id;
				      		curTask.projectID = multibill[i].tasks[j].projectID;
				      		curTask.startTime = (j > 0 ? Moment(curTask.startTime).add(durationPerTask, 'minutes').format() : curTask.startTime);
				      		curTask.stopTime = Moment(curTask.startTime).add(durationPerTask, 'minutes').format();
				      		deferred.resolve(GenomeAPI.postTimeEntry(curTask));
				      	}
				      	previousTaskEndTime = Moment(previousTaskEndTime).add(duration, 'minutes').format();
				      	break;
				      }
				    }
				    if (listFound === false){
				      	previousTaskEndTime = Moment(previousTaskEndTime).add(duration, 'minutes').format();
						newTask.stopTime = options.isSequenced ? previousTaskEndTime : newTask.stopTime;
						deferred.resolve(GenomeAPI.postTimeEntry(newTask));
				    }
				}
				else{
					previousTaskEndTime = Moment(previousTaskEndTime).add(duration, 'minutes').format();
					newTask.stopTime = options.isSequenced ? previousTaskEndTime : newTask.stopTime;
					deferred.resolve(GenomeAPI.postTimeEntry(newTask));
				}
			}, 100*index);

			return deferred.promise;
		});

		// Run in Sequence or in an async batch
  	return options.isSequenced ? promises.reduce(Q.when) : Q.all(promises);
	},

	// Find the duration in minutes of a task and optionally roundTo in (minutes)
	getDuration: function(task, roundTo) {
		var durationAsMinutes = Moment.duration(Moment(task.stopTime).diff(Moment(task.startTime))).asMinutes();
		
		durationAsMinutes = roundTo * Math.floor( durationAsMinutes / roundTo );
		
		var diff = Moment(task.startTime).add(durationAsMinutes, 'm').diff(Moment(task.startTime).hour(23).minute(59).second(0), 'm');

		if (diff > 0){
			durationAsMinutes = durationAsMinutes - diff;
		}
		
		return durationAsMinutes;
	}

}

chrome.storage.sync.get({
    saveToGenome: 'all',
    saveType: 'Actual',
    startHour: 9,
    startMin: 0,
    recentTasks: 1
  }, function(items) {
   if(items.saveType === 'Sequenced')
   		isSequenced = true;
   	else
   		isSequenced = false;
   	sequenceHour = items.startHour;
   	sequenceMin = items.startMin;
   	recentTaskWeeks = items.recentTasks;
   	saveToGenome = items.saveToGenome;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({  	
    saveToGenome: 'all',
    saveType: 'Actual',
    startHour: 9,
    startMin: 0,
    recentTasks: 1
  }, function(items) {
    if(items.saveType === 'Sequenced')
   		isSequenced = true;
   	else
   		isSequenced = false;
   	sequenceHour = items.startHour;
   	sequenceMin = items.startMin;
   	recentTaskWeeks = items.recentTasks;
   	saveToGenome = items.saveToGenome;
  });
});

module.exports = GenomeAPI;


// ## NOTE
// https://genome.klick.com/api/TimeEntry
// {
// 	Date: "2015-03-20T11:00:00-04:00",
// 	Duration: 60,
// 	IsLateBooking: false,
// 	Note: "This is a simple Note",
// 	ScheduleNoteID: "",
// 	Type: "Schedule-Note",
// 	UserID: 5164,
// 	userFriendlyDuration: "1:00"
// }


// ## TICKET 
// https://genome.klick.com/api/TimeEntry
// {
// 	Date: "2015-03-20T10:00:00-04:00"
// 	Duration: 60
// 	IsClientBillable: true
// 	Note: "This is the description of the ticket"
// 	ProjectID: 10424
// 	TicketID: 804689
// 	Type: "Project"
// 	UserID: 5164
// 	userFriendlyDuration: "1:00"
// }


