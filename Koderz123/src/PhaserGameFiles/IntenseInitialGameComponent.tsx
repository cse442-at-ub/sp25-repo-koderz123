import React, { useEffect } from 'react';
import Phaser from 'phaser';
import IntenseGameScene from './IntenseGameScene';

const IntenseInitialGameComponent: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1000,
      height: 512,
      scene: IntenseGameScene,
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="phaser-game" />;
};

export default IntenseInitialGameComponent; 