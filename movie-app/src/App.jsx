import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetailsModal from './components/MovieDetails';
import AdminDashboard from './components/AdminDashboard';
// No longer importing initialMovies from './data/movies';

function App() {
  const [movies, setMovies] = useState([]); // Initialize as empty array, data will come from backend
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


  // Function to fetch movies from the backend
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/movies`); // Your backend API endpoint
      const data = await response.json();
      setMovies(data); // Set movies directly from backend
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setError('Failed to load movies. Please check if the backend server is running and accessible.');
      setMovies([]); // Clear movies if fetch fails
    } finally{
      setLoading(false);}
    }
  ; // No dependencies for initial fetch, runs once on mount

  // Fetch movies when the component mounts
  useEffect(() => {
    fetchMovies();
  }, []); // Dependency array includes fetchMovies to satisfy useCallback linting

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // When a movie is successfully added via AdminDashboard, refresh the list from the backend
  const handleMovieAdded = () => {
    // We can either refetch all movies or just add the new one to the current state
    // Refetching is safer for ensuring consistency, adding is faster for UX
    // For simplicity, let's refetch to ensure the list is always fresh from DB
    fetchMovies();
    // Alternatively, for quicker UI update (if you trust the backend response is exact):
    // setMovies((prevMovies) => [...prevMovies, newMovieFromBackend]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto p-6">
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
                {loading && <p className="text-center text-blue-600 text-lg">Loading movies...</p>}
                {error && <p className="text-center text-red-600 text-lg">{error}</p>}
                {!loading && !error && filteredMovies.length === 0 && (
                  <p className="text-center text-gray-600 text-lg">No movies found. Try adding some from the Admin page!</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {!loading && !error && filteredMovies.map((movie) => (
                    // MongoDB _id needs to be used as key for consistency
                    <MovieCard key={movie._id} movie={movie} onClick={handleCardClick} />
                  ))}
                </div>
                <MovieDetailsModal movie={selectedMovie} onClose={handleCloseModal} />
              </div>
            }
          />
          {/* Pass handleMovieAdded to AdminDashboard */}
          <Route path="/admin" element={<AdminDashboard onAddMovie={handleMovieAdded} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
