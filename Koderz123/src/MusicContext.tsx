import React, { createContext, useState, useEffect, useContext, useRef, ReactNode } from 'react';
import music from "./assets/menu_music.mp3";

interface MusicContextType {
    audioRef: React.RefObject<HTMLAudioElement | null>;
    changeMusic: (newSource: string) => void;
  }

const MusicContext = createContext<MusicContextType>({
    audioRef: { current: null },
    changeMusic: () => {},
  });

export const MusicProvider = ({ children } : { children: ReactNode}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSource, setAudioSource] = useState(music); // Initial music source

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSource);
      audioRef.current.loop = true;
      audioRef.current.addEventListener('ended', () => {
        // You might want to handle what happens when the audio ends, even with loop enabled.
      });

      // Start playing automatically
      audioRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
        //Handle the error, possibly showing a message or retrying with a user interaction.
      });

    } else {
        //If the audio source changes, start the new audio.
        audioRef.current.src = audioSource;
        audioRef.current.play().catch(error => {
            console.error("Autoplay failed:", error);
        })
    }
  }, [audioSource]);

  const changeMusic = (newSource: string) => {
    setAudioSource(newSource);
  };

  const value = {
    audioRef: audioRef,
    changeMusic,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);