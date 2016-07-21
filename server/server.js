const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.send('test');
});

app.listen(3010, () => {
  console.log('Example app listening on port 3010!');
});
