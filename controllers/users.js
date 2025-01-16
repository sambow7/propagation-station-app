const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('users/index', { users: users });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading users");
  }
});

router.get('/:userId', async (req, res) => {
  const userId = req.params.id;
  if (userId === req.session.user._id) {
    res.redirect('/users/' + userId + '/plants');
  }
  try {
    const user = await User.findById(userId);
    const plants = user.cabinet;
    const username = user.username;
    const _id = req.session.user._id;
    res.render('users/show.ejs', { user: { username, plants, _id } });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});


module.exports = router;