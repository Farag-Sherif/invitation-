import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import { useWeddingData } from '../context/WeddingDataContext';

export default function GallerySection() {
  const [sectionRef, isRevealed] = useScrollReveal();
  const { galleryImages = [], updateWeddingData } = useWeddingData();
  const [activeImage, setActiveImage] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    // Needed for Firefox support
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Rearrange array temporarily during hover for dynamic visual feedback
    const reordered = [...galleryImages];
    const item = reordered.splice(draggedIndex, 1)[0];
    reordered.splice(index, 0, item);
    
    setDraggedIndex(index);
    updateWeddingData({ galleryImages: reordered });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Lightbox navigation
  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = galleryImages.findIndex(img => img.id === activeImage.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[prevIndex]);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = galleryImages.findIndex(img => img.id === activeImage.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setActiveImage(galleryImages[nextIndex]);
  };


  return (
    <section
      ref={sectionRef}
      id="gallery"
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
        <span className="section-kicker">ألبوم الذكريات</span>
        <h2 className="section-title">فصول من قصة حبنا المباركة</h2>
        <p className="font-tajawal text-xs text-white/50 mt-2">
          * يمكنك سحب وإفلات الصور لإعادة ترتيب الألبوم حسب ذوقك الخاص 💡
        </p>
      </motion.div>

      {/* Masonry Layout grid container */}
      <div
        className="gallery-masonry"
        style={{
          columnCount: 3,
          columnGap: '1.5rem',
          maxWidth: '1000px',
          width: '100%',
          padding: '0 1rem'
        }}
      >
        {galleryImages.map((img, index) => {
          // Height aspect classes
          let heightVal = '220px';
          if (img.aspect === 'portrait') heightVal = '320px';
          if (img.aspect === 'square') heightVal = '260px';

          return (
            <motion.div
              key={img.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, y: 30 }}
              animate={isRevealed ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="gallery-item-card glass-premium hover-scale"
              style={{
                breakInside: 'avoid',
                marginBottom: '1.5rem',
                borderRadius: 'var(--radius-card)',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'var(--color-card)',
                cursor: 'grab',
                opacity: draggedIndex === index ? 0.4 : 1,
                transition: 'opacity 0.2s, border-color 0.3s, transform 0.3s'
              }}
            >
              {/* Drag Handle Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  zIndex: 3,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  opacity: 0,
                  transition: 'opacity 0.3s'
                }}
                className="drag-handle-badge"
              >
                <GripVertical size={14} />
              </div>

              {/* Action Zoom Button Overlay */}
              <button
                onClick={() => setActiveImage(img)}
                aria-label="توسيع الصورة"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  zIndex: 3,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  opacity: 0,
                  transition: 'opacity 0.3s'
                }}
                className="zoom-action-badge"
              >
                <Maximize2 size={14} />
              </button>

              {/* Main Image */}
              <div style={{ width: '100%', height: heightVal, overflow: 'hidden' }}>
                <img
                  src={img.src}
                  alt={img.label}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s'
                  }}
                  className="gallery-img-tag"
                />
              </div>

              {/* Label overlay banner */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  insetInline: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  padding: '1.25rem 1rem 0.75rem',
                  color: 'white',
                  textAlign: 'right',
                  zIndex: 2
                }}
              >
                <h4 className="font-amiri" style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                  {img.label}
                </h4>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Fullscreen Viewer */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(4, 7, 15, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              padding: '2rem'
            }}
            onClick={() => setActiveImage(null)}
          >
            {/* Close action */}
            <button
              onClick={() => setActiveImage(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {/* Prev Image */}
            <button
              onClick={handlePrev}
              style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Next Image */}
            <button
              onClick={handleNext}
              style={{
                position: 'absolute',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <ChevronLeft size={20} />
            </button>

            {/* Fullscreen Image Card */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              style={{
                position: 'relative',
                maxWidth: '800px',
                width: '100%',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage.src}
                alt={activeImage.label}
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
                }}
              />
              <h3
                className="font-amiri"
                style={{
                  color: 'var(--color-accent)',
                  marginTop: '1.5rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                {activeImage.label}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-item-card:hover .drag-handle-badge,
        .gallery-item-card:hover .zoom-action-badge {
          opacity: 1 !important;
        }
        .gallery-item-card:hover .gallery-img-tag {
          transform: scale(1.045);
        }
        @media (max-width: 900px) {
          .gallery-masonry { column-count: 2 !important; }
        }
        @media (max-width: 500px) {
          .gallery-masonry { column-count: 1 !important; }
        }
      `}</style>
    </section>
  );
}
