const express = require('express');
const router = express.Router();
const Car = require('../models/car');


// All routes start with '/'

// GET /cars (index functionality) 
router.get('/favorites', async (req, res) => {
  const cars = await Car.find({favoritedBy: req.user._id}).populate('owner')
  res.render('favorites/index.ejs', {title: 'Favorite Cars', cars});
});

// GET /cars/:id (show funtionality)
router.get('/:id', async (req, res) => {
  const car =  await Car.findById(req.params.id).populate('owner');
  res.render('cars/show.ejs', {title: `Car in ${car.city}`, car})
});


// POST /cars/:id/favourites  (Create functionality)
router.post ('/cars/:id/favorites', async (req, res) => {
  try{
    await Car.findByIdAndUpdate(
      req.params.id,
      {$addToSet: {favoritedBy: req.user._id}}
    );
    res.redirect(`/cars/${req.params.id}`);
  } catch (e) {
    console.log(e);
    res.redirect('/cars');
  }
})

// DELETE /cars/:id/favorites (delete favorites functionality)
router.delete('/cars/:id/favorites', async (req, res) => {
  try{
    await Car.findByIdAndUpdate(
      req.params.id,
      {$pull: {favoritedBy: req.user._id}}
    );
    res.redirect(`/cars/${req.params.id}`);
  } catch (e) {
    console.log(e);
    res.redirect('/cars');
  }
});



module.exports = router;