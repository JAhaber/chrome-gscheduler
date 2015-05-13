
var React = require('react');
var $ = require('jquery');
window.jQuery = $;
require('typeahead.js');

var selected = false;
var ENTER_KEY = 13;
var TAB_KEY = 9;
var apiEndpoint = 'https://genome.klick.com/api/Ticket.json?Enabled=true&ForAutocompleter=false&Keyword=%QUERY&NumRecords=100';

// Instantiate the Bloodhound suggestion engine
var tickets = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.titleAndID);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: apiEndpoint,
      rateLimitBy: 'throttle',
      rateLimitWait: 300,
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
						categoryID: null
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
						categoryID: ticket.TimeSheetCategoryID
			    };
				});
			}
    }

    
});

var SearchBox = React.createClass({
	componentDidMount: function(){

		// Initialize the Bloodhound suggestion engine
		tickets.initialize();

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
		  displayKey: 'titleAndID',
		  source: tickets.ttAdapter(),
		}).focus();
		$element.on('typeahead:opened', function(e, task){
			selected=false;
		});
		$element.on('typeahead:selected', function(e, task){
			var el = $(e.target);
			self.props.onSelect({
				title: task.title,
				ticketID: task.ticketID,
				projectID: task.projectID,
				isClientBillable: task.isClientBillable,
				type: task.type,
				categoryID: task.category || null
			});
			selected = true;
			$("#new-note").focus();
		});
		$element.on('typeahead:autocompleted', function(e, task){
			var el = $(e.target);
			self.props.onSelect({
				title: task.title,
				ticketID: task.ticketID,
				projectID: task.projectID,
				isClientBillable: task.isClientBillable,
				type: task.type,
				categoryID: task.category || null
			});
			selected = true;
			$("#new-note").focus();
		});
		
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
				selected = false;
			  	$("#new-note").focus();
			}
		}
		if (event.which === TAB_KEY){
			if (title && !selected) {
	   			this.props.onCreate(title, event);
			}
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
