const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const userId = req.session.user._id
    const user = await User.findById(userId).populate('cabinet');
    console.log(user, 'user');
    res.render('foods/index.js', { cabinet: user.cabinet, id: userId });
  } catch (error) {
    console.error('Error loading cabinet: ', error);
    res.status(500).send('Error loading cabinet');
}
});

