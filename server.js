require('dotenv').config();
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoConnect = require('connect-mongo');
const path = require('path');
const flash = require('connect-flash');
const multer = require('multer');
const upload = multer();


require('./configs/database');

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session Middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoConnect.create({
      mongoUrl: process.env.MONGODB_URI
  }),
  cookie: { secure: process.env.NODE_ENV === 'Production', httpOnly: true }
}));
app.use(flash());

// Make `user` session data available in all views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
app.use((req, res, next) => {
  console.log('Request Content-Type:', req.headers['content-type']);
  console.log('Request Body:', req.body);
  next();
});

// app.use((req, res, next) => {
//   res.locals.user = req.session.user || null;
//   next();
// });

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Static Files Middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use(upload.none());

// Routes
app.use('/', require('./routes/seed'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/home'));
app.use('/', require('./routes/plant'));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`🎧 http://localhost:${process.env.PORT}`);
});