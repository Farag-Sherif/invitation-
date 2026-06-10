import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Building, HeartHandshake } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import { useWeddingData } from '../context/WeddingDataContext';

function DetailCard({ icon: Icon, title, content, subContent, delay = 0 }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Coordinates relative to card center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Target rotation range (-10 to 10 deg)
    const factor = 15;
    const rX = -(y / (rect.height / 2)) * factor;
    const rY = (x / (rect.width / 2)) * factor;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="glass-premium"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.5rem 1.75rem',
        borderRadius: 'var(--radius-card)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'var(--color-card)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s',
        cursor: 'default',
        transformStyle: 'preserve-3d',
        minHeight: '260px'
      }}
    >
      {/* Icon frame */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(201, 168, 76, 0.06)',
          border: '1px solid rgba(201, 168, 76, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          marginBottom: '1.25rem',
          transform: 'translateZ(25px)'
        }}
      >
        <Icon size={24} />
      </div>

      <h3
        className="font-amiri"
        style={{
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: 'var(--color-accent)',
          margin: '0 0 10px',
          transform: 'translateZ(20px)'
        }}
      >
        {title}
      </h3>

      <p
        className="font-tajawal"
        style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#FFFFFF',
          margin: '0 0 6px',
          lineHeight: 1.4,
          transform: 'translateZ(15px)'
        }}
      >
        {content}
      </p>

      {subContent && (
        <span
          className="font-tajawal"
          style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.5)',
            transform: 'translateZ(10px)'
          }}
        >
          {subContent}
        </span>
      )}
    </motion.div>
  );
}

export default function WeddingDetailsSection() {
  const [sectionRef, isRevealed] = useScrollReveal();
  const { formattedDate, hijriDate, formattedTime, venueName, venueCity } = useWeddingData();

  const details = [
    {
      icon: Calendar,
      title: 'تاريخ الحفل',
      content: formattedDate,
      subContent: hijriDate
    },
    {
      icon: Clock,
      title: 'توقيت اللقاء',
      content: `ابتداءً من الساعة ${formattedTime}`,
      subContent: 'حضوركم بهجة لأرواحنا'
    },
    {
      icon: Building,
      title: 'قاعة الحفل',
      content: venueName,
      subContent: 'المكان مجهز بكامل الاحتياجات'
    },
    {
      icon: MapPin,
      title: 'العنوان والموقع',
      content: venueCity,
      subContent: 'اضغط على خريطة الموقع بالأسفل'
    },
    {
      icon: HeartHandshake,
      title: 'تأكيد الحضور',
      content: 'تأكيد الحضور ضروري',
      subContent: 'الرجاء تسجيل الرد بالأسفل'
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="details"
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
        <span className="section-kicker">تفاصيل الليلة</span>
        <h2 className="section-title">بطاقات تفاصيل حفل الزفاف</h2>
      </motion.div>

      {/* Grid of details cards */}
      <div
        className="details-grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.75rem',
          maxWidth: '1100px',
          width: '100%',
          padding: '0 1rem'
        }}
      >
        {details.map((item, index) => (
          <DetailCard
            key={item.title}
            icon={item.icon}
            title={item.title}
            content={item.content}
            subContent={item.subContent}
            delay={index * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
