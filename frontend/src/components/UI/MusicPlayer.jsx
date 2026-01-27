import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

/**
 * 音乐播放器组件
 */
export default function MusicPlayer() {
  const audios = useStore((state) => state.audios) || [];
  const isPlaying = useStore((state) => state.isPlaying);
  const currentTrackIndex = useStore((state) => state.currentTrackIndex) || 0;
  const setPlaying = useStore((state) => state.setPlaying);
  const setCurrentTrackIndex = useStore((state) => state.setCurrentTrackIndex);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const tracks = audios;
  const currentTrack = tracks[currentTrackIndex];

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrackIndex, currentTrack]);

  // Handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    setPlaying(!isPlaying);
  };

  const playNext = () => {
    if (tracks.length === 0) return;
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    setCurrentTime(0);
  };

  const playPrevious = () => {
    if (tracks.length === 0) return;
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      if (total > 0) {
        const percent = (current / total) * 100;
        setProgress(percent);
      }
    }
  };

  const handleTrackEnd = () => {
    playNext();
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render if no tracks
  if (tracks.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-pink-100 max-w-xs">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        onError={() => setPlaying(false)}
      />

      {/* Progress bar with seek */}
      <div
        className="w-full h-2 bg-pink-100 rounded-full overflow-hidden mb-3 cursor-pointer relative group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-100 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-500 mb-2 px-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Track info */}
      <div className="text-center mb-3">
        <p className="text-sm font-medium text-gray-800 truncate">
          {currentTrack?.title || 'Unknown Track'}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {currentTrack?.artist || 'Unknown Artist'}
        </p>
        {tracks.length > 1 && (
          <p className="text-xs text-pink-400 mt-1">
            {currentTrackIndex + 1} / {tracks.length}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={playPrevious}
          disabled={tracks.length <= 1}
          className="p-2 rounded-full hover:bg-pink-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipBack size={18} className="text-gray-700" />
        </button>

        <button
          onClick={togglePlay}
          className="p-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white ml-0.5" />
          )}
        </button>

        <button
          onClick={playNext}
          disabled={tracks.length <= 1}
          className="p-2 rounded-full hover:bg-pink-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipForward size={18} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
