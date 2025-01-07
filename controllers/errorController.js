const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handldeDuplicateFieldDB = (err) => {
  const value = err.keyValue.name;

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid Token, please login again!', 401);

const handleJWTExpired = () =>
  new AppError('Your token has expired, please login again!', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // RENDERED ERROR
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming or other unkwown error: don't leak the details!
    // 1) Log the error to the console.
    console.error('ERROR ⚠️ ', err);

    // 2) Send a generic error message to the client.
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // RENDERED WEBSITE
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }

  //Programming or other unkwown error: don't leak the details!
  // 1) Log the error to the console.
  console.error('ERROR ⚠️ ', err);
  // 2) Send a generic error message to the client.
  res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error;
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handldeDuplicateFieldDB(err);
    if (err.name === 'ValidationError') error = handleValidationError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpired();
    error = error || err;
    sendErrorProd(error, req, res);
  }
};
