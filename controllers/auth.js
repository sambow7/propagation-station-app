const bcrypt = require('bcrypt');
const User = require('../models/user');

function signUp(req, res) {
  res.render('auth/sign-up.ejs');
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



// router.get('/sign-in', (req, res) => {
//   res.render('auth/sign-in.ejs');
// });

// router.get('/sign-out', (req, res) => {
//   req.session.destroy();
//   res.redirect('/users');
// });

// router.post('/sign-up', async (req, res) => {
//   try {
//     const userInDatabase = await User.findOne({ username: req.body.username });
//     if (userInDatabase) {
//       return res.send('Username already taken.');
//     }
//     if (req.body.password !== req.body.confirmPassword) {
//       return res.send('Password and Confirm Password must match');
//     }
//     const hashedPassword = bcrypt.hashSync(req.body.password, 10);
//     req.body.password = hashedPassword;
//     await User.create(req.body);
//     res.redirect('/auth/sign-in');
//   } catch (error) {
//     console.log(error);
//     res.redirect('/');
//   }
// });

// router.post('/sign-in', async (req, res) => {
//   try {
//     // First, get the user from the database
//     const userInDatabase = await User.findOne({ username: req.body.username });
//     if (!userInDatabase) {
//       return res.send('Login failed. Please try again.');
//     }
//     const validPassword = bcrypt.compareSync(
//       req.body.password,
//       userInDatabase.password
//     );
//     if (!validPassword) {
//       return res.send('Login failed. Please try again.');
//     }
//     req.session.user = {
//       username: userInDatabase.username,
//       _id: userInDatabase._id
//     };
//     res.redirect('/');
//   } catch (error) {
//     console.log(error);
//     res.redirect('/');
//   }
// });

module.exports = { signUp, signUpPost, signIn, signInPost, signout };
