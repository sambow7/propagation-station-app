const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req, res) => {
  try {
    const userId = req.session.user._id
    const user = await User.findById(userId).select('cabinet');
    console.log(user, 'user');
    res.render('plants/index.ejs', { cabinet: user.cabinet, id: userId });
  } catch (error) {
    console.error('Error loading cabinet: ', error);
    res.status(500).send('Error loading cabinet');
  }

});

router.get('/new', (req, res) => {
  try {
    res.render('plants/new');
  } catch (error) {
    console.error('Error loading new plant form: ', error);
    res.status(500).send('Error loading new plant form');
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    user.cabinet.push(req.body);
    await user.save();
    res.redirect(`/users/${userId}/plants`);
  } catch (error) {
    console.error('Error adding plant: ', error);
    res.status(500).send('Error adding plant');
  }
});


module.exports = router;