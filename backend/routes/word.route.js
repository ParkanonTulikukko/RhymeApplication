let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();

// word Model
let wordSchema = require('../models/Word');

// CREATE word
router.route('/create-word').post((req, res, next) => {
  wordSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});

// READ words
router.route('/').get((req, res) => {
  wordSchema.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get Single word
router.route('/edit-word/:id').get((req, res) => {
  wordSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update word
router.route('/update-word/:id').put((req, res, next) => {
  wordSchema.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('word updated successfully !')
    }
  })
})

// Delete word
router.route('/delete-word/:id').delete((req, res, next) => {
  wordSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = router;