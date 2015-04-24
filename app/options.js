var isSelected = false;
var ctrlalt = false;

// Saves options to chrome.storage.sync.
function save_options() {
  var color = $('#color').value;
  alert(color);
  var likesColor = document.getElementById('like').checked;
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
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
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}

function callFocus(a){
  a.select();
  ctrlalt=false;
  isSelected = true;
}

var hotkey = document.getElementById('hotkey');
hotkey.addEventListener("keydown", function(event){
  event.preventDefault();
  if (isSelected)
  {
    isSelected = false;
    hotkey.value = "";
  }
  var key = "";
  switch(event.keyCode){
    case 17: 
      key = "Ctrl";
      break;
    case 18: 
      key = "Alt";
      break;
    case 16: 
      key = "Shift";
      break;
    case 32: 
      key = "Space";
      break;
    case 33: 
      key = "PageUp";
      break;
    case 34: 
      key = "PageDown";
      break;
    case 35: 
      key = "End";
      break;
    case 36: 
      key = "Home";
      break;
    case 37: 
      key = "Left";
      break;
    case 38: 
      key = "Up";
      break;
    case 39: 
      key = "Down";
      break;
    case 40: 
      key = "Right";
      break;
    case 45: 
      key = "Insert";
      break;
    case 46: 
      key = "Delete";
      break;
    case 188: 
      key = "Comma";
      break;
    case 190: 
      key = "Period";
      break;
    default:
      key = String.fromCharCode(event.keyCode);
  }
  
  if ((key === "Alt" || key === "Ctrl") && ctrlalt === true)
    key = "";
  else
    ctrlalt = true;

  if (!(hotkey.value === ""))
    hotkey.value = hotkey.value + "+";
  hotkey.value = hotkey.value + event.keyCode;
});


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

