// Alphabet.js
import React from 'react';
import './Alphabet.css'; // Import des styles CSS

const Alphabet = () => {
  // Génération de la liste d'alphabets de A à Z
  const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="alphabet-container">
      <h2 className="alphabet-title">Alphabet List</h2>
      <ul className="alphabet-list">
        {alphabets.map((letter, index) => (
          <li key={index} className="alphabet-item">
            {letter}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alphabet;
