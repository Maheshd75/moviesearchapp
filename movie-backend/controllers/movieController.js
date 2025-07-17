const Movie = require('../models/Movie');
const cloudinary = require('cloudinary').v2;

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new movie
// @route   POST /api/movies
// @access  Admin (for this example, accessible without auth)
const addMovie = async (req, res) => {
    const { title, description, trailerUrl, genre, releaseYear, director, cast } = req.body;

    // Check if image file was uploaded by multer
    if (!req.file) {
        return res.status(400).json({ message: 'No poster image file provided.' });
    }

    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "movie_posters", // Optional: folder in Cloudinary
            use_filename: true,
            unique_filename: false,
        });

        // Create new movie in MongoDB
        const movie = await Movie.create({
            title,
            description,
            posterUrl: result.secure_url, // Use the URL from Cloudinary
            trailerUrl,
            genre,
            releaseYear,
            director,
            cast: cast ? cast.split(',').map(item => item.trim()) : [], // Handle comma-separated cast
        });

        res.status(201).json(movie);
    } catch (error) {
        // If there's an error during Cloudinary upload or Mongoose save,
        // you might want to delete the uploaded image from Cloudinary
        // if (result && result.public_id) {
        //     await cloudinary.uploader.destroy(result.public_id);
        // }
        if (error.code === 11000) { // MongoDB duplicate key error (for unique title)
            return res.status(400).json({ message: 'A movie with this title already exists.' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// You can add more controller functions for update, delete etc.
// For brevity, we'll stick to get and add for now.

module.exports = {
    getMovies,
    addMovie,
    getMovieById,
};