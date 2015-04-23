var Q = require('q');
var util = require('../utils');

module.exports = function(chrome) {
  var switcherWindowId = Q.when(null);
  var lastWindowId = Q.when(null);

  return {
    getTabInfo: function(tabId) {
      return util.pcall(chrome.tabs.get, tabId);
    },

    getCurrentWindow: function() {
      return util.pcall(chrome.windows.getCurrent);
    },

    getSwitcherWindowId: function() {
      return switcherWindowId;
    },

    setSwitcherWindowId: function(id) {
      switcherWindowId = Q.when(id);
      return switcherWindowId;
    },

    getLastWindowId: function() {
      return lastWindowId;
    },

    setLastWindowId: function(id) {
      lastWindowId = Q.when(id);
      return lastWindowId;
    },

    showSwitcher: function(width, height, left, top) {
      var opts = {
        width: width,
        height: height,
        left: left,
        top: top,
        url: chrome.runtime.getURL('gscheduler.html'),
        focused: true,
        type: 'panel' // 'normal', 'panel', 'app'
      };
          return util.pcall(chrome.windows.create.bind(chrome.windows), opts)
            .then(function(switcherWindow) {
              this.setSwitcherWindowId(switcherWindow.id);
            }.bind(this));


      
    },

    hideSwitcher: function() {
      var switcherWindowId = this.getSwitcherWindowId();

      return switcherWindowId.then(function(id){
        return util.pcall(chrome.windows.remove(id)).bind(this);

      });;
    },

    queryTabs: function(senderTabId, searchAllWindows, recentTabs, lastWindowId) {
      var options = searchAllWindows ? {} : {windowId: lastWindowId};
      return util.pcall(chrome.tabs.query, options)
      .then(function(tabs) {
        tabs = tabs.filter(function(tab) { return tab.id != senderTabId; });
        return {
          tabs: tabs,
          lastActive: (recentTabs[lastWindowId] || [])[0] || null
        };
      });
    },

    switchToTab: function(tabId) {
      chrome.tabs.update(tabId, {active: true});
      return this.getTabInfo(tabId).then(function(tab) {
        if (tab) chrome.windows.update(tab.windowId, {focused: true});
      });
    },

    closeTab: function(tabId) {
      
      return util.pcall(chrome.tabs.remove, tabId);
    }
  };
};
