var $ = require('jquery');
var GenomeAPI = require('./client/GenomeAPI.js');

var GButton = "";
var imgURL = chrome.extension.getURL("images/icon-19.png");
var ticketID;
var title;
var projectID;
var showButton = true;
var style = "left:" + ($(window).width()/2 - 75) + "px;";

function addGButton(){
	if (showButton === true){

		ticketID = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
		
		GenomeAPI.getProjectInfo(ticketID).then(function(ticketData){
		
	        	GButton = "<div id='gButton' style='"+ style + "'>" +
	        	"<img src='" + imgURL + "'>"+
	        	" Track in GScheduler</div>";

	        	$("body").append(GButton);
	        	title = ticketData.Entries[0].Title;
	        	projectID = ticketData.Entries[0].ProjectID;
	      
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

		$( window ).resize(function(){
			$("#gButton").css("left", ($(window).width()/2 - 75) + "px");
		});
	}
}

$( window ).on("hashchange", function() {
	$("#gButton").remove();
	addGButton();
});

chrome.storage.sync.get({
    genomeTask: true
  }, function(items) {
    showButton = items.genomeTask;
    addGButton();
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
     genomeTask: true
  }, function(items) {
    showButton = items.genomeTask;
  });
});



