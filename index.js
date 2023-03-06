const http = require('http');
var fs = require('fs');

let data = {
  '28-0000097807f2': 75.4,
  '28-01205fb628b9': 65.2,
  '28-000009797137': 76.1,
  '28-000009798d37': 65.8,
};

setInterval(() => {
  // Update the data with random temperatures for each sensor
  for (const key in data) {
    data[key] = Math.floor(Math.random() * 50) + 10;
  }
}, 1000); // Every 5 seconds

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
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not Found');
      res.end();
    }
  });

  server.listen(3002, () => {
    console.log('Server started on port 3000');
  });
});
