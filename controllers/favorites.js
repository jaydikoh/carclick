const express = require('express');
const router = express.Router();
const Car = require('../models/car');


// All routes start with '/'

// GET /cars (index functionality) 
router.get('/favourites', async (req, res) => {
  const cars = await Car.find({favoritedBy: req.user._id}).populate('owner')
  res.render('favorites/index.ejs', {title: 'Favorite Cars', cars});
});

// GET /cars/:id (show funtionality)
router.get('/:id', async (req, res) => {
  const car =  await Car.findById(req.params.id).populate('owner');
  res.render('cars/show.ejs', {title: `Car in ${car.city}`, car})
});


// POST /cars  (Create functionality)
// router.post ('/', ensureSignedIn, async (req, res) => {
//   try{
//     req.body.owner = req.user._id
//     const car = await Car.create(req.body);
//     console.log(car)
//     res.redirect('/cars');
//   } catch (e) {
//     console.log(e);
//     res.redirect('/cars/new');
//   }
// })



module.exports = router;