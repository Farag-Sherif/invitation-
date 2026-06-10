import { motion } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { useWeddingData } from '../context/WeddingDataContext';

export default function LoveStorySection() {
  const { loveStory } = useWeddingData();
  const [sectionRef, isRevealed] = useScrollReveal();

  const lineVariants = {
    hidden: { height: 0 },
    visible: {
      height: '80%',
      transition: { duration: 1.8, ease: 'easeInOut' }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="story"
      style={{
        position: 'relative',
        width: '100%',
        padding: '5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        direction: 'rtl'
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <span className="section-kicker">قصة حبنا</span>
        <h2 className="section-title">رحلة القلوب وبداية الحكاية</h2>
      </motion.div>

      {/* Timeline core track */}
      <div
        style={{
          position: 'relative',
          maxWidth: '800px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Animated vertical centerline */}
        <motion.div
          variants={lineVariants}
          initial="hidden"
          animate={isRevealed ? 'visible' : 'hidden'}
          style={{
            position: 'absolute',
            top: '40px',
            bottom: '40px',
            width: '2px',
            background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            opacity: 0.35,
            zIndex: 0
          }}
        />

        {/* Story nodes */}
        {loveStory.map((item, index) => {
          const isEven = index % 2 === 0;


          return (
            <div
              key={item.year}
              style={{
                display: 'flex',
                justifyContent: isEven ? 'flex-start' : 'flex-end',
                width: '100%',
                marginBottom: '3rem',
                position: 'relative',
                zIndex: 1
              }}
            >
              {/* Timeline Center Bullet indicator */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={isRevealed ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: index * 0.25 + 0.3, type: 'spring' }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '28px',
                  transform: 'translateX(-50%)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--color-bg)',
                  border: '2px solid var(--color-primary)',
                  boxShadow: '0 0 16px var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  zIndex: 2
                }}
              >
                {item.icon}
              </motion.div>

              {/* Card wrapper */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                animate={isRevealed ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.9, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="glass-premium hover-glow"
                style={{
                  width: 'calc(50% - 30px)',
                  padding: '2rem',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'var(--color-card)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  textAlign: 'right',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
              >
                <span
                  className="font-playfair"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: 'var(--color-secondary)',
                    background: 'rgba(212, 112, 122, 0.1)',
                    padding: '3px 12px',
                    borderRadius: '99px',
                    display: 'inline-block',
                    marginBottom: '12px'
                  }}
                >
                  {item.year}
                </span>

                <h3
                  className="font-amiri"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    margin: '0 0 10px'
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="font-tajawal"
                  style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.65)',
                    lineHeight: 1.8,
                    margin: 0
                  }}
                >
                  {item.text}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* CSS-only Responsive responsive query fixes */}
      <style>{`
        @media (max-width: 768px) {
          #story .section-divider-container { margin: 2rem auto !important; }
          #story div[style*="justify-content"] {
            justify-content: flex-end !important;
            margin-right: 0 !important;
          }
          #story div[style*="width: calc(50% - 30px)"] {
            width: calc(100% - 48px) !important;
            margin-right: 48px !important;
          }
          #story div[style*="left: 50%"] {
            left: 16px !important;
            transform: none !important;
          }
          #story div[style*="width: 2px"] {
            left: 31px !important;
            right: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
