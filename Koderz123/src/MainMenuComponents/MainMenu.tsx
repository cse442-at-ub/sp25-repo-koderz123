import React from 'react';
import "./MainMenu.css";

const MainMenu: React.FC = () => {
  return (
    <>
      <h1>GALACTIC TOWER DEFENSE</h1>
      <div className="menu-item">New Game</div>
      <div className="menu-item">Options</div>
      <div className="menu-item">Exit</div>
    </>
  );
};

export default MainMenu;