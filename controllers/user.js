const User = require('../models/user');
const Plant = require('../models/plant');

async function index(req, res) {
  try {
    const users = await User.find({}, 'username'); // Fetch usernames only
    res.render('users/index', { title: 'All Users', users, user: req.session.user });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function showUserPlants(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId, 'username');
    if (!user) {
      return res.status(404).send('User not found');
    }

    const plants = await Plant.find({ createdBy: userId }).populate('createdBy', 'username');
    res.render('users/userPlants', { title: `${user.username}'s Plants`, user, plants });
  } catch (error) {
    console.error('Error fetching user plants:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { index, showUserPlants };