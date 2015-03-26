
var React = require('react');
var $ = require('jquery');
window.jQuery = $;
require('typeahead.js');


var ENTER_KEY = 13;
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
						type: ticket.Type
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
		  minLength: 3
		},
		{
		  name: 'tickets',
		  displayKey: 'titleAndID',
		  source: tickets.ttAdapter(),
		}).focus();

		$element.on('typeahead:selected', function(e, task){
			var el = $(e.target);
			self.props.onSelect({
				title: task.title,
				ticketID: task.ticketID,
				projectID: task.projectID,
				isClientBillable: task.isClientBillable,
				type: task.type
			});
			el.typeahead('val', '');
		});
	},
	
	componentWillUnmount: function(){
		var $element = $(this.getDOMNode());
		$element.typeahead('destroy');
	},

	handleNewTaskKeyDown: function(event) {
		if (event.which !== ENTER_KEY) {
		  return;
		}
		event.preventDefault();

		var $element = $(this.refs.newField.getDOMNode());
		var title = $element.typeahead('val').trim();

		if (title) {
		  this.props.onCreate(title);
		  $element.typeahead('val', '');
		}
	},

	render: function(){
		return (
			<input 
			id="new-task"
			type="search" 
			name="search" 
      ref="newField"
			className="form-control typeahead structuremap-search" 
			placeholder="Task Name/ID"
			onKeyDown={this.handleNewTaskKeyDown}
			/>
		);
	}
});

module.exports = SearchBox;
