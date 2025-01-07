const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  viewController.setLoggedIn,
  viewController.getOverview,
);
router.get('/tour/:slug', viewController.setLoggedIn, viewController.getTour);
router.get('/login', viewController.setLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);
module.exports = router;
