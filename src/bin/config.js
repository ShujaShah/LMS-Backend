const mongoose = require('mongoose');

let mongo_url = process.env.MONGO_URL;

mongoose
  .connect(mongo_url)
  .then(() => console.log('Connected to Database...'))
  .catch((err) => {
    console.log('Error connecting to the Database', err);
  });

module.exports = { dbConn: mongoose.connection };
