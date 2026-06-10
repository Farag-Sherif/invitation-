import { motion } from 'framer-motion';
import useCountdown from '../hooks/useCountdown';
import useScrollReveal from '../hooks/useScrollReveal';
import { useWeddingData } from '../context/WeddingDataContext';

export default function CountdownSection() {
  const { weddingDateTime } = useWeddingData();
  const timeLeft = useCountdown(weddingDateTime);
  const [sectionRef, isRevealed] = useScrollReveal();


  const metrics = [
    { label: 'أيام', value: timeLeft.days },
    { label: 'ساعات', value: timeLeft.hours },
    { label: 'دقائق', value: timeLeft.minutes },
    { label: 'ثواني', value: timeLeft.seconds }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="countdown"
      style={{
        position: 'relative',
        width: '100%',
        padding: '5rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'rtl'
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <span className="section-kicker">العد التنازلي للحفل</span>
        <h2 className="section-title">الوقت المتبقي لليلة العمر</h2>
      </motion.div>

      {/* Grid of countdown dials */}
      <motion.div
        className="countdown-grid-container"
        variants={containerVariants}
        initial="hidden"
        animate={isRevealed ? 'visible' : 'hidden'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '1.5rem',
          maxWidth: '720px',
          width: '100%',
          padding: '0 1rem'
        }}
      >
        {metrics.map((m, index) => (
          <motion.div
            key={m.label}
            variants={itemVariants}
            className="glass-premium"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem 1.5rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'var(--color-card)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.2)',
              minHeight: '150px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Soft gold accent border at top of card */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: index % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)'
              }}
            />

            {/* Glowing inner shadow light */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(201, 168, 76, 0.06) 0%, transparent 60%)',
                pointerEvents: 'none'
              }}
            />

            {/* Numeric display */}
            <span
              className="font-cormorant"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 3.8rem)',
                fontWeight: '700',
                color: '#FFFFFF',
                lineHeight: 1.1,
                letterSpacing: '1px',
                textShadow: '0 8px 24px rgba(255, 255, 255, 0.08)'
              }}
            >
              {String(m.value).padStart(2, '0')}
            </span>

            {/* Label display */}
            <span
              className="font-tajawal"
              style={{
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: 'var(--color-primary)',
                marginTop: '10px',
                letterSpacing: '1px',
                opacity: 0.9
              }}
            >
              {m.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
