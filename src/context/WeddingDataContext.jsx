import { createContext, useContext, useState, useEffect } from "react";
import * as api from "../utils/api";
import * as db from "../utils/database";

const WeddingDataContext = createContext(null);

// Helper: بيشيل الـ slug قبل ما يبعت للـ API
const stripSlug = ({ slug, ...rest }) => rest;

export function WeddingDataProvider({ children }) {
  const [activeInvitation, setActiveInvitation] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [rsvps, setRsvps] = useState([]);

  const [allInvitations, setAllInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derived from activeInvitation directly
  const activeSlug = activeInvitation?.slug ?? "";

  useEffect(() => {
    fetchAllInvitations();
  }, []);

  useEffect(() => {
    if (activeInvitation && activeInvitation.theme) {
      applyTheme(activeInvitation.theme);
    }
  }, [activeInvitation]);

  const fetchAllInvitations = async () => {
    try {
      const res = await api.getAllInvitations();
      if (res.success) {
        setAllInvitations(res.data);
      }
    } catch (err) {
      console.error("Failed to load all invitations listing:", err);
    }
  };

  const loadInvitation = async (slug) => {
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
        console.warn(
          `[Context] Server load failed: ${res.error}. Falling back to local DB...`,
        );
        const localInv = await db.getInvitationBySlug(slug);
        if (localInv) {
          setActiveInvitation(localInv);
          setWishes((await db.getWishes(slug)) || []);
          setRsvps((await db.getRSVPs(slug)) || []);
        } else {
          setError("NOT_FOUND");
          setActiveInvitation(null);
        }
      }
    } catch (err) {
      console.error("[Context] Unexpected error loading invitation:", err);
      const localInv = await db.getInvitationBySlug(slug);
      if (localInv) {
        setActiveInvitation(localInv);
        setWishes((await db.getWishes(slug)) || []);
        setRsvps((await db.getRSVPs(slug)) || []);
      } else {
        setError(err.message || "حدث خطأ غير متوقع");
        setActiveInvitation(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvitation = async (invitationData) => {
    try {
      const defaultData = {
        ...db.DEFAULT_WEDDING_DATA,
        ...invitationData,
        loveStory: db.DEFAULT_WEDDING_DATA.loveStory || [],
        galleryImages: db.DEFAULT_WEDDING_DATA.galleryImages || [],
        theme: db.DEFAULT_WEDDING_DATA.theme || {},
      };
      await db.saveInvitation(defaultData);
      await fetchAllInvitations();
      return { success: true, data: defaultData };
    } catch (e) {
      console.error("[Context] Create local invitation error:", e);
      return { success: false, error: e.message };
    }
  };

  const handleUpdateInvitation = async (slug, updates) => {
    try {
      const current = await db.getInvitationBySlug(slug);
      if (!current) throw new Error("لم يتم العثور على الدعوة محلياً");

      if (
        current.userId &&
        updates.userId &&
        String(current.userId) !== String(updates.userId)
      ) {
        throw new Error(
          "لا يمكن تعديل هذه الدعوة: رقم تعريف المستخدم غير متطابق",
        );
      }

      const merged = { ...current, ...updates };
      await db.saveInvitation(merged);

      if (merged.externalThemeId) {
        const res = await api.createOrUpdateInvitationOnServer(
          stripSlug(merged),
        );
        if (res.success && res.data?.theme?.id) {
          merged.externalThemeId = res.data.theme.id;
          if (res.data.theme.user_id) merged.userId = res.data.theme.user_id;
          await db.saveInvitation(merged);
        }
      }

      if (slug === activeSlug) setActiveInvitation(merged);
      await fetchAllInvitations();
      return { success: true, data: merged };
    } catch (err) {
      console.error("[Context] Update Invitation error:", err);
      return { success: false, error: err.message };
    }
  };

  const handlePublishInvitation = async (slug) => {
    try {
      const invitation = await db.getInvitationBySlug(slug);
      if (!invitation) throw new Error("لم يتم العثور على الدعوة محلياً");

      const res = await api.createOrUpdateInvitationOnServer(
        stripSlug(invitation),
      );
      if (res.success) {
        if (res.data?.theme?.id) {
          invitation.externalThemeId = res.data.theme.id;
          if (res.data.theme.user_id)
            invitation.userId = res.data.theme.user_id;
          await db.saveInvitation(invitation);
          if (slug === activeSlug) setActiveInvitation(invitation);
        }
        await fetchAllInvitations();
        return { success: true, data: res.data };
      } else {
        return { success: false, error: res.error };
      }
    } catch (err) {
      console.error("[Context] Publish invitation error:", err);
      return { success: false, error: err.message };
    }
  };

  const handleDeleteInvitation = async (slug) => {
    try {
      await db.deleteInvitation(slug);
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
        const res = await api.createOrUpdateInvitationOnServer(stripSlug(inv));
        if (res.success) {
          successCount++;
          if (res.data?.theme?.id) {
            inv.externalThemeId = res.data.theme.id;
            if (res.data.theme.user_id) inv.userId = res.data.theme.user_id;
            await db.saveInvitation(inv);
          }
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
    const rsvpPayload = { ...rsvpData, invitationSlug: activeSlug };
    try {
      const saved = await db.saveRSVP(rsvpPayload);

      if (activeInvitation?.externalThemeId) {
        await api.addRSVP({
          themeId: activeInvitation.externalThemeId,
          name: rsvpData.name,
          email: rsvpData.email || "",
          guests: rsvpData.guestsCount || "1",
          events: rsvpData.events || "test",
          message: rsvpData.message || "",
        });
      }

      if (saved) {
        setRsvps((prev) => {
          const index = prev.findIndex((item) => item.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        return { success: true, data: saved };
      }
      return { success: false, error: "فشل حفظ الرد محلياً" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const handleSaveWish = async (wishData) => {
    const wishPayload = { ...wishData, invitationSlug: activeSlug };
    try {
      const saved = await db.saveWish(wishPayload);

      if (activeInvitation?.externalThemeId) {
        await api.addComment({
          themeId: activeInvitation.externalThemeId,
          name: wishData.name,
          comment: wishData.message,
        });
      }

      if (saved) {
        setWishes((prev) => {
          const index = prev.findIndex((item) => item.id === saved.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = saved;
            return next;
          }
          return [saved, ...prev];
        });
        return { success: true, data: saved };
      }
      return { success: false, error: "فشل حفظ التهنئة" };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const handleDeleteRSVP = async (id) => {
    try {
      await db.deleteRSVP(id);
      setRsvps((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  const handleDeleteWish = async (id) => {
    try {
      await db.deleteWish(id);
      setWishes((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
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
    resetToDefaults: async () => {
      const res = await api.getInvitationBySlug("fatima-mohamed");
      if (res.success) {
        await handleUpdateInvitation(activeSlug, {
          brideName: res.data.brideName,
          groomName: res.data.groomName,
          weddingDate: res.data.weddingDate,
          weddingTime: res.data.weddingTime,
          hijriDate: res.data.hijriDate,
          venueName: res.data.venueName,
          venueAddress: res.data.venueAddress,
          venueCity: res.data.venueCity,
          venueDescription: res.data.venueDescription,
          mapLat: res.data.mapLat,
          mapLng: res.data.mapLng,
          invitationText: res.data.invitationText,
          loveStory: res.data.loveStory,
          galleryImages: res.data.galleryImages,
          theme: res.data.theme,
        });
      }
    },
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
