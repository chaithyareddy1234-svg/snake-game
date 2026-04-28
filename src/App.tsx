import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#020205]">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-blue/20 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-neon-pink/10 blur-[100px] rounded-full" />
        
        {/* Subtle Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-16">
        {/* Left Side: Info / Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:flex flex-col gap-4 w-60"
        >
          <div className="h-1 w-12 bg-neon-blue shadow-[0_0_10px_#00ffff]" />
          <h1 className="text-4xl font-display tracking-tighter neon-text-blue">
            NEON<br />GROOVE
          </h1>
          <p className="text-sm text-zinc-500 font-mono leading-relaxed mt-4">
            A SYNTHETIC MERGER OF RETRO ARCADE MECHANICS AND AI-GENERATED SOUNDSCAPES.
          </p>
          <div className="mt-8 flex flex-col gap-2">
            <span className="text-[10px] text-zinc-700 uppercase tracking-widest">Protocol</span>
            <span className="text-xs text-zinc-400 font-mono">ENCRYPTED_FLOW_v2</span>
          </div>
        </motion.div>

        {/* Center: The Game */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-neon-blue/20 to-neon-pink/20 blur-xl opacity-50" />
          <SnakeGame />
        </motion.div>

        {/* Right Side: Music Player */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MusicPlayer />
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="absolute bottom-6 left-6 flex items-center gap-4 text-zinc-800 pointer-events-none">
        <span className="text-xs font-mono">SYS_STATUS: OPTIMAL</span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
      </footer>
    </div>
  );
}
