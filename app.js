const express = require('express');
const fs = require('fs');
const app = express();

// The http method for the request
/*
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from the server side!',
    app: 'Natours',
  });
});

app.post('/', (req, res) => {
  res.send('You can get the post request on this endpoint');
});
*/

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// the callback function in this crud operation is called a route handler
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
}); //v->specifies the version of the api

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
