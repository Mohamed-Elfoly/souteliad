const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // errmsg exists in older Mongoose versions; keyValue works in newer ones
  let value = '';
  if (err.keyValue) {
    value = Object.values(err.keyValue)[0];
  } else if (err.errmsg) {
    const m = err.errmsg.match(/(["'])(\\?.)*?\1/);
    value = m ? m[0] : '';
  }
  const message = `القيمة "${value}" مستخدمة بالفعل. من فضلك استخدم قيمة أخرى.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error('ERROR', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Transform known DB/JWT errors into friendly AppErrors in all environments
  let handledErr = err;
  if (err.name === 'CastError') handledErr = handleCastErrorDB(err);
  else if (err.code === 11000) handledErr = handleDuplicateFieldsDB(err);
  else if (err.name === 'ValidationError') handledErr = handleValidationErrorDB(err);
  else if (err.name === 'JsonWebTokenError') handledErr = handleJWTError();
  else if (err.name === 'TokenExpiredError') handledErr = handleJWTExpiredError();

  if (process.env.NODE_ENV !== 'production') {
    sendErrorDev(handledErr, req, res);
  } else {
    sendErrorProd(handledErr, req, res);
  }
};
