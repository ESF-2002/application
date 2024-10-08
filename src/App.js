import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Mettez à jour l'importation
import SignupForm from './SignupForm'; // Importez le composant
import PokemonList from './PokemonList'; // Importez le nouveau composant

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> {/* Remplacez Switch par Routes */}
          <Route path="/signup" element={<SignupForm />} /> {/* Utilisez element au lieu de component */}
          <Route path="/pokemon" element={<PokemonList />} /> {/* Utilisez element ici aussi */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
