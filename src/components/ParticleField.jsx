import { useEffect, useRef } from 'react';

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const particleCount = 60;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Helper to get active theme color values from HTML root styles
    const getColors = () => {
      const style = window.getComputedStyle(document.documentElement);
      return {
        primary: style.getPropertyValue('--color-primary').trim() || '#C9A84C',
        secondary: style.getPropertyValue('--color-secondary').trim() || '#D4707A',
        accent: style.getPropertyValue('--color-accent').trim() || '#F9E8B9'
      };
    };

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Spread initially
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.6 + 0.2);
        this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.15;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.colorType = Math.random(); // 0 to 1 to pick theme colors
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.05;

        // If off screen, reset at bottom
        if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw(colors) {
        let baseColor = colors.accent;
        if (this.colorType < 0.3) {
          baseColor = colors.primary;
        } else if (this.colorType < 0.6) {
          baseColor = colors.secondary;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = this.alpha;
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = this.size * 3;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const activeColors = getColors();

      particles.forEach(p => {
        p.update();
        p.draw(activeColors);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.8
      }}
    />
  );
}
