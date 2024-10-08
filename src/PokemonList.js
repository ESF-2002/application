import React, { useEffect, useState, useCallback } from 'react';
import './PokemonList.css';

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pokemonCount, setPokemonCount] = useState(20);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);

  // Utilisation de useCallback pour mémoriser la fonction fetchPokemon
  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonCount}&offset=${currentPage * pokemonCount}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();

      // Tri des Pokémon par nom en ordre alphabétique
      const sortedPokemon = data.results.sort((a, b) => a.name.localeCompare(b.name));
      setPokemonList(sortedPokemon);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [pokemonCount, currentPage]); // Ajout des dépendances

  useEffect(() => {
    document.body.classList.add('pokemon-page');
    fetchPokemon(); // Chargement initial des Pokémon
    return () => {
      document.body.classList.remove('pokemon-page');
    };
  }, [fetchPokemon]); // Ajout de fetchPokemon aux dépendances

  const handlePokemonClick = async (pokemon) => {
    const res = await fetch(pokemon.url);
    const data = await res.json();
    setSelectedPokemon(data);
    setNotificationVisible(true);
    // Augmentez le temps de visibilité à 8000 ms (8 secondes)
    setTimeout(() => {
      setNotificationVisible(false);
    }, 8000); // Changer 5000 à 8000
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  // Appel de fetchPokemon lorsque le nombre de Pokémon change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setPokemonCount(value);
    setCurrentPage(0); // Réinitialiser la page actuelle à 0 lors de la modification du nombre de Pokémon
    fetchPokemon(); // Met à jour automatiquement les Pokémon
  };

  return (
    <div className="pokemon-list-container">
      <h2>Liste des Pokémon</h2>
      <div className="input-container">
        <input
          type="number"
          min="1"
          max="151"
          value={pokemonCount}
          onChange={handleInputChange} // Met à jour automatiquement
          placeholder="Nombre de Pokémon (facultatif)"
        />
      </div>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      <ul className="pokemon-list">
        {pokemonList.map((pokemon, index) => (
          <li key={index} className="pokemon-item" onClick={() => handlePokemonClick(pokemon)}>
            {pokemon.name}
          </li>
        ))}
      </ul>
      {/* Boutons de pagination déplacés ici */}
      <div className="pagination-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>Afficher les 20 précédents</button>
        <button onClick={handleNextPage}>Afficher les 20 suivants</button>
      </div>
      {notificationVisible && selectedPokemon && (
        <div className="notification">
          <button className="close-button" onClick={() => setNotificationVisible(false)}>&times;</button>
          <h3>{selectedPokemon.name}</h3>
          <img src={selectedPokemon.sprites.front_default} alt={selectedPokemon.name} />
          <p>Height: {selectedPokemon.height}</p>
          <p>Weight: {selectedPokemon.weight}</p>
        </div>
      )}
    </div>
  );
};

export default PokemonList;
