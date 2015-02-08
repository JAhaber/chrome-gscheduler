
function Stopwatch(autostart) {
    if (autostart) this.start();
}

Stopwatch.prototype.start = function() {
    this.startTime = Date.now();
};

Stopwatch.prototype.stop = function() {
    this.stopTime = Date.now();
    return this.read();
};

Stopwatch.prototype.read = function() {
    var self = this;
    var startTime = self.startTime;
    var nowTime;
    var delta;

    if (startTime) {
        if (self.stopTime) {
            nowTime = self.stopTime;
        } else {
            nowTime = Date.now();
        }

        delta = calculateDelta(startTime, nowTime);
    } else {
        nowTime = undefined;
        delta = NaN;
    }

    return delta;

    function calculateDelta(start, end) {
        return end - start;
    }
};

module.exports = Stopwatch;