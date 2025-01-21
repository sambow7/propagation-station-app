const bcrypt = require('bcrypt');
const User = require('../models/user');

function signUp(req, res) {
  res.render('auth/sign-up.ejs');
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/sign-in');
  }
  next();
}

async function signUpPost(req, res) {
  try {
    const { username, password, confirmPassword } = req.body;
    if (!username || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userInDatabase = await User.findOne({ username });
    if (userInDatabase) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword }
    await User.create(newUser);
    res.status(200).redirect('/');
  } catch (error) {
    console.error('Error during sign-up', error);
    res.status(500).json({ message: 'Internal Server Error during sign-up' });
  }
}

function signIn(req, res) {
  res.render('auth/sign-in.ejs');
};

async function signInPost(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const userInDatabase = await User.findOne({ username });
    if (!userInDatabase) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, userInDatabase.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    req.session.user = {
      id: userInDatabase._id,
      username: userInDatabase.username
    }
    res.status(200).redirect('/');
  } catch (error) {
    console.error('Error during sign-in', error);
    res.status(500).json({ message: 'Internal Server Error during sign-in' });
  }
};

function signout(req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error during sign-out', error);
      return res.status(500).json({ message: 'Internal Server Error during sign-out' });
    }
    res.redirect('/');
  })
}

module.exports = { signUp, signUpPost, signIn, signInPost, signout, requireAuth };
