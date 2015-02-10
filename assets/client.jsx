
var GSchedulerApp = require('./client/gschedulerApp.jsx');
//var GSchedulerModel = require('./client/gschedulerModel.js');
//var model = new GSchedulerModel('gscheduler-tasks');

function render() {
  React.render(
    <GSchedulerApp />,
    document.getElementById('gschedulerapp')
  );
}

//model.subscribe(render);
render();