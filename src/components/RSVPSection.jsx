import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MessageSquare, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import useScrollReveal from '../hooks/useScrollReveal';
import { postToWebhook } from '../utils/dataStore';
import { useWeddingData } from '../context/WeddingDataContext';

export default function RSVPSection() {
  const [sectionRef, isRevealed] = useScrollReveal();
  const { saveRSVP } = useWeddingData();
  const [guestName, setGuestName] = useState('');
  const [status, setStatus] = useState('yes'); // 'yes' or 'no'
  const [guestsCount, setGuestsCount] = useState('1');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const rsvpText = useMemo(() => {
    const attendance = status === 'yes' 
      ? `سأحضر الحفل بكل سرور (عدد المرافقين: ${guestsCount})` 
      : 'أعتذر عن الحضور لظروف خاصة، تمنياتي لكم بحياة زوجية سعيدة!';
    return encodeURIComponent(`مرحباً، أنا ${guestName || 'ضيف كريم'} - ${attendance}`);
  }, [guestName, status, guestsCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSubmitted(true);
    
    const rsvpData = {
      name: guestName.trim(),
      status,
      guestsCount: status === 'yes' ? guestsCount : '0',
      message: status === 'yes' ? 'سأحضر الحفل' : 'أعتذر عن الحضور'
    };

    // Save through context
    saveRSVP(rsvpData);

    // Post to external webhook
    postToWebhook({
      type: 'حضور الحفل',
      name: rsvpData.name,
      status: status === 'yes' ? 'حاضر' : 'معتذر',
      guests: rsvpData.guestsCount,
      message: rsvpData.message,
      timestamp: new Date().toLocaleString('ar-EG')
    });

    // Sparkle confetti effect on submission
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#C9A84C', '#D4707A', '#FFFFFF']
    });
  };

  return (
    <section
      ref={sectionRef}
      id="rsvp"
      style={{
        position: 'relative',
        width: '100%',
        padding: '5rem 1.5rem 8rem',
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
        <span className="section-kicker">تأكيد الحضور</span>
        <h2 className="section-title">شاركونا بهجة ليلة العمر</h2>
      </motion.div>

      {/* Main Form Box */}
      <div style={{ maxWidth: '520px', width: '100%', padding: '0 1rem' }}>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="rsvp-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isRevealed ? { opacity: 1, scale: 1 } : {}}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="glass-premium"
              style={{
                padding: '2.5rem',
                borderRadius: 'var(--radius-card)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'var(--color-card)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                boxShadow: '0 20px 48px rgba(0,0,0,0.2)'
              }}
            >
              {/* Name input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="font-tajawal text-xs font-bold text-white/70">الاسم الكريم *</label>
                <input
                  type="text"
                  required
                  placeholder="الرجاء كتابة اسمك الثلاثي"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.2rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-family)',
                    transition: 'all 0.3s'
                  }}
                  className="rsvp-input-field"
                />
              </div>

              {/* Status segmented buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="font-tajawal text-xs font-bold text-white/70">حالة الحضور</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setStatus('yes')}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid ' + (status === 'yes' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)'),
                      background: status === 'yes' ? 'rgba(201, 168, 76, 0.12)' : 'transparent',
                      color: status === 'yes' ? 'var(--color-primary)' : 'white',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    بكل سرور، سأحضر 👍
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('no')}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid ' + (status === 'no' ? 'var(--color-secondary)' : 'rgba(255, 255, 255, 0.1)'),
                      background: status === 'no' ? 'rgba(212, 112, 122, 0.12)' : 'transparent',
                      color: status === 'no' ? 'var(--color-secondary)' : 'white',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    أعتذر عن الحضور 😔
                  </button>
                </div>
              </div>

              {/* Guests Count Selector */}
              {status === 'yes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="font-tajawal text-xs font-bold text-white/70">عدد الحاضرين (شاملاً أنت)</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.2rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'var(--color-bg)',
                      color: 'white',
                      outline: 'none',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-family)',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="1">شخص واحد (أنا فقط)</option>
                    <option value="2">شخصين</option>
                    <option value="3">3 أشخاص</option>
                    <option value="4">4 أشخاص</option>
                    <option value="5">عائلة (5 أشخاص أو أكثر)</option>
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '1rem' }}>
                <button
                  type="submit"
                  className="primary-action"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'var(--color-primary)',
                    color: 'var(--color-bg)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.3s'
                  }}
                >
                  <Send size={16} />
                  <span>تأكيد داخل الدعوة</span>
                </button>

                <a
                  href={`https://wa.me/?text=${rsvpText}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.3s'
                  }}
                  className="whatsapp-rsvp-btn"
                >
                  <MessageSquare size={16} />
                  <span>إرسال عبر واتساب</span>
                </a>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="rsvp-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="glass-premium"
              style={{
                padding: '3rem 2.5rem',
                borderRadius: 'var(--radius-card)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'var(--color-card)',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.25rem',
                boxShadow: '0 20px 48px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ color: 'var(--color-primary)' }}>
                <CheckCircle2 size={56} />
              </div>

              <h3 className="font-amiri" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-accent)', margin: 0 }}>
                تم حفظ ردك بنجاح!
              </h3>

              <p className="font-tajawal" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0 }}>
                نشكرك جزيل الشكر على تسجيل حضورك. حضورك وتواجدك يسعدنا ويكمل فرحتنا في هذه الليلة الخاصة والمميزة.
              </p>

              <button
                onClick={() => setIsSubmitted(false)}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.6rem 2rem',
                  borderRadius: '99px',
                  border: '1px solid rgba(201, 168, 76, 0.3)',
                  background: 'transparent',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  transition: 'all 0.3s'
                }}
              >
                تعديل رد التأكيد
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .rsvp-input-field:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
        }
        .whatsapp-rsvp-btn:hover {
          background: rgba(37, 211, 102, 0.1) !important;
          border-color: rgb(37, 211, 102) !important;
          color: rgb(37, 211, 102) !important;
        }
      `}</style>
    </section>
  );
}
