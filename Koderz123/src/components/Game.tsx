import React from 'react';
import InitialGame from '../GameScreenComponents/InitialGame';

interface GameProps {
  username: string;
}

const Game: React.FC<GameProps> = ({ username }) => {
  return (
    <div className="game-container">
      <h2>Welcome to the Game, {username}!</h2>
      <InitialGame />
    </div>
  );
};

export default Game; 