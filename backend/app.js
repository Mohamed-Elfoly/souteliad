const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const levelRouter = require('./routes/levelRoutes');
const lessonRouter = require('./routes/lessonRoutes');
const quizRouter = require('./routes/quizRoutes');
const questionRouter = require('./routes/questionRoutes');
const quizAttemptRouter = require('./routes/quizAttemptRoutes');
const lessonProgressRouter = require('./routes/lessonProgressRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
const reportRouter = require('./routes/reportRoutes');
const progressReportRouter = require('./routes/studentProgressReportRoutes');
const notificationRouter = require('./routes/notificationRoutes');
const aiPracticeRouter = require('./routes/aiPracticeRoutes');
const statsRouter = require('./routes/statsRoutes');
const supportTicketRouter = require('./routes/supportTicketRoutes');
const ratingRouter = require('./routes/ratingRoutes');
const chatRouter = require('./routes/chatRoutes');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Implement CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : [];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman and server-to-server calls (no origin)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: ${origin} not allowed`));
    },
    credentials: true,
  })
);
app.options('*', cors());

// Serving static files
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later',
  validate: { xForwardedForHeader: false },
});
app.use('/api', limiter);

// Body parsers, reading data from body into req.body
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression
app.use(compression());

// 2) ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/levels', levelRouter);
app.use('/api/v1/lessons', lessonRouter);
app.use('/api/v1/quizzes', quizRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/quiz-attempts', quizAttemptRouter);
app.use('/api/v1/progress', lessonProgressRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/reports', reportRouter);
app.use('/api/v1/progress-reports', progressReportRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/ai-practice', aiPracticeRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/support', supportTicketRouter);
app.use('/api/v1/ratings', ratingRouter);
app.use('/api/v1/chat', chatRouter);

// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      status: 'healthy',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// 3) UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4) GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
