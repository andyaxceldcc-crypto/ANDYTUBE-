import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search videos..."
        className="px-4 py-2 bg-gray-800 text-white rounded-l-lg border border-gray-700 focus:outline-none focus:border-purple-500 w-64"
      />
      <button 
        type="submit"
        className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition"
      >
        🔍
      </button>
    </form>
  );
};

export default Search;