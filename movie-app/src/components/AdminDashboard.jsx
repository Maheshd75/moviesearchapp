import React, { useState, useEffect } from 'react';

function AdminDashboard({ onAddMovie }) {
  const [movie, setMovie] = useState({
    title: '',
    description: '',
    trailerUrl: '',
    genre: '',
    releaseYear: '',
    director: '',
    cast: '', // Comma separated
  });

  const [posterFile, setPosterFile] = useState(null); // To store the actual file object
  const [previewImageUrl, setPreviewImageUrl] = useState(''); // For image preview
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPreviewImageUrl(URL.createObjectURL(file)); // Create a temporary URL for image preview
    } else {
      setPosterFile(null);
      setPreviewImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!movie.title || !movie.description || !movie.trailerUrl || !posterFile) {
      setMessage('Please fill in all required fields and upload a poster.');
      return;
    }

    const formData = new FormData();
    formData.append('title', movie.title);
    formData.append('description', movie.description);
    formData.append('trailerUrl', movie.trailerUrl);
    formData.append('genre', movie.genre);
    formData.append('releaseYear', movie.releaseYear);
    formData.append('director', movie.director);
    formData.append('cast', movie.cast);
    formData.append('posterImage', posterFile); // 'posterImage' must match the field name in upload.single()

    try {
      const response = await fetch('http://localhost:5000/api/movies', { // Adjust URL if backend is elsewhere
        method: 'POST',
        body: formData, // FormData automatically sets Content-Type to multipart/form-data
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Movie added successfully!');
        onAddMovie(data); // Assuming data contains the new movie object from the backend
        // Clear form after submission
        setMovie({
          title: '',
          description: '',
          trailerUrl: '',
          genre: '',
          releaseYear: '',
          director: '',
          cast: '',
        });
        setPosterFile(null); // Clear the file input
        setPreviewImageUrl(''); // Clear image preview
      } else {
        setMessage(`Error: ${data.message || 'Failed to add movie.'}`);
      }
    } catch (error) {
      console.error('Error adding movie:', error);
      setMessage('An error occurred while adding the movie.');
    } finally {
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    }
  };

  // Clean up the temporary object URL when the component unmounts or previewImageUrl changes
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);


  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Dashboard - Add New Movie</h2>
      {message && (
        <div className={`p-3 mb-4 rounded-md text-center ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={movie.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label htmlFor="posterFile" className="block text-gray-700 text-sm font-bold mb-2">Upload Poster Image:</label>
          <input
            type="file"
            id="posterFile"
            name="posterFile" // This name doesn't directly matter for multer, but good practice
            accept="image/*"
            onChange={handleFileChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={!posterFile} /* Make required only if no image file is selected */
          />
          {previewImageUrl && (
            <div className="mt-4">
              <p className="block text-gray-700 text-sm font-bold mb-2">Image Preview:</p>
              <img src={previewImageUrl} alt="Poster Preview" className="w-32 h-auto rounded-md shadow-md" />
            </div>
          )}
        </div>
        <div>
          <label htmlFor="trailerUrl" className="block text-gray-700 text-sm font-bold mb-2">Trailer Embed URL (YouTube):</label>
          <input
            type="url"
            id="trailerUrl"
            name="trailerUrl"
            value={movie.trailerUrl}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label htmlFor="genre" className="block text-gray-700 text-sm font-bold mb-2">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="releaseYear" className="block text-gray-700 text-sm font-bold mb-2">Release Year:</label>
          <input
            type="number"
            id="releaseYear"
            name="releaseYear"
            value={movie.releaseYear}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="director" className="block text-gray-700 text-sm font-bold mb-2">Director:</label>
          <input
            type="text"
            id="director"
            name="director"
            value={movie.director}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="cast" className="block text-gray-700 text-sm font-bold mb-2">Cast (comma separated):</label>
          <input
            type="text"
            id="cast"
            name="cast"
            value={movie.cast}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={movie.description}
            onChange={handleChange}
            rows="4"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          ></textarea>
        </div>
        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Add Movie
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminDashboard;