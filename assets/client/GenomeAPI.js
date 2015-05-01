
var $ = require('jquery');
var _ = require('underscore');
var Promise = require('es6-promise').Promise;
var Q = require('q');
var Moment = require('moment');
var isSequenced;

var GenomeAPI = {

	ROUND_TO: 15,
	CURRENT_USER: null,
	GENOME_ENDPOINT: 'https://genome.klick.com/api',


  request: function(url, options) {
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

	post: function(url, options) {
		options.data = options.data || {};
		options.type = 'POST';

    return GenomeAPI.request(url, options);
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
	getProjectInfo: function(ticketid) {
		var options = {};
		return GenomeAPI.get(GenomeAPI.GENOME_ENDPOINT + '/Ticket.json?Enabled=true&ForAutocompleter=false&TicketID=' + ticketid, options);
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
			IsClientBillable: task.isClientBillable || false
		};

		task.projectID ? $.extend(options.data, projectData) : false;

		return GenomeAPI.getUser()
						.then(function(user){
							options.data.UserID = user.UserID
							return GenomeAPI.post(GenomeAPI.GENOME_ENDPOINT + '/TimeEntry.json', options);
						});
	},

	postTimeEntries: function(tasks, options) {

		options = $.extend({}, options, {
			isSequenced: isSequenced
		});
		var self = this;
		var sortedList = _.sortBy(tasks, function(o){ return o.startTime; });
		var previousTaskEndTime = Moment().startOf('day').hour(9).minute(0).format();
		var promises = sortedList.map(function (task, index) {
			var deferred = Q.defer();
			var newTask = _.extend({}, task);
			var duration = self.getDuration(task, GenomeAPI.ROUND_TO);
			
			if (!(Moment(previousTaskEndTime).date() === Moment(newTask.startTime).date())){
				previousTaskEndTime = Moment(newTask.startTime).hour(9).minute(0).format();
			}
				
			newTask.startTime = options.isSequenced ? previousTaskEndTime : newTask.startTime;
			previousTaskEndTime = Moment(previousTaskEndTime).add(duration, 'minutes').format();
			newTask.stopTime = options.isSequenced ? previousTaskEndTime : newTask.stopTime;
			deferred.resolve(GenomeAPI.postTimeEntry(newTask));

			return deferred.promise;
		});

		// Run in Sequence or in an async batch
  	return options.isSequenced ? promises.reduce(Q.when) : Q.all(promises);
	},

	// Find the duration in minutes of a task and optionally roundTo in (minutes)
	getDuration: function(task, roundTo) {
		var durationAsMinutes = Moment.duration(Moment(task.stopTime).diff(Moment(task.startTime))).asMinutes();
		console.log(Moment(task.startTime).format());
		console.log(Moment(task.stopTime).format());
		if (roundTo) {
			durationAsMinutes = roundTo * Math.round( durationAsMinutes / roundTo );
			durationAsMinutes = durationAsMinutes < roundTo ? roundTo : durationAsMinutes;
		}

		return durationAsMinutes;
	}

}

chrome.storage.sync.get({
    saveType: 'Sequenced'
  }, function(items) {
   if(items.saveType === 'Sequenced')
   		isSequenced = true;
   	else
   		isSequenced = false;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
    saveType: 'Sequenced'
  }, function(items) {
    if(items.saveType === 'Sequenced')
   		isSequenced = true;
   	else
   		isSequenced = false;
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


