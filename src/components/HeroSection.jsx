import { motion } from 'framer-motion';
import { useWeddingData } from '../context/WeddingDataContext';

export default function HeroSection({ onExplore }) {
  const { groomName, brideName, invitationText, coverImage } = useWeddingData();
  const containerVariants = {

    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const nameVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section
      className="hero-section"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '2rem 1.5rem',
        direction: 'rtl'
      }}
    >
      {/* Cinematic Blurred Background image */}
      <div
        className="hero-bg-frame"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('${coverImage || '/images/couple.png'}')`,
          backgroundPosition: 'center 35%',
          backgroundSize: 'cover',
          opacity: 0.12,
          filter: 'scale(1.05) blur(2px)',
          zIndex: 0
        }}
      />

      {/* Radial lighting mask over background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle, transparent 20%, var(--color-bg) 80%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Main Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '800px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}
      >
        {/* Cinematic Monogram / Subtitle */}
        <motion.div variants={itemVariants} className="modern-chip" style={{ fontSize: '0.8rem', letterSpacing: '3px' }}>
          ✨ دَعْوَة زَفَاف مَلَكِيَّة ✨
        </motion.div>

        {/* Ornate upper border decoration */}
        <motion.div
          variants={itemVariants}
          style={{ width: '120px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)', margin: '0.5rem 0' }}
        />

        {/* Bride & Groom names in Arabic typography */}
        <motion.div variants={nameVariants} className="hero-names-wrapper" style={{ margin: '1.5rem 0' }}>
          <h1
            className="font-amiri"
            style={{
              fontSize: 'clamp(3rem, 9vw, 5.5rem)',
              fontWeight: '700',
              lineHeight: 1.15,
              background: 'linear-gradient(135deg, #FFF, var(--color-accent) 45%, var(--color-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 15px 45px rgba(201, 168, 76, 0.15)',
              margin: 0
            }}
          >
            {groomName} <span className="font-playfair" style={{ fontStyle: 'italic', fontSize: '0.8em', margin: '0 0.2em', color: 'var(--color-secondary)', WebkitTextFillColor: 'initial', background: 'none' }}>&</span> {brideName}
          </h1>
        </motion.div>

        {/* Formal Invitation Message */}
        <motion.p
          variants={itemVariants}
          className="font-amiri"
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '560px',
            lineHeight: 1.8,
            margin: '0 auto',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            fontStyle: 'italic'
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ <br />
          "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
        </motion.p>

        {/* Subtitle invitation text */}
        <motion.p
          variants={itemVariants}
          className="font-tajawal"
          style={{
            fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
            color: 'rgba(255, 255, 255, 0.55)',
            maxWidth: '480px',
            letterSpacing: '1px',
            lineHeight: 1.8
          }}
        >
          {invitationText}
        </motion.p>


        {/* Ornate lower border decoration */}
        <motion.div
          variants={itemVariants}
          style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)', margin: '0.5rem 0' }}
        />

        {/* CTA "View Invitation" Button */}
        <motion.div variants={itemVariants} style={{ marginTop: '2.5rem' }}>
          <button
            onClick={onExplore}
            className="primary-action shimmer-button"
            style={{
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              fontSize: '0.9rem',
              letterSpacing: '1px',
              padding: '0.85rem 2.2rem',
              borderRadius: 'var(--radius-card)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              border: 'none',
              color: 'var(--color-bg)',
              fontWeight: 'bold',
              boxShadow: '0 8px 32px rgba(201, 168, 76, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>استعراض تفاصيل الدعوة</span>
            <span style={{ transform: 'rotate(-90deg)', display: 'inline-block' }}>←</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Guidance arrow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 10 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '30px',
          zIndex: 2,
          color: 'var(--color-primary)',
          fontSize: '1.25rem',
          cursor: 'pointer'
        }}
        onClick={onExplore}
      >
        ↓
      </motion.div>
    </section>
  );
}
