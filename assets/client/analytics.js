var analytics = {
	init: function(user){
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		
		ga('create', 'UA-82254267-1', 'auto', {
		  userId: user
		});
		ga('set', 'checkProtocolTask', function(){});
		return ga;
	},
	pageview: function(page){
		window.ga('send', 'pageview', page);
		console.log("Pageview: " + page);
	},
	send: function(cat, act, lab){
		window.ga('send', 'event', cat, act, lab);
		console.log("Event: " + cat + " " + act + " " + lab);
	}
}

module.exports = analytics;