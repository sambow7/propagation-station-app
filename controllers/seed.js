const Plant = require('../models/plant');
const plants = require('../data/plants');

async function seedData(req, res) {
  try {
    await Plant.insertMany(plants);
    res.status(200).send('Plant seeded successfully')
  } catch (error) {
    console.error(error, message);
  }
}

module.exports = { seedData };