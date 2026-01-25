import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

/**
 * 音乐播放器组件
 */
export default function MusicPlayer({
  tracks = [],
  autoPlay = false
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const playPrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleTrackEnd = () => {
    playNext();
  };

  if (!currentTrack || tracks.length === 0) {
    return null;
  }

  return (
    <div className="music-player fixed bottom-24 right-4 z-40 p-4 rounded-2xl shadow-xl max-w-xs">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      {/* 进度条 */}
      <div className="w-full h-1 bg-cherry-light rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-cherry-pink to-cherry-bright transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 歌曲信息 */}
      <div className="text-center mb-3">
        <p className="text-sm font-medium text-cherry-dark truncate">
          {currentTrack.title}
        </p>
        <p className="text-xs text-cherry-dark/60 truncate">
          {currentTrack.artist}
        </p>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={playPrevious}
          className="p-2 rounded-full hover:bg-cherry-pink/20 transition-colors"
        >
          <SkipBack size={18} className="text-cherry-dark" />
        </button>

        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-gradient-to-r from-cherry-pink to-cherry-bright shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white ml-0.5" />
          )}
        </button>

        <button
          onClick={playNext}
          className="p-2 rounded-full hover:bg-cherry-pink/20 transition-colors"
        >
          <SkipForward size={18} className="text-cherry-dark" />
        </button>
      </div>
    </div>
  );
}
