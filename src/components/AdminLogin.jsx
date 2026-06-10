import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import * as db from '../utils/database';
import * as api from '../utils/api';

export default function AdminLogin({ onLogin, targetSlug, urlPhone }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (targetSlug) {
      if (!urlPhone) {
        setError('رابط غير صالح: رقم الهاتف مفقود');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
        return;
      }

      // Check user login using the backend API
      const loginRes = await api.checkUserLogin(urlPhone, password);
      if (loginRes.success) {
        // Verify if the user is linked to the current invitation
        let inv = await db.getInvitationBySlug(targetSlug);
        if (!inv) {
          const themeRes = await api.viewThemeBySlug(targetSlug);
          if (themeRes.success && themeRes.data) {
            inv = themeRes.data;
            await db.saveInvitation(inv);
          }
        }

        if (inv) {
          const matchesPhone = String(inv.phone) === String(urlPhone);
          // If API returns user data, we could also check userId
          const matchesUserId = loginRes.data && loginRes.data.user && String(inv.userId) === String(loginRes.data.user.id);
          
          if (!matchesPhone && !matchesUserId) {
            setError('هذا الحساب غير مصرح له بالدخول لهذه الدعوة');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 600);
            return;
          }
        } else {
          setError('الدعوة غير موجودة');
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
          return;
        }

        sessionStorage.setItem(`admin-authenticated-${targetSlug}`, 'true');
        onLogin();
      } else {
        setError(loginRes.error || 'رقم الهاتف أو كلمة المرور غير صحيحة');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
      }
    } else {
      // Global Admin Check
      let storedData;
      try {
        storedData = JSON.parse(localStorage.getItem('wedding-data') || '{}');
      } catch {
        storedData = {};
      }
      const correctPassword = storedData.adminPassword || 'admin123';

      if (password === correctPassword) {
        sessionStorage.setItem('admin-authenticated-global', 'true');
        onLogin();
      } else {
        setError('كلمة المرور غير صحيحة');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: '2rem',
        direction: 'rtl'
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(201, 168, 76, 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(212, 112, 122, 0.04) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '420px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <motion.form
          onSubmit={handleSubmit}
          animate={isShaking ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="glass-premium"
          style={{
            padding: '3rem 2.5rem',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.75rem',
            boxShadow: '0 32px 64px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Lock Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(212, 112, 122, 0.1))',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              boxShadow: '0 8px 32px rgba(201, 168, 76, 0.15)'
            }}
          >
            <Lock size={30} />
          </motion.div>

          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <h1
              className="font-amiri"
              style={{
                fontSize: '1.6rem',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px'
              }}
            >
              لوحة تحكم الدعوة
            </h1>
            <p
              className="font-tajawal"
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0
              }}
            >
              أدخل كلمة المرور للوصول إلى إعدادات الدعوة
            </p>
          </div>

          {/* Password Field */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label
              className="font-tajawal"
              style={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: 'rgba(255, 255, 255, 0.6)'
              }}
            >
              كلمة المرور
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.9rem 3rem 0.9rem 1.2rem',
                  borderRadius: '14px',
                  border: `1px solid ${error ? 'rgba(212, 112, 122, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-family)',
                  direction: 'ltr',
                  textAlign: 'center',
                  letterSpacing: showPassword ? 'normal' : '4px',
                  transition: 'all 0.3s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-tajawal"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-secondary)',
                  margin: 0,
                  textAlign: 'center'
                }}
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="primary-action"
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              color: 'var(--color-bg)',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 32px rgba(201, 168, 76, 0.25)'
            }}
          >
            <span>دخول لوحة التحكم</span>
            <ArrowLeft size={18} />
          </button>

          {/* Back to invitation link */}
          <a
            href="/"
            className="font-tajawal"
            style={{
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.4)',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.4)'}
          >
            ← العودة لصفحة الدعوة
          </a>
        </motion.form>
      </motion.div>
    </div>
  );
}
