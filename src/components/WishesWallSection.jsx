import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, HeartCrack, Check } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import { postToWebhook } from '../utils/dataStore';
import { useWeddingData } from '../context/WeddingDataContext';

const DEFAULT_WISHES = [
  {
    id: 'w1',
    name: 'عائلة أبو محمد',
    message: 'ألف مبروك لأجمل عروسين محمد وفاطمة! جمع الله بينكما في خير ورزقكما السعادة الدائمة والذرية الصالحة.',
    style: 'gold',
    date: 'منذ يوم'
  },
  {
    id: 'w2',
    name: 'عائلة أبو فاطمة',
    message: 'دامت أفراحكم عامرة بالحب والبهجة والسرور! تمنياتنا لكما بحياة زوجية سعيدة وهنيئة ملؤها الرضا والطمأنينة.',
    style: 'rose',
    date: 'منذ ساعات'
  },
  {
    id: 'w3',
    name: 'أختك سارة',
    message: 'مبارك لك يا فاطمة ومبارك لك يا محمد. تمنياتي القلبية لكما برحلة عمر ملؤها التفاهم والسلام والسكينة والبيت المعمور.',
    style: 'starlight',
    date: 'الآن'
  }
];

export default function WishesWallSection() {
  const [sectionRef, isRevealed] = useScrollReveal();
  const { wishes = DEFAULT_WISHES, saveWish } = useWeddingData();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [cardStyle, setCardStyle] = useState('gold'); // 'gold', 'rose', 'starlight'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newWish = {
      name: name.trim(),
      message: message.trim(),
      style: cardStyle,
      date: 'الآن'
    };

    // Save to central context
    saveWish(newWish);

    // Send payload to Google Sheets Webhook
    postToWebhook({
      type: 'تهنئة وأمنية',
      name: newWish.name,
      status: '-',
      guests: '0',
      message: newWish.message,
      timestamp: new Date().toLocaleString('ar-EG')
    });

    // Reset fields
    setName('');
    setMessage('');
  };

  return (
    <section
      ref={sectionRef}
      id="wishes-wall"
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
        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
      >
        <span className="section-kicker">جدار الأمنيات</span>
        <h2 className="section-title">تهاني وأمنيات المهنئين المباركة</h2>
        <p className="font-tajawal text-xs text-white/50 mt-2">
          شارك العروسين أمنياتك ودعواتك الطيبة وسجل حضورك على الجدار التفاعلي ✨
        </p>
      </motion.div>

      {/* Grid container layout */}
      <div
        className="wishes-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1100px',
          width: '100%',
          padding: '0 1rem',
          alignItems: 'start'
        }}
      >
        {/* Form component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="glass-premium"
          style={{
            padding: '2.2rem',
            borderRadius: 'var(--radius-card)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'var(--color-card)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 20px 48px rgba(0,0,0,0.2)'
          }}
        >
          <h3 className="font-amiri text-lg font-bold text-white mb-1">
            أرسل تمنياتك الطيبة
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Input Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="font-tajawal text-[11px] font-bold text-white/60">اسم المهنئ</label>
              <input
                type="text"
                required
                placeholder="اكتب اسمك الكريم هنا"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-family)',
                  transition: 'all 0.3s'
                }}
                className="wish-input"
              />
            </div>

            {/* Message Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="font-tajawal text-[11px] font-bold text-white/60">رسالة التهنئة والبركة</label>
              <textarea
                required
                rows="3"
                placeholder="اكتب أمنياتك ودعواتك للعروسين..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.85rem',
                  fontFamily: 'var(--font-family)',
                  resize: 'none',
                  transition: 'all 0.3s'
                }}
                className="wish-input"
              />
            </div>

            {/* Select Style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="font-tajawal text-[11px] font-bold text-white/60">تزيين الكارت</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setCardStyle('gold')}
                  className={`wish-style-btn ${cardStyle === 'gold' ? 'active' : ''}`}
                  style={{
                    padding: '0.6rem 0',
                    borderRadius: '8px',
                    border: '1px solid ' + (cardStyle === 'gold' ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)'),
                    background: cardStyle === 'gold' ? 'rgba(201, 168, 76, 0.1)' : 'transparent',
                    color: cardStyle === 'gold' ? 'var(--color-primary)' : 'white',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  ذهب ملكي
                </button>
                <button
                  type="button"
                  onClick={() => setCardStyle('rose')}
                  className={`wish-style-btn ${cardStyle === 'rose' ? 'active' : ''}`}
                  style={{
                    padding: '0.6rem 0',
                    borderRadius: '8px',
                    border: '1px solid ' + (cardStyle === 'rose' ? 'var(--color-secondary)' : 'rgba(255,255,255,0.06)'),
                    background: cardStyle === 'rose' ? 'rgba(212, 112, 122, 0.1)' : 'transparent',
                    color: cardStyle === 'rose' ? 'var(--color-secondary)' : 'white',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  ورد الجوري
                </button>
                <button
                  type="button"
                  onClick={() => setCardStyle('starlight')}
                  className={`wish-style-btn ${cardStyle === 'starlight' ? 'active' : ''}`}
                  style={{
                    padding: '0.6rem 0',
                    borderRadius: '8px',
                    border: '1px solid ' + (cardStyle === 'starlight' ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)'),
                    background: cardStyle === 'starlight' ? 'rgba(249, 232, 185, 0.1)' : 'transparent',
                    color: cardStyle === 'starlight' ? 'var(--color-accent)' : 'white',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  بريق نجوم
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="primary-action"
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--color-primary)',
                color: 'var(--color-bg)',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '0.5rem'
              }}
            >
              <Sparkles size={16} />
              <span>نشر التهنئة على الجدار</span>
            </button>
          </form>
        </motion.div>

        {/* Wishes listing wall */}
        <div
          className="wishes-wall-grid"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            maxHeight: '440px',
            overflowY: 'auto',
            paddingLeft: '6px'
          }}
        >
          <AnimatePresence initial={false}>
            {wishes.map((w, index) => {
              // Custom borders & shadow based on cardStyle chosen
              let styleConfig = {
                border: '1px solid rgba(255,255,255,0.06)',
                shadow: 'rgba(0,0,0,0.25)',
                glowDot: 'transparent',
                accentColor: 'white'
              };
              if (w.style === 'gold') {
                styleConfig = {
                  border: '1px solid rgba(201, 168, 76, 0.25)',
                  shadow: 'rgba(201, 168, 76, 0.08)',
                  glowDot: 'var(--color-primary)',
                  accentColor: 'var(--color-primary)'
                };
              } else if (w.style === 'rose') {
                styleConfig = {
                  border: '1px solid rgba(212, 112, 122, 0.25)',
                  shadow: 'rgba(212, 112, 122, 0.08)',
                  glowDot: 'var(--color-secondary)',
                  accentColor: 'var(--color-secondary)'
                };
              } else if (w.style === 'starlight') {
                styleConfig = {
                  border: '1px solid rgba(249, 232, 185, 0.25)',
                  shadow: 'rgba(249, 232, 185, 0.08)',
                  glowDot: 'var(--color-accent)',
                  accentColor: 'var(--color-accent)'
                };
              }

              return (
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -15 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="glass-premium hover-glow"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-card)',
                    background: 'var(--color-card)',
                    backdropFilter: 'blur(12px)',
                    border: styleConfig.border,
                    boxShadow: `0 8px 24px ${styleConfig.shadow}`,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s'
                  }}
                >
                  {/* Glowing style ornament bullet */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: styleConfig.glowDot,
                      boxShadow: `0 0 10px ${styleConfig.glowDot}`
                    }}
                  />

                  {/* Header info */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 className="font-amiri" style={{ fontSize: '1.15rem', color: styleConfig.accentColor, margin: 0 }}>
                      {w.name}
                    </h4>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-family)' }}>
                      {w.date}
                    </span>
                  </div>

                  {/* Message body */}
                  <p
                    className="font-tajawal"
                    style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                      lineHeight: 1.7,
                      margin: 0
                    }}
                  >
                    {w.message}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .wish-input:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.12);
        }
        .wishes-wall-grid::-webkit-scrollbar {
          width: 4px;
        }
        .wishes-wall-grid::-webkit-scrollbar-track {
          background: transparent;
        }
        .wishes-wall-grid::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 99px;
        }
        @media (max-width: 768px) {
          .wishes-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
