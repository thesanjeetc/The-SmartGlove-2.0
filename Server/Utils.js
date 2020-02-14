class Stream {
  constructor(callback, interval) {
    this.callback = callback;
    this.interval = interval;
    this.time;
    this.stream;
  }

  start() {
    this.stop();
    this.stream = setInterval(() => {
      this.time += this.interval;
      this.callback(this.time);
    }, this.interval);
  }

  stop() {
    this.time = 0;
    clearInterval(this.stream);
  }
}

class Timer extends Stream {
  constructor(callback) {
    super(time => {
      let currTime = this.format(time / 1000);
      callback(currTime);
    }, 1000);
  }

  format(time) {
    let seconds = time % 60;
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor(Math.floor(time / 60) % 60);
    let ss = (seconds < 10 ? "0" : "") + seconds;
    let mm = (minutes < 10 ? "0" : "") + minutes;
    return mm + ":" + ss;
  }
}

const uid = () => {
  return Math.random()
    .toString(16)
    .substr(2, 8);
};

module.exports = {
  Stream,
  Timer
};
