const uid = () => {
  return Math.random()
    .toString(16)
    .substr(2, 8);
};

const simulateData = numSensors => {
  let sensorData = [];
  let time = new Date().getTime();
  for (var i = 0; i < numSensors; i++) {
    sensorData.push(Math.abs(100 * Math.sin(i * 0.2 + time)));
  }
  return sensorData;
};
