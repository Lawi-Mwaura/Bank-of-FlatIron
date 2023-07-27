import React from 'react';

function SearchBar({ value, onChange }) {
  return (
    // Render an input for search and bind its value and change event to the search term state
    <input
      type="text"
      placeholder="Search by description..."
      value={value}
      onChange={onChange}
    />
  );
}

export default SearchBar;
