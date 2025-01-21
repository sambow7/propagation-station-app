//<!--routes/plant.js-->\

const router = require('express').Router();
const userCtrl = require('../controllers/user');
const plantCtrl = require('../controllers/plant');

// List all users
router.get('/users', userCtrl.index);

// View a specific user's plant list
router.get('/users/:userId/plants', userCtrl.showUserPlants);

// List all plants
router.get('/plants', plantCtrl.index);

// Render form for adding a new plant
router.get('/plants/new', plantCtrl.newPlant);

// Add a new plant
router.post('/plants', plantCtrl.postPlant);

// Add a comment to a specific plant
router.post('/plants/:id/comments', plantCtrl.addComment);

router.put('/plants/:id/comments/:commentId', plantCtrl.editComment);

// Show details of a specific plant
router.get('/plants/:id', plantCtrl.showPlant);

// Render form to edit a specific plant
router.get('/plants/:id/edit', plantCtrl.editPlant);

// Update a specific plant
router.put('/plants/:id', plantCtrl.updatePlant);

// Delete a specific plant
router.delete('/plants/:id', plantCtrl.deletePlant);

// Show all plants created by a specific user
router.get('/users/:userId/plants', plantCtrl.showUserPlants);

module.exports = router;