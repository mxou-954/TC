import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';  // Import du fichier CSS pour la navigation

export default function Navbar() {
  return (
    <nav className='navbar'>
      <ul className='navbar-links'>
        <li>
          <Link to='/Inscription'>Inscription</Link>
        </li>
        <li>
          <Link to='/Connexion'>Connexion</Link>
        </li>
      </ul>
    </nav>
  );
}