import { useEffect } from "react";
import Phaser from "phaser";

interface GameComponentProps {
  config: Phaser.Types.Core.GameConfig;
}

const GameComponent: React.FC<GameComponentProps> = ({ config }) => {
  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, [config]); // Ensure useEffect runs properly when config changes

  return <div id="phaser-game" />;
};

export default GameComponent;
