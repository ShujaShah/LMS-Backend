const mongoose = require('mongoose');
const colors = require('colors');

let databaseConnectionURL = `${process.env.DATABASE_CLOUD}`.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// console.log('s3 bucket val', process.env.S3_BUCKET_ACTIVE);
// if (process.env.S3_BUCKET_ACTIVE === "true") {
//   databaseConnectionURL = `${process.env.DATABASE_CLOUD_NEW}`.replace(
//     "<password>",
//     process.env.DATABASE_PASSWORD_NEW
//   );
//   console.log("This is true".bgYellow.bold, process.env.S3_BUCKET_ACTIVE);
// } else {
//   databaseConnectionURL = `${process.env.DATABASE_CLOUD_NEW}`.replace(
//     "<password>",
//     process.env.DATABASE_PASSWORD_NEW
//   );
//   console.log("This is False".bgRed.bold, process.env.S3_BUCKET_ACTIVE);
// }

mongoose
  .connect(databaseConnectionURL)
  .then(() => {
    console.log(
      'Connected to the database '.bgGreen.bold,
      databaseConnectionURL.bgBlue.bold
    );
  })
  .catch((err) => {
    console.log('Error connecting to database');
    // console.log(err);
    process.exit(1);
  });

module.exports = {
  _db: mongoose.connection,
};
