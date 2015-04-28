var Q = require('q');
var moment = require('moment');
var windowManager = require('./background/window_manager')(chrome);

var PADDING_TOP = 150;
var PADDING_BOTTOM = 300;
var SWITCHER_WIDTH = 455;
var click_count = 0;
var Reminder = "Never";
var Timeout = null;

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.commands.onCommand.addListener(function(command) {
  // Users can bind a key to this command in their Chrome
  // keyboard shortcuts, at the bottom of their extensions page.
  if (command == 'show-gscheduler') {
    runGScheduler();
  }
});

chrome.windows.onFocusChanged.addListener(function (windowID){
  var switcherWindowId = windowManager.getSwitcherWindowId();
  switcherWindowId.then(function(id){
    if (windowID === id){
      clearTimeout(Timeout);
      Timeout = null;
    }
    else{
      startAutoReminder();
    }
      
  });
});

chrome.windows.onRemoved.addListener(function(windowID){
  
  var switcherWindowId = windowManager.getSwitcherWindowId();
  switcherWindowId.then(function(id){
    if (windowID === id){
      windowManager.setSwitcherWindowId(null);
      startAutoReminder();
    }
  });
});

chrome.browserAction.onClicked.addListener(function(command) {
  // Triggers when the icon in the browser window is clicked
  var switcherWindowId = windowManager.getSwitcherWindowId();
  click_count = click_count + 1;

  if (click_count === 1){
    setTimeout(function(){
      if (click_count === 1){
        switcherWindowId.then(function(id){
          if (id === null)
            runGScheduler();
          else
            chrome.windows.update(id, {focused: true});
        });
      }
      click_count = 0;
    }, 500);
    
  }
  else if (click_count === 2){
    chrome.tabs.create({ url : 'https://genome.klick.com/scheduler/#/day/now/'});
  }
     
});


chrome.storage.sync.get({
    autoRemind: 'Never'
  }, function(items) {
    Remind = items.autoRemind;
  });

chrome.storage.onChanged.addListener(function(changes, namespace){
  chrome.storage.sync.get({
    autoRemind: 'Never'
  }, function(items) {
    Remind = items.autoRemind;
    clearTimeout(Timeout);
    startAutoReminder();
  });
});


var runGScheduler = function(){
    var currentWindow = windowManager.getCurrentWindow();
    var switcherWindowId = windowManager.getSwitcherWindowId();

    Q.all([currentWindow, switcherWindowId])
    .spread(function(currentWindow, switcherWindowId) {
      // Don't activate the switcher from an existing switcher window.
      if (currentWindow.id == switcherWindowId) {
        windowManager.hideSwitcher();
        return;
      };
      if (switcherWindowId === null){
        windowManager.setLastWindowId(currentWindow.id);
        var left = currentWindow.left + Math.round((currentWindow.width - SWITCHER_WIDTH) / 2);
        var top = currentWindow.top + PADDING_TOP;
        var height = Math.max(currentWindow.height - PADDING_TOP - PADDING_BOTTOM, 600);
        var width = SWITCHER_WIDTH;
        
        windowManager.showSwitcher(width, height, left, top);
      }
      else
        chrome.windows.update(switcherWindowId, {focused: true});
    });
};

var startAutoReminder = function(){
  if (!(Remind === "Never")){
    if (Timeout === null){

      Timeout = setTimeout(function(){
        var switcherWindowId = windowManager.getSwitcherWindowId();
        switcherWindowId.then(function(id){
          if (id === null)
            runGScheduler();
          else
            chrome.windows.update(id, {focused: true});
          Timeout = null;
        });
       
      }, 1000*60*Remind);
    }
  }
};
// chrome.browserAction.setBadgeText({text:data.unreadItems});


