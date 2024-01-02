const http = require('http');
var fs = require('fs');
var qs = require('querystring');
const json2csv = require('json2csv');

let data = {
  '28-0000097807f2': 75.4,
  '28-01205fb628b9': 65.2,
  '28-000009797137': 76.1,
  '28-000009798d37': 65.8,
};

let dataMap = new Array();
const time = { "time": new Date().toLocaleString() };
const merged = { ...time, ...data };
dataMap.push(merged);

var intevalMs = 5000;
var logHour = 5;
var logSize = 3;

function reloadLogSize() {
  logSize = (logHour * 60 * 60 * 1000) / intevalMs;
}

reloadLogSize();

setInterval(() => {
  // Update the data with random temperatures for each sensor
  for (const key in data) {
    data[key] = Math.floor(Math.random() * 50) + 10;
  }
  //process.stdout.write('\u0007');

  const time = { "time": new Date().toLocaleString() };
  const merged = { ...time, ...data };

  dataMap.push(merged);
  while (dataMap.length > logSize) {
    dataMap.shift();
  }

}, intevalMs);

function isNumeric(num){
  return !isNaN(num)
}

fs.readFile('./index.html', function (err, html) {
  if (err) throw err;

  const server = http.createServer(function (req, res) {

    if (req.url === '/') {
      res.writeHeader(200, { 'Content-Type': 'text/html' });
      res.write(html);
      res.end();
    } else if (req.url === '/data') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(data));
      res.end();
    } else if (req.url === '/logtime') {
      if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
          body += data;
          if (body.length > 1e6) {
            req.connection.destroy();
          }
        });

        req.on('end', function () {
          var post = qs.parse(body);

          if (isNumeric(post.logtime))
          {
            if (post.logtime > 0) {
              logHour = post.logtime;
            } else {
              logHour = 1;
            }
          } else {
            logHour = 1;
          }

          reloadLogSize();
          res.writeHeader(200, { 'Content-Type': 'text/plain' });
          res.write(logHour.toString());
          res.end();
        });
      }
    } else if (req.url === '/downloadCsv') {
      const csvData = json2csv.parse(dataMap);
      res.writeHeader(200, { 'Content-Type': 'text/csv' });
      res.write(csvData);
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
      res.end();
    }
  });

  server.listen(80, () => {
    console.log('Server started on port 80');
  });
});

