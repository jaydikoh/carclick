const express = require('express');
const router = express.Router();
const Car = require('../models/car');
// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/cars'

// GET /cars (index functionality) UN-PROTECTED - all users can access
router.get('/', async (req, res) => {
  const cars = await Car.find({}).populate('owner')
  res.render('cars/index.ejs', {title: 'All Cars', cars});
});

// GET /cars/:id (show funtionality)
router.get('/:id', async (req, res) => {
  const car =  await Car.findById(req.params.id).populate('owner');
  res.render('cars/show.ejs', {title: `Car in ${car.city}`, car})
});

// GET /cars/new (new functionality) PROTECTED - only signed in users can access
router.get('/new', ensureSignedIn, (req, res) => {
  res.render('cars/new.ejs', {title: 'Add Cars'});
});

// POST /cars  (Create functionality)
router.post ('/', ensureSignedIn, async (req, res) => {
  try{
    req.body.owner = req.user._id
    const car = await Car.create(req.body);
    console.log(car)
    res.redirect('/cars');
  } catch (e) {
    console.log(e);
    res.redirect('/cars/new');
  }
})



module.exports = router;