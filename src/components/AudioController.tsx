import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { CONFIG } from '../config';

interface AudioControllerProps {
  playTrigger: boolean;
}

/**
 * Provides an optional calm romantic melody after user interaction.
 * Supports an external MP3 URL in CONFIG.musicUrl, and includes a built-in
 * polyphonic Web Audio API royal music-box / harp synthesizer fallback so
 * sound works immediately without external asset failures.
 */
export const AudioController: React.FC<AudioControllerProps> = ({
  playTrigger,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const hasAutoStartedRef = useRef(false);

  const stopSynth = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend().catch(() => {});
    }
  }, []);

  const startSynth = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Romantic royal harp arpeggio notes (A minor / F major7 / C major / E7 warm voicing)
      const chords = [
        [220.0, 261.63, 329.63, 440.0, 523.25],
        [174.61, 220.0, 261.63, 349.23, 440.0],
        [196.0, 246.94, 293.66, 392.0, 493.88],
        [164.81, 207.65, 246.94, 329.63, 392.0],
      ];
      let step = 0;

      const playNote = (freq: number, delaySec: number) => {
        if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
        const now = audioCtxRef.current.currentTime + delaySec;
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.032, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      };

      const triggerArpeggio = () => {
        const chord = chords[step % chords.length];
        chord.forEach((freq, idx) => {
          playNote(freq, idx * 0.28);
        });
        step += 1;
      };

      triggerArpeggio();
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(triggerArpeggio, 3200);
    } catch {
      // Ignore Web Audio restriction errors
    }
  }, []);

  const startMusic = useCallback(() => {
    if (CONFIG.musicUrl.trim()) {
      if (!audioElRef.current) {
        audioElRef.current = new Audio(CONFIG.musicUrl.trim());
        audioElRef.current.loop = true;
        audioElRef.current.volume = 0.45;
      }
      audioElRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          startSynth();
          setIsPlaying(true);
        });
    } else {
      startSynth();
      setIsPlaying(true);
    }
  }, [startSynth]);

  const stopMusic = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
    }
    stopSynth();
    setIsPlaying(false);
  }, [stopSynth]);

  useEffect(() => {
    if (playTrigger && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      startMusic();
    }
  }, [playTrigger, startMusic]);

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, [stopMusic]);

  const toggleAudio = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-label={isPlaying ? 'كتم الموسيقى' : 'تشغيل الموسيقى'}
      data-testid="audio-toggle-button"
      className="fixed top-5 left-5 z-40 w-11 h-11 rounded-full royal-glass-card flex items-center justify-center text-[#FBF5B7] hover:border-[#D4AF37] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 text-[#D4AF37]" />
      ) : (
        <VolumeX className="w-5 h-5 text-[#F7F3E8]/65" />
      )}
    </button>
  );
};
