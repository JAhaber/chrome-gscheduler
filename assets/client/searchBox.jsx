
var React = require('react');
var $ = require('jquery');
window.jQuery = $;
require('typeahead.js');


var ENTER_KEY = 13;
var apiEndpoint = 'https://genome.klick.com/api/Project.json?ForAutoCompleter=true&Keyword=%QUERY&Enabled=true&GroupResults=false&numRecords=10';
//var apiEndpoint = 'http://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=470fd2ec8853e25d2f8d86f685d2270e';


// Instantiate the Bloodhound suggestion engine
var projects = new Bloodhound({
    datumTokenizer: function (datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
        url: apiEndpoint,
        filter: function (projects) {

        	console.log(projects);

            // Map the remote source JSON array to a JavaScript object array
            return $.map(projects.Entries, function (project) {
                return {
                    value: project.Name
                };
            });
        }
    }
});

var SearchBox = React.createClass({
	componentDidMount: function(){

		// Initialize the Bloodhound suggestion engine
		projects.initialize();

		var element = this.getDOMNode();

		// Instantiate the Typeahead UI
		$('.typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
		  name: 'states',
		  displayKey: 'value',
		  source: projects.ttAdapter()
		});
	},
	
	componentWillUnmount: function(){
		var element = this.getDOMNode();
		$(element).typeahead('destroy');
	},

	handleNewTaskKeyDown: function(event) {
		if (event.which !== ENTER_KEY) {
		  return;
		}
		event.preventDefault();

		var val = this.refs.newField.getDOMNode().value.trim();

		if (val) {
		  //this.addTask(val);
		  this.refs.newField.getDOMNode().value = '';
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
			autoFocus={true}
			onKeyDown={this.handleNewTaskKeyDown}
			/>
		);
	}
});

module.exports = SearchBox;
