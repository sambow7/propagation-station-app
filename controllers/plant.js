const Plant = require('../models/plant');
const moment = require('moment');

async function index(req, res) {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/sign-in');
    }
    const plants = await Plant.find({}).populate('createdBy', 'username').populate('comments.createdBy', 'username');
    const formattedPlant = plants.map(plant => ({
      ...plant.toObject(),
      formattedDate: moment(plant.createdAt).fromNow()
    }))
    res.render('plants', { title: 'Plant List 1', plants: formattedPlant })
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
    if (!req.session.user) {
      return res.redirect('/auth/sign-in');
    }
    console.log(req.session.user);

    const newPlant = {
      ...req.body,
      coverImage: req.body.coverImage,
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
    res.status(200).redirect(`/plants/${req.params.id}`);
  } catch (error) {
    console.error('Error adding new commment', error);
    res.status(500).send('Internal Server Error');
  }
}

async function showPlant(req, res) {
  try {
    const plant = await Plant.findById(req.params.id);
    if (plant) {
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
    if (plant) {
      res.render('plants/edit', { title: 'Edit Plant', plant });
    } else {
      res.status(404).render('404/notfound', { title: 'Plant Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function updatePlant(req, res) {
  try {
    const plantId = parseInt(req.params.id);
    const { id } = req.params;

    const updatedPlant = await Plant.findByIdAndUpdate(id, req.body)
    if (updatedPlant) {
      res.status(200).redirect(`/plants`);
    } else {
      res.status(404).render('404/notfound', { title: 'Plant Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

async function deletePlant(req, res) {
  try {
    const { id } = req.params;
    const deletedPlant = await Plant.findByIdAndDelete(id);
    if (deletedPlant) {
      res.status(200).redirect('/plants');
    } else {
      res.status(404).render('404/notfound', { title: 'Plant Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { index, newPlant, postPlant, editPlant, updatePlant, showPlant, deletePlant, addComment }