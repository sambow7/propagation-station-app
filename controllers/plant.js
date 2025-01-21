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
  console.log('Submitted Data:', req.body);
  console.log('Session User:', req.session.user);
  console.log('Parsed Body:', req.body);

  const { name, propagation, coverImage, watering, lighting, soil, care } = req.body;

  if (!name || !propagation) {
    req.flash('error', 'Name and propagation method are required.');
    return res.status(400).redirect('/plants/new');
  }

  try {
    const newPlant = new Plant({
      name,
      propagation,
      watering,
      lighting,
      soil,
      care,
      coverImage,
      createdBy: req.session.user.id, // Ensure the user is assigned
    });
    await newPlant.save();
    res.redirect('/plants');
  } catch (error) {
    console.error('Error saving plant:', error);
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
    res.status(200).redirect('/plants');
  } catch (error) {
    console.error('Error adding new commment', error);
    res.status(500).send('Internal Server Error');
  }
}

async function editComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      req.flash('error', 'Comment not found.');
      return res.status(404).redirect('back');
    }

    // Ensure only the owner can edit
    if (comment.createdBy.toString() !== req.session.user.id) {
      req.flash('error', 'You are not authorized to edit this comment.');
      return res.redirect('back');
    }

    comment.content = req.body.content;
    await comment.save();
    req.flash('success', 'Comment updated successfully.');
    res.redirect('back');
  } catch (error) {
    console.error('Error updating comment:', error);
    req.flash('error', 'An error occurred while updating the comment.');
    res.status(500).redirect('back');
  }
}

async function showPlant(req, res) {
  try {
    const plant = await Plant.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('comments.createdBy', 'username');

    if (plant) {
      res.render('plants/show', {
        title: 'Plant Details',
        plant,
        user: req.session.user, // Pass the session user for view-specific logic
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
    //prevent from editing plant
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

async function showUserPlants(req, res) {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.status(404).redirect('/plants');
    }

    const plants = await Plant.find({ createdBy: user._id });
    res.render('users/plants', {
      title: `${user.username}'s Plants`,
      plants,
      user,
    });
  } catch (error) {
    console.error('Error fetching user plants:', error);
    req.flash('error', 'An error occurred while fetching the plants.');
    res.status(500).redirect('/plants');
  }
}



module.exports = { index, newPlant, postPlant, editPlant, updatePlant, showPlant, deletePlant, addComment, isCreator, editComment, showUserPlants };