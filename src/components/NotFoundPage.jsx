import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#0B0E17',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        direction: 'rtl',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Tajawal', sans-serif"
      }}
    >
      {/* Background elegant radial glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(201, 168, 76, 0.08) 0%, transparent 60%), radial-gradient(circle at 10% 10%, rgba(212, 112, 122, 0.05) 0%, transparent 40%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 
            'linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-premium"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '3.5rem 2.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(201, 168, 76, 0.2)',
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 32px 64px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Ornate Gold Icon */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut'
          }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15) 0%, rgba(212, 112, 122, 0.1) 100%)',
            border: '1.5px solid var(--color-primary, #C9A84C)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary, #C9A84C)',
            marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(201, 168, 76, 0.15)'
          }}
        >
          <AlertTriangle size={36} />
        </motion.div>

        {/* Text */}
        <h1
          className="font-amiri"
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#FFFFFF',
            margin: '0 0 10px',
            lineHeight: 1.4
          }}
        >
          الدعوة المطلوبة غير متوفرة
        </h1>
        
        <p
          style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.65)',
            lineHeight: 1.8,
            marginBottom: '2.5rem',
            maxWidth: '380px'
          }}
        >
          عذراً، الرابط الذي تحاول الوصول إليه غير صحيح، أو قد تكون هذه الدعوة قد تم إزالتها بواسطة المسؤول. يرجى التأكد من كتابة الرابط بشكل صحيح.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%'
          }}
        >
          <a
            href="/"
            className="primary-action shimmer-button"
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--color-primary, #C9A84C) 0%, var(--color-secondary, #D4707A) 100%)',
              color: '#0B0E17',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(201, 168, 76, 0.2)'
            }}
          >
            <Home size={16} />
            <span>العودة للرئيسية</span>
          </a>

          <a
            href="/admin"
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
            className="hover-glow"
          >
            <ArrowLeft size={16} />
            <span>لوحة تحكم المسؤول</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
