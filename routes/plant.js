const router = require('express').Router();
const plantCtrl = require('../controllers/plant');

router.get('/plants', plantCtrl.index);
router.get('/plants/new', plantCtrl.newPlant);
router.post('/plants', plantCtrl.postPlant);
router.post('/plants/:id/comments', plantCtrl.addComment);
router.get('/plants/:id', plantCtrl.showPlant);
router.get('/plants/:id/edit', plantCtrl.editPlant);
router.put('/plants/:id', plantCtrl.updatePlant);
router.delete('/plants/:id', plantCtrl.deletePlant);



module.exports = router;