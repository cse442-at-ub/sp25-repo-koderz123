import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  ReactNode,
} from "react";
import music from "./assets/menu_music.mp3";

interface MusicContextType {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  changeMusic: (newSource: string) => void;
  playMusic: () => void;
}

const MusicContext = createContext<MusicContextType>({
  audioRef: { current: null },
  changeMusic: () => {},
  playMusic: () => {},
});

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioSource, setAudioSource] = useState(music); // Initial music source

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSource);
      audioRef.current.loop = true;
      audioRef.current.addEventListener("ended", () => {
        alert("Music ended :(");
      });
    } else {
      //If the audio source changes, start the new audio.
      audioRef.current.src = audioSource;
    }
  }, [audioSource]);

  const changeMusic = (newSource: string) => {
    setAudioSource(newSource);
  };

  const playMusic = () => {
    // Add this function
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Playback failed:", error);
      });
    }
  };

  const value = {
    audioRef: audioRef,
    changeMusic,
    playMusic,
  };

  return (
    <MusicContext.Provider value={ value }>{children}</MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
