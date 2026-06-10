import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  
  // Custom spring physics for smooth interpolation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 10000,
        boxShadow: '0 2px 12px rgba(201, 168, 76, 0.3)'
      }}
    />
  );
}
