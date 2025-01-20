//<!--controllers/plant.js-->

const Plant = require('../models/plant');
const moment = require('moment');

async function isCreator(plantId, userId) {
  const plant = await Plant.findById(plantId);
  if (!plant) {
    return false;
  }
  return plant.createdBy.equals(userId);
}

async function index(req, res) {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/sign-in'); // Redirect if user not logged in
    }

    const plants = await Plant.find({ createdBy: req.session.user.id }) // Fetch plants for the logged-in user
      .populate('createdBy', 'username')
      .populate('comments.createdBy', 'username');

    const formattedPlant = plants.map(plant => ({
      ...plant.toObject(),
      formattedDate: moment(plant.createdAt).fromNow()
    }));

    res.render('plants/index', { 
      title: 'Plant List 1', 
      plants: formattedPlant, 
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading plants.');
    res.status(500).redirect('/');
  }
}

async function newPlant(req, res) {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/sign-in'); // Ensure only logged-in users can add plants
    }
    res.render('plants/new', { 
      title: 'Add New Plant', 
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error loading the form.');
    res.status(500).redirect('/');
  }
}

async function postPlant(req, res) {
  try {
    if (!req.session.user) {
      req.flash('error', 'You must be logged in to add a plant.');
      return res.redirect('/auth/sign-in');
    }

    const { name, propagation, coverImage, watering, lighting, soil, care } = req.body;

    if (!name || !propagation) {
      req.flash('error', 'Name and propagation method are required fields.');
      return res.status(400).redirect('/plants/new');
    }

    const newPlant = new Plant({
      name: name.trim(),
      propagation: propagation.trim(),
      coverImage: coverImage?.trim(),
      watering: watering?.trim(),
      lighting: lighting?.trim(),
      soil: soil?.trim(),
      care: care?.trim(),
      createdBy: req.session.user.id,
    });

    await newPlant.save();
    req.flash('success', 'Plant added successfully!');
    res.status(201).redirect('/plants');
  } catch (error) {
    console.error('Error creating plant:', error);

    if (error.name === 'ValidationError') {
      req.flash('error', 'Invalid plant data. Please try again.');
      return res.status(400).redirect('/plants/new');
    }

    req.flash('error', 'An unexpected error occurred while creating the plant.');
    res.status(500).redirect('/plants/new');
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
    res.status(200).redirect('/plants');
  } catch (error) {
    console.error('Error adding new commment', error);
    res.status(500).send('Internal Server Error');
  }
}

async function showPlant(req, res) {
  try {
    const plant = await Plant.findById(req.params.id).populate('createdBy', 'username').populate('comments.createdBy', 'username');
    if (plant) {
      res.render('plants/show', { 
        title: 'Plant Details', 
        plant, 
        user: req.session.user
      });
    } else {
      res.status(404).render('404/notfound', { title: 'Plant Not Found' });
    }
  } catch (error) {
    console.error('Error fetching plant details:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function editPlant(req, res) {
  try {
    const plant = await Plant.findById(req.params.id);
    console.log(plant);
    if (!plant) {
      req.flash('error', 'Plant not found.');
      return res.status(404).redirect('/plants');
    }

    if (plant.createdBy.toString() !== req.session.user.id) {
      req.flash('error', 'You are not authorized to edit this plant.');
      return res.redirect('/plants');
    }

    res.render('plants/edit', { title: 'Edit Plant', plant });
  } catch (error) {
    console.error('Error fetching plant for edit:', error);
    req.flash('error', 'An error occurred while fetching the plant.');
    res.status(500).redirect('/plants');
  }
}

async function updatePlant(req, res) {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      req.flash('error', 'Plant not found.');
      return res.status(404).redirect('/plants');
    }

    if (plant.createdBy.toString() !== req.session.user.id) {
      req.flash('error', 'You are not authorized to update this plant.');
      return res.redirect('/plants');
    }

    await Plant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.flash('success', 'Plant updated successfully!');
    res.status(200).redirect('/plants');
  } catch (error) {
    console.error('Error updating plant:', error);
    req.flash('error', 'An error occurred while updating the plant.');
    res.status(500).redirect('/plants');
  }
}

async function deletePlant(req, res) {
  try {
    const { id } = req.params;
    const userId = req.session.user.id;

    const isAuthorized = await isCreator(id, userId);
    if (!isAuthorized) {
      req.flash('error', 'You are not authorized to delete this plant.');
      return res.redirect(`/plants/${id}`);
    }

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