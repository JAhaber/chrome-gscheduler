
var React = require('react');
var OptionsApp = require('./optionsApp.jsx');

function render() {
  React.render(
    <OptionsApp />,
    document.getElementById('options-page')
  );
}
render();