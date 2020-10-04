import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [ gameList, setGameList ] = useState([]);
  const [ query, setQuery ] = useState('Halo');
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ searched, setSearched ] = useState(false);
  const perPage = 20;

  useEffect(() => {
    window.addEventListener('keydown', keyHandler);
  }, []);

  useEffect(() => {
    if (searched) {
      setSearched(false);
    }
    async function searchGames() {
      const gameResponse = await fetch(`http://localhost:5000/v1/api/findGames?appName=${query}&perPage=${perPage}&page=${pageNumber}`, {
        method: 'GET'
      });
      const games = await gameResponse.json();
      if (typeof(games) === 'object') {
        const itemNumberOffset = perPage * (pageNumber - 1);
        const gameCollection = games.map((game, index) => {
        return <li className='gameItem' key={game.appid}>{(index + 1) + itemNumberOffset}. {game.name}</li>
        });
        setGameList(gameCollection);
      }
    }
    if (pageNumber) {
      searchGames();
    }
  }, [pageNumber, searched]);

  function changePage(page) {
    if (page > pageNumber && gameList.length !== perPage) {
      return;
    }
    if (page >= 1) {
      setPageNumber(page);
    }
  }

  function searchForGames() {
    setPageNumber(1);
    setSearched(true);
  }

  function keyHandler(event) {
    if (event.key === 'Enter') {
      searchForGames();
    }
  }


  return (
    <div className="App">
      <h1>Games Budget App</h1>
      <nav className="gameNav">
        <a className="navItem" href="#">Steam Games</a>
        <a className="navItem" href="#">GoG Games</a>
        <a className="navItem" href="#">Epic Games</a>
      </nav>
      <ul className="gameList">
        {gameList}
      </ul>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)}/>
      <button className="navButton searchButton" onClick={searchForGames}>Search for games</button>
      <button className="navButton backButton" onClick={() => changePage(pageNumber - 1)}>Previous Page</button>
      <button className="navButton forwardButton" onClick={() => changePage(pageNumber + 1)}>Next Page</button>
    </div>
  );
}

export default App;
