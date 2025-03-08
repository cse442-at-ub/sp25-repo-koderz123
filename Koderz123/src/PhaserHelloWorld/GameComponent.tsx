
import  { useEffect } from 'react'
import Phaser from "phaser";

//@ts-ignore
const GameComponent = ({ config }) => {
  useEffect(() => {
    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true)
    }
  }, [])

  return (
    <div id="phaser-container" />
  )
}

export default GameComponent