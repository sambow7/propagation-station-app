const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoConnect = require('connect-mongo');

const authController = require('./controllers/auth.js');
const plantsController = require('./controllers/plant.js');
const usersController = require('./controllers/users.js');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const port = process.env.PORT ? process.env.PORT : '3000';
const path = require('path');

require('./configs/database.js');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoConnect.create({
      mongoUrl: process.env.MONGODB_URI,
  }),
  cookie: { secure: process.env.NODE_ENV === 'production' , httpOnly: true},
}));


app.set('view engine', 'ejs');

app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users', usersController);
app.use('/users/:userId/plants', plantsController);

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/plants`);
  } else {
    res.redirect('index.ejs');
  }
  
});

//Routes



app.listen(port, () => {
  console.log(`🎧 PORT: ${port}!`);
});
