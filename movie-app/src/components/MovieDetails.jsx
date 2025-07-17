import React from 'react';

function MovieDetailsModal({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{movie.title}</h2>
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full md:w-1/3 h-auto rounded-lg shadow-md object-cover"
            />
            <div className="flex-1">
              <p className="text-gray-700 text-lg mb-4">{movie.description}</p>
              <p className="text-gray-800 mb-2">
                <span className="font-semibold">Genre:</span> {movie.genre}
              </p>
              <p className="text-gray-800 mb-2">
                <span className="font-semibold">Release Year:</span> {movie.releaseYear}
              </p>
              <p className="text-gray-800 mb-2">
                <span className="font-semibold">Director:</span> {movie.director}
              </p>
              <p className="text-gray-800 mb-2">
                <span className="font-semibold">Cast:</span> {movie.cast.join(', ')}
              </p>
            </div>
          </div>

          {movie.trailerUrl && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Trailer</h3>
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={movie.trailerUrl}
                  title={`${movie.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetailsModal;