const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true // Ensure movie titles are unique
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    posterUrl: { // URL provided by Cloudinary after upload
        type: String,
        required: true
    },
    trailerUrl: { // YouTube embed URL
        type: String,
        required: true
    },
    genre: {
        type: String,
        trim: true,
        default: 'Unspecified'
    },
    releaseYear: {
        type: Number,
        min: 1800, // Movies unlikely to be before this
        max: new Date().getFullYear() + 5 // Allow for future releases
    },
    director: {
        type: String,
        trim: true,
        default: 'Unknown'
    },
    cast: {
        type: [String], // Array of strings
        default: []
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Movie', movieSchema);