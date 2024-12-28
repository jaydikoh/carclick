const express = require('express');
const router = express.Router();

// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/cars'

// GET /cars (index functionality) UN-PROTECTED - all users can access
router.get('/', (req, res) => {
  res.render('cars/index.ejs', {title: 'All Cars'});
});

// GET /cars/new (new functionality) PROTECTED - only signed in users can access
router.get('/new', ensureSignedIn, (req, res) => {
  res.render('cars/new.ejs', {title: 'Add Cars'});
});



module.exports = router;