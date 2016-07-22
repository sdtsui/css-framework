const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

const destination = './app/project1/scss/settings/user.scss';

app.get('/', (req, res) => {
  return res.send('Hello World');
});

// Get the request that sets the variables
app.post('/compile', (req, res) => {
  console.log(req);
  const newData = req.body;

  // create an empty file
  fs.writeFile('./app/project1/scss/settings/user.scss', '', function (err) {
    if (err)return console.log(err);
  });

  // appends the new data to the file
  const compileVariables = (sassFile) => {
    Object.keys(sassFile).map(variable => {
      const content = `${variable}: ${sassFile[variable]};\n`;

      fs.appendFile(destination, content, (err) => {
        if (err)return console.log(err);
      });
    });
  };

  compileVariables(newData);
  res.send('compiled');

});

app.listen(3010, () => {
  console.log('Example app listening on port 3010!');
});
