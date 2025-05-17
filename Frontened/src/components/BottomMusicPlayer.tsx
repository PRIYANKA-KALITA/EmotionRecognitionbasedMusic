// src/components/BottomMusicPlayer.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Volume2,
  VolumeX,
  Repeat,
} from "lucide-react";

interface Track {
  name: string;
  artist: string;
  album: string;
  coverUrl: string;   // URL to album cover
  audioUrl: string;   // URL to actual audio file
}

interface BottomMusicPlayerProps {
  tracks: Track[];
  currentIndex: number;               // Which track is playing
  onClose?: () => void;               // Optional close button if needed
  shuffleEnabled?: boolean;
  repeatEnabled?: boolean;
}

const BottomMusicPlayer: React.FC<BottomMusicPlayerProps> = ({
  tracks,
  currentIndex,
  onClose,
  shuffleEnabled = false,
  repeatEnabled = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // In seconds
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [shuffled, setShuffled] = useState(shuffleEnabled);
  const [repeating, setRepeating] = useState(repeatEnabled);
  const [index, setIndex] = useState(currentIndex);

  const currentTrack = tracks[index];

  // Load the current track into audio whenever index changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setProgress(0);
      setIsPlaying(false);
    }
  }, [index]);

  // Handle metadata loaded (duration, etc.)
  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle time update for progress bar
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  // Toggle play/pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Seek in the track
  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  // Change volume
  const handleVolume = (val: number) => {
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Next track
  const handleNext = () => {
    if (shuffled) {
      // pick a random index
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setIndex(randomIndex);
    } else {
      // move to next or loop if repeating
      setIndex((prev) => {
        const nextIdx = prev + 1 < tracks.length ? prev + 1 : 0;
        return nextIdx;
      });
    }
  };

  // Previous track
  const handlePrevious = () => {
    setIndex((prev) => {
      const nextIdx = prev - 1 >= 0 ? prev - 1 : tracks.length - 1;
      return nextIdx;
    });
  };

  // Shuffle toggle
  const toggleShuffle = () => {
    setShuffled(!shuffled);
  };

  // Repeat toggle
  const toggleRepeat = () => {
    setRepeating(!repeating);
  };

  // Handle track end
  const onEnded = () => {
    if (repeating) {
      // Replay the same track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  // Format time (mm:ss)
  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background dark:bg-backgroundLight border-t border-gray-700 p-4 flex items-center justify-between">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      >
        <source src={currentTrack.audioUrl} type="audio/mpeg" />
      </audio>

      {/* Track Info */}
      <div className="flex items-center space-x-4">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.album}
          className="w-16 h-16 object-cover rounded"
        />
        <div className="flex flex-col">
          <span className="font-bold text-white">{currentTrack.name}</span>
          <span className="text-sm text-gray-400">{currentTrack.artist}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-4">
          <button onClick={handlePrevious} className="p-2 text-gray-300 hover:text-white">
            <SkipBack className="h-5 w-5" />
          </button>
          <button onClick={handlePlayPause} className="p-2 text-gray-300 hover:text-white">
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          <button onClick={handleNext} className="p-2 text-gray-300 hover:text-white">
            <SkipForward className="h-5 w-5" />
          </button>
          <button onClick={toggleShuffle} className={`p-2 ${shuffled ? "text-green-400" : "text-gray-300 hover:text-white"}`}>
            <Shuffle className="h-5 w-5" />
          </button>
          <button onClick={toggleRepeat} className={`p-2 ${repeating ? "text-green-400" : "text-gray-300 hover:text-white"}`}>
            <Repeat className="h-5 w-5" />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="flex items-center space-x-2 w-[300px]">
          <span className="text-sm text-gray-300">{formatTime(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="flex-grow"
          />
          <span className="text-sm text-gray-300">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Optional Close */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-gray-300 hover:text-white">
          {volume > 0 ? <Volume2 className="h-5 w-5 mr-2" /> : <VolumeX className="h-5 w-5 mr-2" />}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => handleVolume(Number(e.target.value))}
            className="w-20"
          />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default BottomMusicPlayer;
