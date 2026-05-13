// HomeListPropsFeed.js
import React from 'react';
import CardHouse from './CardHouse';

function HomeListPropsFeed({ searchResults }){
 
    if (searchResults === null) {
      return (
        <div>
          {/* Render a loading spinner or message */}
          Loading...
        </div>
      );
    }
  
    if (searchResults.length === 0) {
      return (
        <div>
          {/* Render no search results found message */}
          No search results found.
        </div>
      );
    }

  return (
    <div>
      {searchResults.map((searchResult) => (
        <CardHouse key={searchResult.id_biens} {...searchResult} />
      ))}
    </div>
  );
}

export default HomeListPropsFeed;
