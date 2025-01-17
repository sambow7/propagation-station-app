const router = require('express').Router();
const plantCtrl = require('../controllers/plant');

router.get('/plants', plantCtrl.index);
router.get('/plants/new', plantCtrl.newplant);
router.post('/plants', plantCtrl.postplant);
router.post('/plants/:id/comments', plantCtrl.addComment);
router.get('/plants/:id', plantCtrl.showplant);
router.get('/plants/:id/edit', plantCtrl.editplant);
router.put('/plants/:id', plantCtrl.updateplant);
router.delete('/plants/:id', plantCtrl.deleteplant);



module.exports = router;