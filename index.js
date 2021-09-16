const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000

app.use('/', express.static(__dirname + '/dist/'));

app.get('/', function(req, res) {
    fs.readFile('./dist/index.html', function(error, content) {
      if (error) {
          res.writeHead(500);
          res.end();
      }
      else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
      }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})