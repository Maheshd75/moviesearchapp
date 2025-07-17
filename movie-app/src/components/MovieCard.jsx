import React from 'react';

function MovieCard({ movie, onClick }) {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300 ease-in-out"
      onClick={() => onClick(movie)}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-72 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">
          {movie.title}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{movie.releaseYear}</p>
      </div>
    </div>
  );
}

export default MovieCard;