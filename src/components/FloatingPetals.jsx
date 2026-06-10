import { useMemo } from 'react';

export default function FloatingPetals() {
  const petals = useMemo(() => {
    return Array.from({ length: 15 }).map((_, index) => {
      const size = Math.random() * 16 + 10; // 10px to 26px
      const left = Math.random() * 100; // start left position %
      const delay = Math.random() * -20; // negative delay to start mid-animation
      const duration = Math.random() * 15 + 15; // 15s to 30s
      const rotate = Math.random() * 360; // initial rotation angle
      const swing = Math.random() * 40 + 20; // swing horizontal distance px
      const isGold = Math.random() > 0.5; // gold leaf vs rose petal

      return {
        id: index,
        size,
        left,
        delay,
        duration,
        rotate,
        swing,
        isGold
      };
    });
  }, []);

  return (
    <div
      className="floating-petals-container"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal-element"
          style={{
            position: 'absolute',
            top: '-5%',
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.8}px`,
            opacity: 0.18,
            borderRadius: '50% 0 50% 50%',
            background: p.isGold ? 'var(--color-primary)' : 'var(--color-secondary)',
            transform: `rotate(${p.rotate}deg)`,
            animationName: 'petalFalling',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            willChange: 'transform, top, left',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            '--swing-dist': `${p.swing}px`
          }}
        />
      ))}
    </div>
  );
}
