const express = require('express');
const cors = require('cors');

// const dbConn = require('./src/bin/config').dbConn;

const routes = require('./routes');

var app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'http:localhost:5173',
    optionSuccessStatus: 200,
  })
);

app.use('/api/v1', routes);

module.exports = app;
