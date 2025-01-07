const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting Down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// console.log('Environment: ', process.env.NODE_ENV);
const mongoose = require('./node_modules/mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const dbConnect = async function () {
  await mongoose.connect(DB);
  console.log('Connection to the Database Successful!');
};

dbConnect().catch((err) => console.error(err.message));

// console.log(process.env); // Complete List of environment variables
// console.log(app.get('env')); // Returns NODE_ENV value if defined, 'development' if undefined.

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE REJECTION! Shutting Down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
