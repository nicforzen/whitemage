const express = require('express');
const app = express();
const fs = require('fs');
const port = 3000

app.use('/', express.static(__dirname + '/dist/'));

app.listen(port, () => {
  console.log(`WHM App listening at http://localhost:${port}`)
})