import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  username: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, username, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Tower Defense Game</Link>
      </div>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/game">Game</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <span className="username">Welcome, {username}!</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 