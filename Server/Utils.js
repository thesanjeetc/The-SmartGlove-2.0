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

const UID = () => {
  return Math.floor(Math.random() * 1000000);
};

const https = require("https");

const wakeUpDyno = () => {
  setInterval(() => {
    https.get("https://thesmartglove.herokuapp.com/").on("error", err => {
      console.log("Ping Error: " + err.message);
    });
  }, 1500000);
};

const merge = (left, right, direction) => {
  let sorted = [];
  let compare = () => (direction ? left[0] < right[0] : left[0] > right[0]);

  while (left.length > 0 && right.length > 0) {
    if (compare()) {
      sorted.push(left.shift());
    } else {
      sorted.push(right.shift());
    }
  }

  return [...sorted, ...left, ...right];
};

const mergeSort = (list, direction = true) => {
  if (list.length < 2) return list;

  let centre = Math.floor(list.length / 2);
  let left = list.slice(0, centre);
  let right = list.slice(centre);

  return merge(
    mergeSort(left, direction),
    mergeSort(right, direction),
    direction
  );
};

let l = [
  "02/17/2020 5:45 PM",
  "02/17/2020 5:39 AM",
  "02/17/2020 5:35 PM",
  "02/14/2020 7:49 PM"
];
// console.log(mergeSort(l, 1));

module.exports = {
  Stream,
  Timer,
  wakeUpDyno,
  mergeSort,
  UID
};
