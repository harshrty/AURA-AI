import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, RotateCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Breathing = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('Ready?'); // Phases: Inhale, Hold, Exhale

  useEffect(() => {
    let timer;
    if (isActive) {
      const cycle = () => {
        setPhase('Inhale');
        timer = setTimeout(() => {
          setPhase('Hold');
          timer = setTimeout(() => {
            setPhase('Exhale');
            timer = setTimeout(cycle, 4000);
          }, 4000);
        }, 4000);
      };
      cycle();
    } else {
      setPhase('Ready?');
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isActive]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-800">Zen Zone</h1>
        <p className="text-slate-500">Take a moment to center yourself.</p>
      </div>

      {/* Animated Circle Container */}
      <div className="relative flex items-center justify-center">
        {/* The Outer Glow */}
        <motion.div
          animate={{
            scale: isActive ? [1, 1.2, 1.2, 1] : 1,
            opacity: isActive ? [0.2, 0.4, 0.4, 0.2] : 0.2,
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute size-80 bg-indigo-400 rounded-full blur-3xl"
        />

        {/* The Breathing Circle */}
        <motion.div
          animate={{
            scale: phase === 'Inhale' ? 1.5 : phase === 'Exhale' ? 1 : phase === 'Hold' ? 1.5 : 1,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="size-48 bg-linear-to-br from-indigo-500 to-cyan-400 rounded-full shadow-2xl flex items-center justify-center z-10"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-white font-bold text-xl tracking-widest uppercase"
            >
              {phase}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isActive ? (
          <Button 
            onClick={() => setIsActive(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-8 py-6 text-lg gap-2"
          >
            <Play className="size-5" /> Start Exercise
          </Button>
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setIsActive(false)} 
            className="rounded-full px-8 py-6 text-lg gap-2 border-slate-200"
          >
            <RotateCcw className="size-5" /> Reset
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 text-slate-400 animate-pulse">
        <Wind className="size-4" />
        <span className="text-sm">Follow the circle to regulate your heartbeat.</span>
      </div>
    </div>
  );
};

export default Breathing;