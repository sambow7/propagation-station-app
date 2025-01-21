//<!--routes/plant.js-->\

const router = require('express').Router();
const plantCtrl = require('../controllers/plant');

// List all plants
router.get('/plants', plantCtrl.index);

// Render form for adding a new plant
router.get('/plants/new', plantCtrl.newPlant);

// Add a new plant
router.post('/plants', plantCtrl.postPlant);

// Add a comment to a specific plant
router.post('/plants/:id/comments', plantCtrl.addComment);

// Show details of a specific plant
router.get('/plants/:id', plantCtrl.showPlant);

// Render form to edit a specific plant
router.get('/plants/:id/edit', plantCtrl.editPlant);

// Update a specific plant
router.put('/plants/:id', plantCtrl.updatePlant);

// Delete a specific plant
router.delete('/plants/:id', plantCtrl.deletePlant);

module.exports = router;