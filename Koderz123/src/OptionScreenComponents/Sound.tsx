import React, { useEffect } from 'react';
import { useMusic } from '../MusicContext.tsx'; // Import useMusic
import "./Sound.css"

interface SoundSliderProps {
  volumeValue: number;
  setVolumeValue: (value: number) => void;
}

const SoundControl: React.FC<SoundSliderProps> = ({ volumeValue, setVolumeValue }) => {
  const { audioRef } = useMusic();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  }, [volumeValue, audioRef]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeValue(parseInt(event.target.value));
  };

  return (
    <div id="soundcontrol">
      <label htmlFor="volume">Sound</label>
      <input
        type="range"
        id="volume"
        min="0"
        max="100"
        step="1"
        value={volumeValue}
        onChange={handleVolumeChange}
      />
      <output id="newvol" name="newvol" htmlFor="volume">
        {(volumeValue).toFixed(0)}
      </output>
    </div>
  );
};

export default SoundControl;