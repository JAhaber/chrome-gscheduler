var $ = require('jquery');
var GenomeAPI = require('./client/GenomeAPI.js');

var GButton = "";
var imgURL = chrome.extension.getURL("images/icon-19.png");
var ticketID;
var title;
var projectID;
var style="position:fixed;bottom:0;left:"+
	($(window).width()/2 - 75) + "px;color:#fff;background-color:#2585b0;width:150px;text-align:center;padding:5px;cursor:pointer;border-radius: 10px 10px 0 0;";

function addGButton(){
	ticketID = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
	GenomeAPI.getProjectInfo(ticketID).then(function(ticketData){
		
	        if (!(ticketData.Entries[0].TicketStatusName === "closed"))
	        { 
	        	GButton = "<div id='gButton' style='"+ style + "'>" +
	        	"<img src='" + imgURL + "'>"+
	        	" Track in GScheduler</div>";

	        	$("body").append(GButton);
	        	title = ticketData.Entries[0].Title;
	        	projectID = ticketData.Entries[0].ProjectID;
	        }
	        else
	        	console.log(ticketData.Entries[0].TicketStatusName);
	      }).fail(function(error){
	        console.log(error);
	      });


	$("body").on("click", "#gButton", function(){
		
		chrome.runtime.sendMessage({
			newTask: {
				ticketID: ticketID,
				title: title,
				projectID: projectID,
				categoryID: null
			}
		}, function(response) {});
	});
}

$( window ).on("hashchange", function() {
	$("#gButton").remove();
	addGButton();
});

addGButton();



