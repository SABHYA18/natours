const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss= require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
// const deepSanitize = require('./utils/deepSanitize');

const app = express();

// 1)Global MIDDLEWARES
// set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit requests from the same api
const limiter = rateLimit({
  max: 100, // set wrt to the requests recieved. can be 10000000
  windowMs: 60 * 60 * 1000, 
  message: "Too many requests from this IP. Please try again in an hour"
})
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({
  limit: '10kb'
}));

// data sanitization against noSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS (cross site scripting attacks)
app.use(xss());

/*
app.use((req, res, next)=>{
  req.body = deepSanitize(req.body);
  next();
});
*/  //--> can provide extra layer of protection but the xss package can be used


// Prevent parameter pollution
app.use(hpp({
  whitelist: [
    'duration','ratingsQuantity', 'ratingsAverage', 'maxGroupSize','difficulty',
    'price'
  ]
}));

// serving static files
app.use(express.static(`${__dirname}/public`));


// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(x); --> if there is any error in the express middleware, it goes to the main error handling middleware to rectify it.
  next();
});

// 3) ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
