import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

interface AudioContextType {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  progress: number;
  currentTime: string;
  duration: string;
  togglePlay: (id: number, src: string) => void;
  seek: (value: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

interface AudioProviderProps {
  children: ReactNode;
  currentAudioId: number | null;
}

export const AudioProvider = ({
  children,
  currentAudioId,
}: AudioProviderProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  const setupAudioListeners = (audio: HTMLAudioElement) => {
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
      setCurrentTime(formatTime(audio.currentTime));
    };

    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    const cleanup = () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };

    if (cleanupRef.current) {
      cleanupRef.current();
    }
    cleanupRef.current = cleanup;

    return cleanup;
  };

  const togglePlay = (id: number, src: string) => {
    if (id === currentAudioId) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch((error) => {
          toast.error("Ses kaydı oynatılamadı.");
          setIsPlaying(false);
        });
        setIsPlaying(true);
      }
      return;
    }

    setProgress(0);
    setCurrentTime("0:00");
    setDuration("0:00");

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(src);
    setupAudioListeners(audioRef.current);

    audioRef.current.play().catch((error) => {
      toast.error("Ses kaydı oynatılamadı.");
      setIsPlaying(false);
    });
    setIsPlaying(true);
  };

  const seek = (value: number) => {
    if (audioRef.current) {
      const time = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(value);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        audio: audioRef.current,
        isPlaying,
        progress,
        currentTime,
        duration,
        togglePlay,
        seek,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
