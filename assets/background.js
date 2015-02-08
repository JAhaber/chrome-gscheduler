var Q = require('q');
var Stopwatch = require('./background/stopwatch');
var windowManager = require('./background/window_manager')(chrome);

var PADDING_TOP = 150;
var PADDING_BOTTOM = 300;
var SWITCHER_WIDTH = 315;

var timers = [];


chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
  console.log('StartingTimers', timers);
});

chrome.commands.onCommand.addListener(function(command) {
  // Users can bind a key to this command in their Chrome
  // keyboard shortcuts, at the bottom of their extensions page.
  if (command == 'show-gscheduler') {

    var currentWindow = windowManager.getCurrentWindow();
    var switcherWindowId = windowManager.getSwitcherWindowId();

    Q.all([currentWindow, switcherWindowId])
    .spread(function(currentWindow, switcherWindowId) {
      // Don't activate the switcher from an existing switcher window.
      if (currentWindow.id == switcherWindowId) return;

      // When the user activates the switcher and doesn't have "search
      // in all windows" enabled, we need to know which was the last
      // non-switcher window that was active.
      windowManager.setLastWindowId(currentWindow.id);
      var left = currentWindow.left + Math.round((currentWindow.width - SWITCHER_WIDTH) / 2);
      var top = currentWindow.top + PADDING_TOP;
      var height = Math.max(currentWindow.height - PADDING_TOP - PADDING_BOTTOM, 600);
      var width = SWITCHER_WIDTH;
      
      windowManager.showSwitcher(width, height, left, top);
    });

  }
});

chrome.runtime.onMessage.addListener(function(request, sender, respond) {


  if (request.addTimer) {
    
    var stopwatch = new Stopwatch(true);
    timers.push(stopwatch);

    for (var i = timers.length - 1; i >= 0; i--) {
      console.log(timers[i].read());
    };

    
  }

});


