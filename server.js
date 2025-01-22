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
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});
app.use((req, res, next) => {
  console.log('Request Content-Type:', req.headers['content-type']);
  console.log('Request Body:', req.body);
  next();
});

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(upload.none());

// Routes
app.use('/', require('./routes/seed'));
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/home'));
app.use('/', require('./routes/plant'));

app.listen(process.env.PORT, () => {
  console.log(`🎧 http://localhost:${process.env.PORT}`);
});