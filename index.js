const express = require('express');
const cors = require('cors');
require('dotenv').config();
const dbConn = require('./src/bin/config').dbConn;

var app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'http:localhost:5173',
    optionSuccessStatus: 200,
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});
