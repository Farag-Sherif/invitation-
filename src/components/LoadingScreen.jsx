import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 2800; // 2.8 seconds loading experience

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(nextProgress);

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          onComplete();
        }, 500); // Small pause for 100% completion effect
      }
    };

    requestAnimationFrame(step);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#04070F',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Background Pulse Glow */}
      <div
        className="glow-glow"
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)',
          filter: 'blur(32px)',
          opacity: 0.25 + (progress / 100) * 0.25,
          transform: 'scale(' + (1 + Math.sin(progress / 10) * 0.05) + ')',
          transition: 'opacity 0.2s, transform 0.2s',
          pointerEvents: 'none'
        }}
      />

      {/* 3D Heart Visual Stage */}
      <div
        style={{
          position: 'relative',
          perspective: '1000px',
          width: '180px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformStyle: 'preserve-3d'
        }}
      >
        <motion.div
          animate={{
            rotateY: [0, 15, -15, 0],
            rotateX: [0, 10, -10, 0],
            scale: [1, 1.06, 1.02, 1.06, 1]
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: 'easeInOut'
          }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Main Heart SVG with clip-path filling effect */}
          <svg
            width="140"
            height="140"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              filter: 'drop-shadow(0 8px 24px rgba(212, 112, 122, 0.45))',
              transform: 'translateZ(20px)'
            }}
          >
            {/* Background Empty Heart (Gold or white stroke outline) */}
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke="var(--color-primary)"
              strokeWidth="0.75"
              fill="rgba(255, 255, 255, 0.03)"
            />

            {/* Filled Heart (Filled from bottom to top using a clip path) */}
            <defs>
              <clipPath id="heartClip">
                <rect x="0" y={24 - (progress / 100) * 24} width="24" height="24" />
              </clipPath>
              <linearGradient id="heartGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-secondary)" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="url(#heartGradient)"
              clipPath="url(#heartClip)"
            />
          </svg>

          {/* Core glow light inside heart */}
          <div
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#FFF',
              filter: 'blur(4px)',
              transform: 'translateZ(25px)',
              opacity: 0.8
            }}
          />
        </motion.div>
      </div>

      {/* Percentage Progress Text */}
      <div
        className="font-playfair"
        style={{
          marginTop: '32px',
          fontSize: '2rem',
          fontWeight: 300,
          color: 'var(--color-primary)',
          letterSpacing: '2px',
          textShadow: '0 0 10px rgba(201, 168, 76, 0.25)'
        }}
      >
        {Math.round(progress)}%
      </div>

      {/* Ornate loading label */}
      <div
        className="font-amiri"
        style={{
          marginTop: '10px',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '1px',
          direction: 'rtl'
        }}
      >
        جاري تهيئة بطاقة الدعوة الفاخرة...
      </div>
    </motion.div>
  );
}
