import React, { useEffect, useState, useCallback } from 'react';
import './PokemonList.css';

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pokemonCount, setPokemonCount] = useState(20); // Valeur par défaut à 20
  const [currentPage, setCurrentPage] = useState(0); // Page initiale
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [filter, setFilter] = useState(''); // État pour le filtre
  const [showAll, setShowAll] = useState(false); // État pour afficher tous les Pokémon

  const totalPokemon = 151; // Nombre total de Pokémon disponibles

  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${showAll ? totalPokemon : pokemonCount}&offset=${currentPage * pokemonCount}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await res.json();
      const sortedPokemon = data.results.sort((a, b) => a.name.localeCompare(b.name));
      setPokemonList(sortedPokemon);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [pokemonCount, currentPage, showAll]);

  useEffect(() => {
    document.body.classList.add('pokemon-page');
    fetchPokemon();
    return () => {
      document.body.classList.remove('pokemon-page');
    };
  }, [fetchPokemon]);

  const handlePokemonClick = async (pokemon) => {
    const res = await fetch(pokemon.url);
    const data = await res.json();
    setSelectedPokemon(data);
    setNotificationVisible(true);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 8000); // Notification visible pendant 8 secondes
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  // Gérer la modification du nombre de Pokémon affichés par l'utilisateur
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10); // Assurer que la valeur est bien un nombre
    if (!isNaN(value) && value > 0) {
      setPokemonCount(value); // Met à jour pokemonCount selon la valeur de l'input
      setCurrentPage(0); // Réinitialiser à la première page à chaque modification du nombre
    }
  };

  // Gérer le changement du filtre
  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase()); // Met à jour le filtre en minuscules pour une comparaison insensible à la casse
  };

  // Calcul pour désactiver le bouton "suivant" si on atteint la fin des Pokémon
  const isNextPageDisabled = (currentPage + 1) * pokemonCount >= totalPokemon;

  // Filtrer les Pokémon en fonction du nom
  const filteredPokemonList = pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(filter));

  // Gérer l'affichage de tous les Pokémon
  const handleShowAll = () => {
    setShowAll(prev => !prev); // Bascule entre afficher tous les Pokémon et afficher selon le nombre défini
    setCurrentPage(0); // Réinitialise à la première page
  };

  return (
    <div className="pokemon-list-container">
      <h2>Liste des Pokémon</h2>
      {/* Input pour changer le nombre de Pokémon affichés */}
      <div className="input-container">
        <input
          type="number"
          min="1"
          max="151"
          value={showAll ? totalPokemon : pokemonCount}
          onChange={handleInputChange}
          placeholder="Nombre de Pokémon"
          disabled={showAll} // Désactive l'input si "Afficher tous" est activé
        />
      </div>
      {/* Input pour filtrer par nom */}
      <div className="filter-container">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Filtrer par nom"
          className="filter-input" // Classe CSS spécifique pour le champ de filtrage
        />
      </div>
      {/* Bouton pour afficher tous les Pokémon */}
      <button onClick={handleShowAll} className="show-all-button">
        {showAll ? 'Afficher moins' : 'Afficher tous les Pokémon'}
      </button>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      <ul className="pokemon-list">
        {filteredPokemonList.map((pokemon, index) => (
          <li key={index} className="pokemon-item" onClick={() => handlePokemonClick(pokemon)}>
            {pokemon.name}
          </li>
        ))}
      </ul>
      {/* Pagination dynamique avec le nombre personnalisé */}
      <div className="pagination-buttons">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Afficher les {pokemonCount} précédents
        </button>
        <button onClick={handleNextPage} disabled={isNextPageDisabled}>
          Afficher les {pokemonCount} suivants
        </button>
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
