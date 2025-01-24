// <!--routes/plant.js-->

const router = require('express').Router();
const userCtrl = require('../controllers/user');
const plantCtrl = require('../controllers/plant');

// User Routes
router.get('/users', userCtrl.index);
router.get('/users/:userId/plants', userCtrl.showUserPlants);

// Plant Routes
router.get('/plants', plantCtrl.index);
router.get('/plants/new', plantCtrl.newPlant);
router.post('/plants', plantCtrl.postPlant);
router.post('/plants/:id/comments', plantCtrl.addComment);
router.put('/plants/:id/comments/:commentId', plantCtrl.editComment);
router.get('/plants/:id', plantCtrl.showPlant);
router.get('/plants/:id/edit', plantCtrl.editPlant);
router.put('/plants/:id', plantCtrl.updatePlant);
router.delete('/plants/:id', plantCtrl.deletePlant);

module.exports = router;