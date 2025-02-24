import React, { useState, useRef, useEffect } from 'react';
import "./Sound.css"

interface SoundControlProps {
  musicID: string; // URL of your audio file
}

const SoundControl: React.FC<SoundControlProps> = ({ musicID }) => {
  const [volumeValue, setVolumeValue] = useState(50); // Initial volume: 50
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100; // Normalize to 0-1
      audioRef.current.addEventListener('canplaythrough', () => {
        if (audioRef.current){
        audioRef.current.play().catch((error) => {
            console.error('Autoplay was prevented.', error);
          });
        }
      });
      return () => {
        if(audioRef.current){
          audioRef.current.removeEventListener('canplaythrough', ()=>{});
        }
      }
    }
  }, [volumeValue, musicID]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeValue(parseInt(event.target.value));
  };

  return (
    <div id="sound">
      <label htmlFor="volume">Sound</label>
      <input
        type="range"
        id="volume"
        name="volume"
        min="0"
        max="100"
        value={volumeValue}
        onChange={handleVolumeChange}
      />
      <output id="newvol" name="newvol" htmlFor="volume">
        {volumeValue}
      </output>
      <audio ref={audioRef} loop id="audioplayer" src={musicID} preload="auto"></audio>
    </div>
  );
};

export default SoundControl;