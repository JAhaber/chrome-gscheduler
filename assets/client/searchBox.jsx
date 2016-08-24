var Analytics = require('./analytics.js');
var React = require('react');
var $ = require('jquery');
window.jQuery = $;
require('typeahead.js');

var selected = false;
var ENTER_KEY = 13;
var TAB_KEY = 9;
var multi = [];
var apiEndpoint = 'https://genome.klick.com/api/Ticket.json?Enabled=true&ForAutocompleter=false&Keyword=%QUERY&NumRecords=10';

// Instantiate the Bloodhound suggestion engine
var tickets = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.titleAndID);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    limit: 7,
    remote: {
      url: apiEndpoint,
      rateLimitBy: 'throttle',
      rateLimitWait: 0,
      filter: function (tickets) {
				// Map the remote source JSON array to a JavaScript object array
				return $.map(tickets.Entries, function (ticket) {
			    return {
						title: ticket.Title,
						titleAndID: ticket.TicketID +" - "+ ticket.Title,
						ticketID: ticket.TicketID,
						projectID: ticket.ProjectID,
						isClientBillable: ticket.IsClientBillable,
						type: ticket.Type,
						categoryID: null,
						projectName: ticket.ProjectName,
						Multibill: null
			    };
				});
			}
    },
    prefetch:{
    	url: "https://genome.klick.com/api/TimeSheetCategory.json?Enabled=true",
    	filter: function (tickets) {
				// Map the remote source JSON array to a JavaScript object array
				return $.map(tickets.Entries, function (ticket) {
				    return {
							title: ticket.Name,
							titleAndID: "Non-Project - "+ ticket.Name,
							ticketID: null,
							projectID: null,
							isClientBillable: false,
							type: "Non-Project",
							categoryID: ticket.TimeSheetCategoryID,
							projectName: null,
							Multibill: null
				    };
				});
			}
    }

    
});

var MultibillList = function() {
	return function findMatches(q, cb) {
	    var matches, substringRegex;

	    // an array that will be populated with substring matches
	    matches = [];

	    // regex used to determine if a string contains the substring `q`
	    substrRegex = new RegExp(q, 'i');

	    // iterate through the pool of strings and for any string that
	    // contains the substring `q`, add it to the `matches` array
	    $.each(multi, function(i, str) {
	      if (substrRegex.test(str.title)) {
	        matches.push({
				title: str.title,
				titleAndID: "Multi-bill - "+ str.title,
				ticketID: null,
				projectID: null,
				isClientBillable: false,
				type: "Multi-bill",
				categoryID: null,
				projectName: null,
				Multibill: "" + str.id
		    });
	      }
	    });

	    cb(matches);
	  };

};


var SearchBox = React.createClass({
	componentDidMount: function(){

		// Initialize the Bloodhound suggestion engine
		tickets.initialize();
		multi = this.props.Multibill;
		var self = this;
		var $element = $(this.getDOMNode());
		// Instantiate the Typeahead UI
		$('.typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 2
		},
		{
		  name: 'tickets',
		  display: 'titleAndID',
		  source: MultibillList(),
		  templates:{
		  	suggestion: function(data){
		  		var displayID = "Multi-bill";
		  		var displayProj = "";
		  		var projClass = "non-project-row";
		  			
      			return '<div class="dd-list-item multi-bill"><div class="id-box">'
	      					+ displayID
	      					+ '</div><div class="task-box"><div class="task-row" title="Task: '+data.title+'">'
		      					+ data.title
		      				+ '</div><div class='+ projClass + ' title="Project: '+displayProj+'">'
		      					+ displayProj
		      				+ '</div></div></div>';
		  	}
		  },
		},
		{
		  name: 'tickets',
		  display: 'titleAndID',
		  source: tickets.ttAdapter(),
		  templates:{
		  	suggestion: function(data){
		  		var displayID = null;
		  		var displayProj = null;
		  		var projClass = null;

		  		if (data.ticketID)
		  			displayID = data.ticketID;
		  		else
		  			displayID = "Non-Project";

		  		if (data.projectName){
		  			displayProj = data.projectName;
		  			projClass = "project-row";
		  		}
		  		else{
		  			displayProj = "";
		  			projClass = "non-project-row";
		  		}
		  			
      			return '<div class="dd-list-item"><div class="id-box">'
	      					+ displayID
	      					+ '</div><div class="task-box"><div class="task-row" title="Task: '+data.title+'">'
		      					+ data.title
		      				+ '</div><div class='+ projClass + ' title="Project: '+displayProj+'">'
		      					+ displayProj
		      				+ '</div></div></div>';
		  	}
		  }
		}).focus();
		// $element.on('typeahead:opened', function(e, task){
		// 	selected=false;
		// });
		$element.on('typeahead:selected typeahead:autocompleted', function(e, task){
			var el = $(e.target);
			if ($("#new-note").css("display") === "none"){
				self.props.addTask({
					title: task.title,
					ticketID: task.ticketID,
					projectID: task.projectID,
					isClientBillable: task.isClientBillable,
					type: task.type,
					categoryID: task.categoryID,
					Multibill: task.Multibill

				});
				Analytics.send("Tasks", "Start", "Search");
				selected = true;
			}
			else{
				self.props.onSelect({
					title: task.title,
					ticketID: task.ticketID,
					projectID: task.projectID,
					isClientBillable: task.isClientBillable,
					type: task.type,
					categoryID: task.categoryID,
					Multibill: task.Multibill
				});
				selected = true;
				$("#new-note").focus();
			}
		});
	},
	componentDidUpdate: function(){
		multi = this.props.Multibill;
	},
	componentWillUnmount: function(){
		var $element = $(this.getDOMNode());
		$element.typeahead('destroy');
	},

	handleNewTaskKeyDown: function(event) {
		var $element = $(this.refs.newField.getDOMNode());
		var title = $element.typeahead('val').trim();
		if (event.which === ENTER_KEY) {
		  	if (title && !selected) {
	   			this.props.onCreate(title, event);
			}
			else{
			  	$("#new-note").focus();
			}
		}
		else if (event.which === TAB_KEY){
			if (title && !selected) {
	   			this.props.onCreate(title, event);
			}
		}
		else{
			selected = false;
		}
		
	},

	render: function(){
		return (
			<input 
			id={this.props.id}
			type="search" 
			name={this.props.name} 
      		ref="newField"
			className="form-control typeahead structuremap-search" 
			placeholder={this.props.placeholder}
			onKeyDown={this.handleNewTaskKeyDown}
			/>
		);
	}
});

module.exports = SearchBox;
