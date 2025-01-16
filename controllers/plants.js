const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// Index
router.get('/:userId', async (req, res) => {
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

// New
router.get('/new', (req, res) => {
  try {
    res.render('plants/new');
  } catch (error) {
    console.error('Error loading new plant form: ', error);
    res.status(500).send('Error loading new plant form');
  }
});

// Create
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

// delete
router.delete('/:itemId', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { itemId } = req.params;
    const user = await User.findById(userId);
    const plantItemIndex = user.cabinet.findIndex(plant => plant._id.toString() === itemId);
    user.cabinet.splice(plantItemIndex, 1);
    await user.save();
    res.redirect(`/users/${userId}/plants`);
  } catch (error) {
    console.error('Error deleting plant: ', error);
    res.redirect('/');
  }
});

// show
router.get('/:itemId', async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { itemId } = req.params;
    const user = await User.findById(userId);
    console.log(plantItem)
    res.render('plants/show.ejs', { plantItem, user })
  } catch (error) {
    console.error('Error loading plant: ', error);
    res.status(500).send('Error loading plant');
  }
});

// 


module.exports = router;