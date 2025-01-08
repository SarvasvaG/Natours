const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template
  res.status(200).render('overview', {
    title: 'All Tours',
    user: req.user,
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the correct tour
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build Template
  // 3) Render the template
  res.status(200).render('tour', {
    title: tour.name,
    user: req.user,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  // 1) Send the page
  res.status(200).render('login', {
    title: 'Login into your account',
    user: req.user,
  });
});

exports.setLoggedIn = catchAsync(async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );
      // 3) Check if user still exists
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        return next();
      }
      // 4) Check if user changed password after the token was issued
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // GRANT ACCESS TO THE PROTECTED ROUTE
      req.user = freshUser;
    } catch (err) {
      return next();
    }
  }
  next();
});

exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account',
    user: req.user,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  console.log(req.user);
  const bookings = await Booking.find({ user: req.user.id });
  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  console.log(tourIDs);
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
    user: req.user,
  });
});
