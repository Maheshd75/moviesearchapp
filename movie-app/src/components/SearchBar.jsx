import React from 'react';

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="mb-6 flex justify-center">
      <input
        type="text"
        placeholder="Search movies..."
        className="p-3 w-full max-w-md rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;