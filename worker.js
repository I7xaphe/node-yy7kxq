const { parentPort, isMainThread } = require('worker_threads');
const { MEAS_INTERVAL } = require('./constans')

if (!isMainThread) {
  setInterval(() => {
    // Update the data with random temperatures for each sensor
    let data = {
      '28-0000097807f2': 75.4,
      '28-01205fb628b9': 65.2,
      '28-000009797137': 76.1,
      '28-000009798d37': 65.8,
    };

    for (const key in data) {
      data[key] = Math.floor(Math.random() * 50) + 10;
    }
    parentPort.postMessage(JSON.stringify(data));

  }, MEAS_INTERVAL);
}