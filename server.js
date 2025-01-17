require('dotenv').config();
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoConnect = require('connect-mongo');
const path = require('path');

require('./configs/database');

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoConnect.create({
      mongoUrl: process.env.MONGODB_URI
  }),
  cookie: { secure: process.env.NODE_ENV === 'Production', httpOnly: true }
}));

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));


// Seed Route
app.use('/', require('./routes/seed'));

// Auth Route
app.use('/', require('./routes/auth'));

// Home Route
app.use('/', require('./routes/home'));

// Plant Route
app.use('/', require('./routes/plant'));


app.listen(process.env.PORT, () => {
  console.log(`🎧 http://localhost:${process.env.PORT}`);
});
