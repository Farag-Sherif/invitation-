import { motion } from 'framer-motion';
import { Building, Map, ExternalLink } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import { useWeddingData } from '../context/WeddingDataContext';

export default function VenueSection() {
  const [sectionRef, isRevealed] = useScrollReveal();
  const { venueName, venueDescription, venueAddress, mapUrl, mapLat, mapLng } = useWeddingData();

  const getIframeSrc = () => {
    if (mapUrl && mapUrl.includes('<iframe') && mapUrl.includes('src="')) {
      const match = mapUrl.match(/src="([^"]+)"/);
      if (match) return match[1];
    }
    if (mapUrl && mapUrl.includes('google.com/maps/embed')) {
      return mapUrl;
    }
    if (mapLat && mapLng && !mapUrl) {
      return `https://maps.google.com/maps?q=${mapLat},${mapLng}&z=14&output=embed`;
    }
    if (venueAddress) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(venueAddress)}&z=14&output=embed`;
    }
    if (venueName) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(venueName)}&z=14&output=embed`;
    }
    return '';
  };

  const getLinkToOpen = () => {
    if (mapUrl && !mapUrl.includes('<iframe')) return mapUrl;
    if (mapLat && mapLng) return `https://maps.google.com/?q=${mapLat},${mapLng}`;
    if (venueAddress) return `https://maps.google.com/?q=${encodeURIComponent(venueAddress)}`;
    if (venueName) return `https://maps.google.com/?q=${encodeURIComponent(venueName)}`;
    return null;
  };

  const iframeSrc = getIframeSrc();
  const linkToOpen = getLinkToOpen();

  const openMap = () => {
    if (linkToOpen) {
      window.open(linkToOpen, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="venue"
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
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <span className="section-kicker">مكان الاحتفال</span>
        <h2 className="section-title">موقع وقاعة حفل الزفاف</h2>
      </motion.div>

      {/* Grid of Content & Map */}
      <div
        className="venue-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1000px',
          width: '100%',
          padding: '0 1rem'
        }}
      >
        {/* Info panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isRevealed ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="glass-premium"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-card)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'var(--color-card)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.5rem'
          }}
        >
          <div className="flex items-center gap-3 text-gold-foil">
            <Building size={28} />
            <h3 className="font-amiri text-2xl font-bold" style={{ color: 'var(--color-accent)', margin: 0 }}>
              {venueName}
            </h3>
          </div>

          <p className="font-tajawal" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0 }}>
            {venueDescription}
          </p>

          <div
            style={{
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <span className="font-tajawal text-xs text-white/50">العنوان بالتفصيل</span>
            <strong className="font-tajawal text-sm text-white">{venueAddress}</strong>
          </div>

          <button
            onClick={openMap}
            className="secondary-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '0.8rem',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-primary)',
              background: 'rgba(201, 168, 76, 0.05)',
              color: 'var(--color-primary)',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            <Map size={18} />
            <span>فتح عبر خرائط Google</span>
            <ExternalLink size={14} />
          </button>
        </motion.div>

        {/* Map visual iframe embed panel */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isRevealed ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glass-premium"
          style={{
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'var(--color-card)',
            boxShadow: '0 16px 36px rgba(0,0,0,0.2)',
            height: '400px'
          }}
        >
          <iframe
            title="موقع القاعة على Google Maps"
            src={iframeSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              filter: 'grayscale(0.6) contrast(1.1) invert(0.9) hue-rotate(180deg)' // Elegant dark overlay filter
            }}
          />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .venue-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
