import { useEffect, useState } from 'react';

export default function MouseGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on mobile/touch screens
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setIsVisible(true);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Eased follow effect using requestAnimationFrame
    let animId;
    const updatePosition = () => {
      const ease = 0.08; // smooth delay speed
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;
      setPosition({ x: currentX, y: currentY });
      animId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201, 168, 76, 0.04) 0%, rgba(201, 168, 76, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 2,
        transform: `translate3d(${position.x - 250}px, ${position.y - 250}px, 0)`,
        willChange: 'transform'
      }}
    />
  );
}
