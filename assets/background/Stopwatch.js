
function Stopwatch(autostart) {
  if (autostart) this.start();
}

Stopwatch.prototype.start = function() {
  this.startTime = Date.now();
};

Stopwatch.prototype.stop = function() {
  this.stopTime = Date.now();
  return this.elapsedMilliseconds();
};

Stopwatch.prototype.elapsedMilliseconds = function() {
  if(!this.startTime) return 0;
  return new Date().valueOf() - this.startTime.valueOf();
};

module.exports = Stopwatch;