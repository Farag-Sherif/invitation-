import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";

// Hook & Context imports
import { useWeddingData } from "./context/WeddingDataContext";

// Ambient / Interactive Component imports
import LoadingScreen from "./components/LoadingScreen";
import ParticleField from "./components/ParticleField";
import FloatingPetals from "./components/FloatingPetals";
import MouseGlow from "./components/MouseGlow";
import ScrollProgress from "./components/ScrollProgress";
import AudioPlayer from "./components/AudioPlayer";
import SectionDivider from "./components/SectionDivider";
import NotFoundPage from "./components/NotFoundPage";

// Section Component imports
import HeroSection from "./components/HeroSection";
import CountdownSection from "./components/CountdownSection";
import LoveStorySection from "./components/LoveStorySection";
import WeddingDetailsSection from "./components/WeddingDetailsSection";
import GallerySection from "./components/GallerySection";
import WishesWallSection from "./components/WishesWallSection";
import VenueSection from "./components/VenueSection";
import RSVPSection from "./components/RSVPSection";

// Admin Component imports
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [showOpening, setShowOpening] = useState(true);
  const { loadInvitation, loadDemoInvitation, isLoading, error } = useWeddingData();

  const location = useLocation();
  const path = location.pathname;

  // Extract query parameter for user phone
  const searchParams = new URLSearchParams(location.search);
  const urlPhone = searchParams.get("user");

  // Determine parts of the path
  const pathParts = path.split("/").filter(Boolean);

  // Is this the global admin page (starts with /admin)
  const isAdminRoute = path === "/admin" || path.startsWith("/admin?");

  // Is this the specific user admin page (/{slug}/admin)
  const isUserAdminRoute = pathParts.length === 2 && pathParts[1] === "admin";

  const isAdminFlow = isAdminRoute || isUserAdminRoute;

  // Determine active slug:
  // - /admin?user=...         → null (CREATE MODE)
  // - /{slug}/admin?user=...  → slug (UPDATE MODE)
  // - /{slug}                 → slug (PUBLIC VIEW)
  const parsedSlug = isAdminRoute
    ? null
    : pathParts.length > 0
      ? pathParts[0]
      : null;

  // Check authentication status
  const [authTrigger, setAuthTrigger] = useState(0);
  const isAuthenticated = (() => {
    if (isUserAdminRoute) {
      return (
        sessionStorage.getItem(`admin-authenticated-${parsedSlug}`) ===
          "true" || sessionStorage.getItem("admin-authenticated") === "true"
      );
    }
    if (isAdminRoute) {
      return (
        sessionStorage.getItem("admin-authenticated-global") === "true" ||
        sessionStorage.getItem("admin-authenticated") === "true"
      );
    }
    return false;
  })();

  // Sync active invitation based on URL slug or load demo for root
  useEffect(() => {
    if (parsedSlug && (!isAdminRoute || isUserAdminRoute)) {
      loadInvitation(parsedSlug);
    } else if (!parsedSlug && !isAdminRoute) {
      // This is the root route /
      loadDemoInvitation();
    }
    // CREATE MODE (isAdminRoute && !isUserAdminRoute): no slug, nothing to load
  }, [parsedSlug, isAdminRoute, isUserAdminRoute]);

  // Sync scroll lock or Lenis smooth scroll initialization
  useEffect(() => {
    if (isAdminFlow) {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      return;
    }

    if (showOpening) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [showOpening, isAdminFlow]);

  const handleExplore = () => {
    const nextSection = document.getElementById("countdown");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Admin flow: check authentication and render dashboard or login
  if (isAdminFlow) {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          targetSlug={isUserAdminRoute ? parsedSlug : null}
          urlPhone={urlPhone}
          onLogin={() => {
            setAuthTrigger((prev) => prev + 1);
          }}
        />
      );
    }
    return (
      <AdminDashboard
        singleInvitationMode={isUserAdminRoute}
        userEditSlug={isUserAdminRoute ? parsedSlug : null}
        onLogout={() => {
          sessionStorage.removeItem("admin-user-id");
          if (isUserAdminRoute) {
            sessionStorage.removeItem(`admin-authenticated-${parsedSlug}`);
            window.location.href = `/${parsedSlug}`;
          } else {
            sessionStorage.removeItem("admin-authenticated-global");
            sessionStorage.removeItem("admin-authenticated");
            window.location.href = "/admin";
          }
          setAuthTrigger((prev) => prev + 1);
        }}
      />
    );
  }

  // Show custom 404 page if error is NOT_FOUND
  if (error === "NOT_FOUND") {
    return <NotFoundPage />;
  }

  // Render a basic error message for unexpected errors
  if (error && error !== "NOT_FOUND") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0B0E17",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "2rem",
          textAlign: "center",
        }}>
        <h1
          className="font-amiri"
          style={{ fontSize: "2rem", color: "#D4707A" }}>
          خطأ في تحميل الدعوة
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>{error}</p>
        <button
          onClick={() => loadInvitation(parsedSlug)}
          style={{
            padding: "10px 20px",
            background: "var(--color-primary, #C9A84C)",
            border: "none",
            borderRadius: "8px",
            color: "#0B0E17",
            cursor: "pointer",
            fontWeight: "bold",
          }}>
          إعادة المحاولة
        </button>
      </div>
    );
  }

  // Public Invitation Page View
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
      }}>
      {/* Loading Screen Overlay */}
      <AnimatePresence>
        {(showOpening || isLoading) && (
          <LoadingScreen onComplete={() => setShowOpening(false)} />
        )}
      </AnimatePresence>

      {!showOpening && !isLoading && (
        <>
          {/* Scroll progress bar */}
          <ScrollProgress />

          {/* Ambient Animation & Particles layers */}
          <ParticleField />
          <FloatingPetals />
          <MouseGlow />

          {/* Audio sound synthesizer */}
          <AudioPlayer />

          {/* Layout Container */}
          <main style={{ position: "relative", zIndex: 10, width: "100%" }}>
            {/* 1. Cinematic Hero Intro */}
            <HeroSection onExplore={handleExplore} />
            <SectionDivider type="line-flower" />

            {/* 2. Countdown */}
            <CountdownSection />
            <SectionDivider type="ornamental" />

            {/* 3. Love Story Timeline */}
            <LoveStorySection />
            <SectionDivider type="line-flower" />

            {/* 4. Wedding Details Grid */}
            <WeddingDetailsSection />
            <SectionDivider type="ornamental" />

            {/* 5. Drag-reorder Gallery */}
            <GallerySection />
            <SectionDivider type="line-flower" />

            {/* 5.5 Wishes Wall */}
            <WishesWallSection />
            <SectionDivider type="ornamental" />

            {/* 6. Venue & Location map */}
            <VenueSection />
            <SectionDivider type="line-flower" />

            {/* 7. RSVP submission */}
            <RSVPSection />
          </main>
        </>
      )}
    </div>
  );
}
