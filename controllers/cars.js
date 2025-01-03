const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to file name
  }
});

const upload = multer({ storage });

// Middleware to protect selected routes
const ensureSignedIn = require('../middleware/ensure-signed-in');

// All routes start with '/cars'

router.get('/mycars', ensureSignedIn, async (req, res) => {
  try {
    const cars = await Car.find({ owner: req.user._id }); // Find cars owned by the logged-in user
    console.log('User cars:', cars);
    res.render('cars/mycars.ejs', { title: 'My Cars', cars });
  } catch (e) {
    console.log(e)
    // res.redirect('/cars');
  }
});

// GET /cars (index functionality) UN-PROTECTED - all users can access
router.get('/', async (req, res) => {
  const cars = await Car.find({}).populate('owner')
  res.render('cars/index.ejs', {title: 'All Cars', cars});
});

// GET /cars/new (new functionality) PROTECTED - only signed in users can access
router.get('/new', ensureSignedIn, (req, res) => {
  res.render('cars/new.ejs', {title: 'Add Cars'});
});

// GET /cars/:id (show funtionality)
router.get('/:id', async (req, res) => {
  const car = await Car.findById(req.params.id).populate('owner');
  const isFavorited = car.favoritedBy.some((userId) => userId.equals(req.user?._id));
  req.body.owner = req.user._id;
  owner = req.body.owner
  res.render('cars/show.ejs', {title: `Car in ${car.city}`, car, isFavorited, owner})
});


// POST /cars  (Create functionality)
router.post('/', ensureSignedIn, upload.single('photo'), async (req, res) => {
  try{
    req.body.owner = req.user._id;
    if (req.file) {
      req.body.photo = `/uploads/${req.file.filename}`; // Store file path in photo field
  }
    const car = await Car.create(req.body);
    res.redirect('/cars');
  } catch (e) {
    console.log(e);
    res.redirect('/cars/new');
  }
})

// GET /cars/:id/edit (edit functionality)
router.get('/:id/edit', async (req, res) => {
  const car = await Car.findById(req.params.id)
  res.render('cars/edit.ejs', {title: 'Edit Car Details', car})
});


// PUT /cars/:id (Update functionality)
router.put('/:id', ensureSignedIn, upload.single('photo'), async(req, res) => {
  try{
    // req.body.owner = req.user._id
    const car = await Car.findById(req.params.id);    
    if (req.file) {
      // Delete the old photo
      if (car.photo) {
        const oldPhotoPath = path.join(__dirname, '../', car.photo);
        fs.unlink(oldPhotoPath, (err) => {
          if (err) console.error('Error deleting old photo:', err);
        });
      }
    
      // Set the new photo path
      car.photo = `/uploads/${req.file.filename}`;
    }  
    Object.assign(car, req.body);
    await car.save();
    res.redirect('/cars');
  } catch (e) {
    console.log(e);
    res.redirect('/cars');
  }
});

// DELETE /cars/:id/delete (Delete functionality)
router.delete('/:id', ensureSignedIn, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (car.photo) {
      const filePath = path.join(__dirname, '../', car.photo); // Adjust the path as necessary
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error('Error deleting photo:', err);
          } else {
              console.log('Photo deleted successfully');
          }
      });
  }
      
      await Car.findByIdAndDelete(req.params.id)
      res.redirect('/cars');
    } catch (e) {
      console.log(e);
      res.status(500).send('Error deleting car');
  }
});





module.exports = router;


