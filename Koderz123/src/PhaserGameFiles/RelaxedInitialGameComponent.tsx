import React, { useEffect } from 'react';
import Phaser from 'phaser';
import RelaxedGameScene from './RelaxedGameScene';
import RelaxedGameOver from './RelaxedGameOver';

const RelaxedInitialGameComponent: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1000,
      height: 512,
      scene: [RelaxedGameScene, RelaxedGameOver],
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
};

export default RelaxedInitialGameComponent; 