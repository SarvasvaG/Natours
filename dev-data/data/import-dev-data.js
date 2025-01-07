const dotenv = require('dotenv');
const fs = require('fs');
const Review = require('../../models/reviewModel');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });
const mongoose = require('../../node_modules/mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

const dbConnect = async function () {
  await mongoose.connect(DB);
  console.log('Connection to the Database Successful!');
};

dbConnect().catch((err) => console.error(err.message));

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
  try {
    await Review.create(reviews);
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    console.log('Data successfully loaded!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Review.deleteMany();
    await Tour.deleteMany();
    await User.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();
