import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryPlay = () => {
      audio.muted = true;
      audio
        .play()
        .then(() => {
          audio.muted = false;
          setIsPlaying(true);
          setShowPrompt(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setShowPrompt(true);
        });
    };

    // حاول autoplay فوراً
    tryPlay();

    // لو فشل — استنى أي تفاعل
    const handleFirstInteraction = () => {
      if (audioRef.current?.paused) {
        tryPlay();
      }
    };

    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
    });
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setShowPrompt(true);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setShowPrompt(false);
        })
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 select-none"
      style={{ direction: "ltr" }}>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://serv100.albumaty.com/dl/sen/saad-elsoghyer/albums/7d-yshtry-2lb/Hatgawez.mp3"
        loop
        preload="auto"
      />

      {/* Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-premium"
            style={{
              direction: "rtl",
              borderRadius: "1rem",
              padding: "0.5rem 1rem",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--color-primary)",
            }}>
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "var(--color-secondary)" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "var(--color-secondary)" }}
              />
            </span>
            <span>اضغط لتشغيل الموسيقى الهادئة</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className="glass-premium"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
        {/* Rotating Ring */}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isPlaying
              ? { repeat: Infinity, duration: 8, ease: "linear" }
              : { duration: 0.5 }
          }
          className="absolute inset-1 rounded-full border border-dashed opacity-40"
          style={{ borderColor: "var(--color-primary)" }}
        />

        {/* Icon */}
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div
              key="volume-on"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              style={{ color: "var(--color-primary)" }}>
              <Volume2 size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="volume-off"
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -45 }}
              style={{ color: "var(--color-text)", opacity: 0.6 }}>
              <VolumeX size={22} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Notes */}
        {isPlaying && (
          <>
            <span
              className="absolute -top-1 -right-1 text-xs animate-bounce"
              style={{ animationDelay: "0.2s", color: "var(--color-primary)" }}>
              ♪
            </span>
            <span
              className="absolute -bottom-1 -left-1 text-xs animate-bounce"
              style={{
                animationDelay: "0.6s",
                color: "var(--color-secondary)",
              }}>
              ♫
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}
