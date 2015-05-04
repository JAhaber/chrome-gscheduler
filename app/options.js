
// Saves options to chrome.storage.sync.
function save_options() {
  var type = document.querySelector('input[name="type"]:checked').value;
  var remind = document.getElementById('autoReminder').value;
  var round = document.getElementById('roundTime').value;

  chrome.storage.sync.set({
    saveType: type,
    autoRemind: remind,
    roundTime: round
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    saveType: 'Sequenced',
    autoRemind: 'Never',
    roundTime: '15'
  }, function(items) {
    var radioType = document.getElementsByName('type');
    for (i = 0; i < radioType.length; i++) {
        if ( radioType[i].value === items.saveType ) {
          radioType[i].checked = true;
          break;
        }
    }
    document.getElementById('autoReminder').value = items.autoRemind;
    document.getElementById('roundTime').value = items.roundTime;
    
  });
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

document.getElementById('openShortcuts').addEventListener('click', function(){
    chrome.tabs.create({url:'chrome://extensions/configureCommands'});      
});
