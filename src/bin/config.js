const mongoose = require('mongoose');
const app = require('../index');
const http = require('http');

require('dotenv').config();

let mongo_url = process.env.MONGO_URL;
mongoose
  .connect(mongo_url)
  .then(() => {
    console.log('Connected to Database...');
  })
  .catch((err) => {
    console.log('Error connecting to the Database', err);
  });

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Connected to port ${port}`);
});

module.exports = { dbConn: mongoose.connection, server };
