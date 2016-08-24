var GenomeAPI = require('./GenomeAPI.js');

var analytics = {
	init: function(){
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
				
		ga('set', 'checkProtocolTask', function(){});
		return ga;
	},
	send: function(cat, act, lab){
		lab = lab || "";
		GenomeAPI.getUser().then(function(data){
			window.ga('send', 'event', cat, act, data.UserID);
			//console.log("Event: " + cat + " " + act + " " + lab +  " " + data.UserID);
		});
	}
}

module.exports = analytics;