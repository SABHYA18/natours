const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...'); // in uncaught exception, we need to crash the application
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successfull !'));

const port = process.env.PORT || 3000;
// const port = 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...'); // in unhandled rejection, it's not necessary to crash the application
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
  //process.exit(1); // very abdrupt, not recommended, use in server.close
});
