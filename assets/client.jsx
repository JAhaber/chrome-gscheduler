
var React = require('react');
var GSchedulerApp = require('./client/gschedulerApp.jsx');
var TaskModel = require('./client/taskModel.js');
var model = new TaskModel('gscheduler-tasks'); 

function render() {
  React.render(
    <GSchedulerApp model={model} />,
    document.getElementById('gschedulerapp')
  );
}

model.subscribe(render); 
render();