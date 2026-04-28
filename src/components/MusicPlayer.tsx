import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_TRACKS } from '../constants';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
      
      <div className="flex items-center gap-6 mb-8">
        <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl group">
          <motion.img
            key={currentTrack.cover}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            {isPlaying && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <Music2 className="w-8 h-8 text-white/50" />
              </motion.div>
            )}
          </div>
        </div>

        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex flex-col"
            >
              <h3 className="text-xl font-bold text-white truncate">{currentTrack.title}</h3>
              <p className="text-zinc-400 text-sm truncate">{currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-4 flex items-center gap-2 text-neon-blue">
            <Volume2 className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">Hi-Fi Audio</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="relative h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="absolute h-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_#00ffff]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={skipBack}
            className="p-3 text-zinc-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button 
            onClick={togglePlay}
            className="relative w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="absolute inset-0 rounded-full border-4 border-neon-blue/20" />
            {isPlaying ? <Pause fill="currentColor" /> : <Play className="ml-1" fill="currentColor" />}
          </button>

          <button 
            onClick={skipForward}
            className="p-3 text-zinc-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5">
        <p className="text-[10px] text-zinc-500 font-mono text-center uppercase tracking-[0.4em]">
          Ambient Neural Network v1.0
        </p>
      </div>
    </div>
  );
}
