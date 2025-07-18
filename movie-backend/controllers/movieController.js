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
        // Construct the Data URI from the buffer
        // req.file.mimetype will give you "image/jpeg", "image/png", etc.
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload image to Cloudinary using the Data URI
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "movie_posters",
            use_filename: true, // You can still use original filename for public_id if desired
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
            cast: cast ? cast.split(',').map(item => item.trim()) : [],
        });

        res.status(201).json(movie);
    } catch (error) {
        console.error('Error in addMovie:', error); // Log the actual error for debugging
        if (error.code === 11000) {
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
