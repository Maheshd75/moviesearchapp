require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2; // v2 for the new API
const movieRoutes = require('./routes/movieRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(express.json()); // Body parser for JSON data
app.use(cors());

// Basic route for testing
app.get('/', (req, res) => {
    res.send('MovieApp Backend API is running!');
});

// --- MongoDB Connection ---
mongoose.connect(`${process.env.MONGO_URI}/movies`)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Cloudinary Configuration ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('Cloudinary configured.'); // Log to confirm configuration

// --- Routes ---
app.use('/api/movies', movieRoutes); // All movie-related routes will start with /api/movies

// --- Error Handling Middleware (Optional but good practice) ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// --- Start Server ---
//app.listen(PORT, () => {
 //   console.log(`Server running on port ${PORT}`);
//});
module.exports = app;