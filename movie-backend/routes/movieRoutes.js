const express = require('express');
const { getMovies, addMovie, getMovieById } = require('../controllers/movieController');
const upload = require('../middleware/uploadMiddleware'); // Multer middleware

const router = express.Router();

// GET all movies
router.get('/', getMovies);

// GET a single movie by ID
router.get('/:id', getMovieById);

// POST a new movie (with image upload)
// 'posterImage' is the field name that Multer will look for in the form data
router.post('/', upload.single('posterImage'), addMovie);

module.exports = router;