import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../utils/api";

const WeddingDataContext = createContext(null);

const DEFAULT_THEME = {
  primaryColor: "#C9A84C",
  secondaryColor: "#D4707A",
  accentColor: "#B8936A",
  backgroundColor: "#0B0E17",
  textColor: "#FFFFFF",
  cardColor: "#12151F",
  animationSpeed: 1,
  borderRadius: "16px",
  fontFamily: "'Tajawal', sans-serif",
};

export function WeddingDataProvider({ children }) {
  const [activeInvitation, setActiveInvitation] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [allInvitations, setAllInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const activeSlug = activeInvitation?.slug ?? "";

  useEffect(() => {
    fetchAllInvitations();
  }, []);

  useEffect(() => {
    if (activeInvitation?.theme) {
      applyTheme(activeInvitation.theme);
    }
  }, [activeInvitation]);

  const fetchAllInvitations = async () => {
    try {
      const res = await api.getAllInvitationsFromServer();
      if (res.success) setAllInvitations(res.data);
    } catch (err) {
      console.error("Failed to load all invitations listing:", err);
    }
  };

  const loadInvitation = async (slug) => {
    if (!slug) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    console.log(`[Context] Loading invitation slug: "${slug}"`);
    try {
      const res = await api.viewThemeBySlug(slug);
      if (res.success) {
        setActiveInvitation(res.data);

        const wishesRes = await api.getWishesForSlug(slug);
        if (wishesRes.success) setWishes(wishesRes.data);

        const rsvpsRes = await api.getRSVPsForSlug(slug);
        if (rsvpsRes.success) setRsvps(rsvpsRes.data);
      } else {
        setError("NOT_FOUND");
        setActiveInvitation(null);
      }
    } catch (err) {
      console.error("[Context] Unexpected error loading invitation:", err);
      setError(err.message || "حدث خطأ غير متوقع");
      setActiveInvitation(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoInvitation = () => {
    setIsLoading(true);
    setError(null);
    console.log(`[Context] Loading DEMO invitation`);
    const demoData = {
      slug: "demo",
      groomName: "أحمد",
      brideName: "سارة",
      weddingDate: "2026-10-15",
      weddingTime: "20:30",
      hijriDate: "1448-04-05",
      invitationText: "تغمرنا السعادة بدعوتكم لمشاركتنا فرحة العمر وتتويج قصة حبنا في ليلة من ألف ليلة وليلة.",
      venueName: "قاعة الماسة الذهبية",
      venueCity: "الرياض",
      venueAddress: "فندق الريتز كارلتون",
      venueDescription: "ننتظركم في قاعة الماسة الذهبية للاحتفال معنا وسط أجواء من البهجة والسرور.",
      mapUrl: "https://maps.app.goo.gl/Wq4xX3d8xS9xY4Q8",
      loveStory: [
        { year: "2023", title: "اللقاء الأول", text: "صدفة جميلة جمعت بين قلبينا لتبدأ أجمل حكاية.", icon: "Heart" },
        { year: "2024", title: "الخطوبة", text: "في ليلة عائلية دافئة، تعاهدنا على السير معاً في دروب الحياة.", icon: "Ring" },
        { year: "2026", title: "الزفاف", text: "اليوم نجتمع لنعلن بداية رحلتنا الأبدية محاطين بأحبابنا.", icon: "Star" }
      ],
      galleryImages: [
        { id: "1", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop", label: "لحظات لا تنسى" },
        { id: "2", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop", label: "الحب يجمعنا" },
        { id: "3", src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop", label: "يوم زفافنا" }
      ],
      videos: [],
      rsvpSettings: { enabled: true },
      customSections: [],
      theme: DEFAULT_THEME,
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    };
    setActiveInvitation(demoData);
    setWishes([
      { id: "1", name: "محمد وعائلته", message: "ألف مبروك للعروسين، بالرفاء والبنين إن شاء الله." },
      { id: "2", name: "صديقات العروسة", message: "سعداء جداً من أجلك يا سارة، نتمنى لكما حياة مليئة بالحب والسعادة." }
    ]);
    setRsvps([]);
    setIsLoading(false);
  };

  const handleCreateInvitation = async (invitationData) => {
    try {
      const newInvitation = {
        groomName: invitationData.groomName || "",
        brideName: invitationData.brideName || "",
        weddingDate: invitationData.weddingDate || "",
        weddingTime: invitationData.weddingTime || "",
        hijriDate: invitationData.hijriDate || "",
        invitationText:
          invitationData.invitationText ||
          "يتشرف أولياء الأمور بدعوتكم لحضور حفل الزفاف الميمون ومشاركتنا بهجة العمر وليلة الميثاق الغليظ.",
        venueName: invitationData.venueName || "",
        venueCity: invitationData.venueCity || "",
        venueAddress: invitationData.venueAddress || "",
        venueDescription: invitationData.venueDescription || "",
        mapUrl: invitationData.mapUrl || "",
        loveStory: invitationData.loveStory || [],
        galleryImages: invitationData.galleryImages || [],
        videos: invitationData.videos || [],
        rsvpSettings: invitationData.rsvpSettings || { enabled: true },
        customSections: invitationData.customSections || [],
        theme: invitationData.theme || DEFAULT_THEME,
        coverImage: invitationData.coverImage || "",
        slug: invitationData.slug,
        userId: invitationData.userId,
        themeId: invitationData.themeId || "4",
        email: invitationData.email || "",
        phone: invitationData.phone || "",
        title:
          invitationData.title ||
          `${invitationData.groomName} & ${invitationData.brideName}`,
      };

      const res = await api.createOrUpdateInvitationOnServer(newInvitation);
      if (res.success) {
        if (res.data?.theme?.id) {
          newInvitation.externalThemeId = res.data.theme.id;
          if (res.data.theme.user_id)
            newInvitation.userId = res.data.theme.user_id;
        }
        await fetchAllInvitations();
        return { success: true, data: newInvitation };
      } else {
        return { success: false, error: res.error };
      }
    } catch (e) {
      console.error("[Context] Create invitation error:", e);
      return { success: false, error: e.message };
    }
  };

  const handleUpdateInvitation = async (slug, updates) => {
    try {
      if (!activeInvitation) throw new Error("لم يتم تحميل الدعوة");

      const merged = { ...activeInvitation, ...updates };

      const res = await api.createOrUpdateInvitationOnServer(merged);
      if (res.success) {
        if (res.data?.theme?.id) {
          merged.externalThemeId = res.data.theme.id;
          if (res.data.theme.user_id) merged.userId = res.data.theme.user_id;
        }
        setActiveInvitation(merged);
        await fetchAllInvitations();
        return { success: true, data: merged };
      } else {
        return { success: false, error: res.error };
      }
    } catch (err) {
      console.error("[Context] Update Invitation error:", err);
      return { success: false, error: err.message };
    }
  };

  const handlePublishInvitation = async (slug) => {
    return handleUpdateInvitation(slug, {});
  };

  const handleDeleteInvitation = async (slug) => {
    try {
      await api.deleteInvitation(slug);
      if (slug === activeSlug) setActiveInvitation(null);
      await fetchAllInvitations();
      return { success: true };
    } catch (err) {
      console.error("[Context] Delete invitation error:", err);
      return { success: false, error: err.message };
    }
  };

  const handleBulkUploadInvitations = async (invitationsArray) => {
    let successCount = 0;
    let errors = [];
    for (const inv of invitationsArray) {
      try {
        const res = await api.createOrUpdateInvitationOnServer(inv);
        if (res.success) {
          successCount++;
        } else {
          errors.push(`${inv.slug}: ${res.error}`);
        }
      } catch (err) {
        errors.push(`${inv.slug}: ${err.message}`);
      }
    }
    await fetchAllInvitations();
    if (errors.length > 0) {
      return {
        success: successCount > 0,
        error: `تم رفع ${successCount} دعوة. فشل رفع: ${errors.join(", ")}`,
      };
    }
    return { success: true };
  };

  const handleSaveRSVP = async (rsvpData) => {
    try {
      if (activeInvitation?.externalThemeId) {
        const res = await api.addRSVP({
          themeId: activeInvitation.externalThemeId,
          name: rsvpData.name,
          email: rsvpData.email || "",
          guests: rsvpData.guestsCount || "1",
          events: rsvpData.events || "test",
          message: rsvpData.message || "",
        });
        if (res.success) {
          const saved = { ...rsvpData, id: Date.now().toString() };
          setRsvps((prev) => [saved, ...prev]);
          return { success: true, data: saved };
        }
        return { success: false, error: res.error };
      }
      return { success: false, error: "الدعوة غير منشورة على السيرفر" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const handleSaveWish = async (wishData) => {
    try {
      if (activeInvitation?.externalThemeId) {
        const res = await api.addComment({
          themeId: activeInvitation.externalThemeId,
          name: wishData.name,
          comment: wishData.message,
        });
        if (res.success) {
          const saved = { ...wishData, id: Date.now().toString() };
          setWishes((prev) => [saved, ...prev]);
          return { success: true, data: saved };
        }
        return { success: false, error: res.error };
      }
      return { success: false, error: "الدعوة غير منشورة على السيرفر" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const handleDeleteRSVP = async (id) => {
    setRsvps((prev) => prev.filter((item) => item.id !== id));
    return { success: true };
  };

  const handleDeleteWish = async (id) => {
    setWishes((prev) => prev.filter((item) => item.id !== id));
    return { success: true };
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    const THEME_KEYS = {
      primaryColor: "--color-primary",
      secondaryColor: "--color-secondary",
      accentColor: "--color-accent",
      backgroundColor: "--color-bg",
      textColor: "--color-text",
      cardColor: "--color-card",
      animationSpeed: "--anim-speed",
      borderRadius: "--radius-card",
      fontFamily: "--font-family",
    };
    Object.entries(theme).forEach(([key, value]) => {
      const cssVar = THEME_KEYS[key];
      if (cssVar) {
        if (key === "animationSpeed") {
          const speed = parseFloat(value) || 1;
          root.style.setProperty(cssVar, `${1 / speed}s`);
        } else {
          root.style.setProperty(cssVar, value);
        }
      }
    });
  };

  const weddingDateTime = activeInvitation
    ? `${activeInvitation.weddingDate}T${activeInvitation.weddingTime}:00+03:00`
    : "";

  const formattedTime = (() => {
    if (!activeInvitation?.weddingTime) return "";
    try {
      const [hours, minutes] = activeInvitation.weddingTime.split(":");
      const h = parseInt(hours);
      const period = h >= 12 ? "مساءً" : "صباحاً";
      const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${displayH}:${minutes} ${period}`;
    } catch {
      return activeInvitation.weddingTime;
    }
  })();

  const formattedDate = (() => {
    if (!activeInvitation?.weddingDate) return "";
    try {
      const date = new Date(activeInvitation.weddingDate + "T00:00:00");
      const days = [
        "الأحد",
        "الاثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت",
      ];
      const months = [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ];
      return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return activeInvitation.weddingDate;
    }
  })();

  const contextValue = {
    ...(activeInvitation || {}),
    activeSlug,
    activeInvitation,
    wishes,
    rsvps,
    allInvitations,
    isLoading,
    error,
    loadInvitation,
    loadDemoInvitation,
    createInvitation: handleCreateInvitation,
    updateInvitation: handleUpdateInvitation,
    deleteInvitation: handleDeleteInvitation,
    bulkUploadInvitations: handleBulkUploadInvitations,
    publishInvitation: handlePublishInvitation,
    saveRSVP: handleSaveRSVP,
    saveWish: handleSaveWish,
    deleteRSVP: handleDeleteRSVP,
    deleteWish: handleDeleteWish,
    refreshInvitations: fetchAllInvitations,
    weddingDateTime,
    formattedTime,
    formattedDate,
    updateWeddingData: (updates) => handleUpdateInvitation(activeSlug, updates),
  };

  return (
    <WeddingDataContext.Provider value={contextValue}>
      {children}
    </WeddingDataContext.Provider>
  );
}

export function useWeddingData() {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error("useWeddingData must be used within a WeddingDataProvider");
  }
  return context;
}

export default WeddingDataContext;
