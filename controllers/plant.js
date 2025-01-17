const Plant = require('../models/plant');
const moment = require('moment');

async function index(req, res) {
  try {
    if(!req.session.user) {
      return res.redirect('/auth/sign-in');
    }
    const plants = await Plant.find({}).populate('createdBy', 'username').populate('comments.createdBy', 'username');
    const formattedPlant = plants.map(plant => ({
      ...plant.toObject(),
      formattedDate: moment(plant.createdAt).fromNow()
    }))
    res.render('plants', { title: 'Plant List 1', plants: formattedPlant})
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

function newPlant(req, res) {
  res.render('plants/new', { title: 'New Plant' });
}

async function postPlant(req, res) {
  try {
    if(!req.session.user) {
      return res.redirect('/auth/sign-in');
    }
    console.log(req.session.user);

    const newPlant = {
      ...req.body,
      createdBy: req.session.user.id
    };
    await Plant.create(newPlant);
    res.status(200).redirect('/plants');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function addComment(req, res) {
  try {
    const plant = await Plant.findById(req.params.id);
    const newComment = {
      ...req.body,
      createdBy: req.session.user.id
    }
    plant.comments.push(newComment);
    await plant.save();
    res.status(500).redirect('plansts')
  } catch (error) {
    console.error('Error adding new commment', error);
    res.status(500).send('Internal Server Error');
  }
}

async function showPlant(req, res) {
  try {
    const plant = await Plant.findById(req.params.id);
    if(plant) {
      res.render('plants/show', { title: 'Plant Details', plant });
    } else {
      res.status(404).render('404/notfound', { title: 'Plant Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function editPlant(req, res) {
  try {
    const plant = await Plant.findById(req.params.id);
    if(plant) {
      res.render('plants/edit', { title: 'Edit Plant', plant });
    } else {
      res.status(404).render('404/notfound', { title: 'Plant Not Found' });
    }
  
}

// Index
// router.get('/:userId', async (req, res) => {
//   try {
//     const userId = req.session.user._id
//     const user = await User.findById(userId).select('cabinet');
//     console.log(user, 'user');
//     res.render('plants/index.ejs', { cabinet: user.cabinet, id: userId });
//   } catch (error) {
//     console.error('Error loading cabinet: ', error);
//     res.status(500).send('Error loading cabinet');
//   }

// });

// New
// router.get('/new', (req, res) => {
//   try {
//     res.render('plants/new');
//   } catch (error) {
//     console.error('Error loading new plant form: ', error);
//     res.status(500).send('Error loading new plant form');
//   }
// });

// Create
// router.post('/', async (req, res) => {
//   try {
//     const userId = req.session.user._id;
//     const user = await User.findById(userId);
//     user.cabinet.push(req.body);
//     await user.save();
//     res.redirect(`/users/${userId}/plants`);
//   } catch (error) {
//     console.error('Error adding plant: ', error);
//     res.status(500).send('Error adding plant');
//   }
// });

// delete
// router.delete('/:itemId', async (req, res) => {
//   try {
//     const userId = req.session.user._id;
//     const { itemId } = req.params;
//     const user = await User.findById(userId);
//     const plantItemIndex = user.cabinet.findIndex(plant => plant._id.toString() === itemId);
//     user.cabinet.splice(plantItemIndex, 1);
//     await user.save();
//     res.redirect(`/users/${userId}/plants`);
//   } catch (error) {
//     console.error('Error deleting plant: ', error);
//     res.redirect('/');
//   }
// });

// show
// router.get('/:itemId', async (req, res) => {
//   try {
//     const userId = req.session.user._id;
//     const { itemId } = req.params;
//     const user = await User.findById(userId);
//     console.log(plantItem)
//     res.render('plants/show.ejs', { plantItem, user })
//   } catch (error) {
//     console.error('Error loading plant: ', error);
//     res.status(500).send('Error loading plant');
//   }
// });

module.exports = { index, newPlant, postPlant, editPlant, updatePlant, showPlant, deletePlant, addComment }