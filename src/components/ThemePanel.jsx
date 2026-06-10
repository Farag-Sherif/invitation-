import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, RotateCcw } from 'lucide-react';

const FONTS = [
  { name: 'تاجوال (عصري)', value: "'Tajawal', sans-serif" },
  { name: 'أميري (كلاسيكي)', value: "'Amiri', serif" },
  { name: 'Cormorant (فاخر)', value: "'Cormorant Garamond', serif" },
  { name: 'Cinzel (ملكي)', value: "'Cinzel', serif" },
  { name: 'Alex Brush (رومانسي)', value: "'Alex Brush', cursive" }
];

export default function ThemePanel({ theme, updateField, resetTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  // Load saved Webhook URL on mount
  useEffect(() => {
    const savedUrl = localStorage.getItem('wedding-webhook-url') || '';
    setWebhookUrl(savedUrl);
  }, []);

  const handleWebhookChange = (val) => {
    setWebhookUrl(val);
    localStorage.setItem('wedding-webhook-url', val);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-panel-toggle"
        aria-label="تعديل الثيم"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: 'var(--color-bg)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {isOpen ? <X size={24} /> : <Settings className="animate-spin-slow" size={24} />}
        </motion.div>
      </button>

      {/* Slide-out Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="theme-panel-content glass-premium"
            initial={{ opacity: 0, x: 320 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 320 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              bottom: '96px',
              width: '320px',
              zIndex: 9998,
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(11, 14, 23, 0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              overflowY: 'auto',
              direction: 'rtl'
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-amiri text-xl font-bold text-white flex items-center gap-2">
                لوحة التحكم الإبداعية
              </h3>
              <button
                onClick={resetTheme}
                title="إعادة ضبط الافتراضي"
                className="text-white/60 hover:text-white transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Customization controls */}
            <div className="flex flex-col gap-4">
              {/* Color pickers */}
              <div className="flex flex-col gap-3">
                <span className="font-tajawal text-xs font-bold text-white/55">ألوان بطاقة الدعوة</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white/70 font-bold">اللون الرئيسي</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => updateField('primaryColor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white/70 font-bold">اللون الثانوي</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={theme.secondaryColor}
                        onChange={(e) => updateField('secondaryColor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white/70 font-bold">لون الإضاءة (Accent)</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => updateField('accentColor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-white/70 font-bold">لون الخلفية</label>
                    <div className="color-picker-wrapper">
                      <input
                        type="color"
                        value={theme.backgroundColor}
                        onChange={(e) => updateField('backgroundColor', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-white/70 font-bold">لون النصوص</label>
                  <div className="color-picker-wrapper w-full">
                    <input
                      type="color"
                      value={theme.textColor}
                      onChange={(e) => updateField('textColor', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Sliders */}
              <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
                <span className="font-tajawal text-xs font-bold text-white/55">تفاصيل وخصائص</span>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-white/70 font-bold">
                    <span>حجم حواف الكروت</span>
                    <span>{theme.borderRadius}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    step="2"
                    value={parseInt(theme.borderRadius) || 0}
                    onChange={(e) => updateField('borderRadius', `${e.target.value}px`)}
                    className="slider-input"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] text-white/70 font-bold">
                    <span>سرعة الحركة والأنيميشن</span>
                    <span>{theme.animationSpeed}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.15"
                    value={parseFloat(theme.animationSpeed) || 1}
                    onChange={(e) => updateField('animationSpeed', e.target.value)}
                    className="slider-input"
                  />
                </div>
              </div>

              {/* Font selector */}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                <label className="font-tajawal text-xs font-bold text-white/55">نوع الخط الرئيسي</label>
                <select
                  value={theme.fontFamily}
                  onChange={(e) => updateField('fontFamily', e.target.value)}
                  className="theme-select-input"
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Card Color transparency picker */}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
                <label className="font-tajawal text-xs font-bold text-white/55">تأثير الزجاج (Opacity)</label>
                <select
                  value={theme.cardColor}
                  onChange={(e) => updateField('cardColor', e.target.value)}
                  className="theme-select-input"
                >
                  <option value="rgba(255, 255, 255, 0.02)">زجاجي ناعم شفاف (2%)</option>
                  <option value="rgba(255, 255, 255, 0.05)">زجاجي متوازن (5%)</option>
                  <option value="rgba(255, 255, 255, 0.1)">زجاجي قوي (10%)</option>
                  <option value="rgba(255, 255, 255, 0.18)">زجاجي معتم (18%)</option>
                  <option value="rgba(11, 14, 23, 0.35)">زجاجي داكن (35%)</option>
                </select>
              </div>

              {/* Webhook Integration */}
              <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
                <span className="font-tajawal text-xs font-bold text-white/55">ربط البيانات (Webhook)</span>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-white/70 font-bold">رابط Google Sheets Webhook</label>
                  <input
                    type="text"
                    placeholder="https://script.google.com/macros/..."
                    value={webhookUrl}
                    onChange={(e) => handleWebhookChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '10px',
                      direction: 'ltr',
                      fontFamily: 'sans-serif'
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
