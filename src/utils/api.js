const BASE_URL = "https://invaite.test.do-go.net/api";

// Helper to safely parse JSON
function safeParseJSON(str, fallback) {
  if (!str) return fallback;
  try {
    return typeof str === "string" ? JSON.parse(str) : str;
  } catch (e) {
    return fallback;
  }
}

/**
 * VIEW THEME
 * GET /api/theme/:slug
 */
export async function viewThemeBySlug(slug) {
  console.log(`[API] GET ${BASE_URL}/theme/${slug}`);
  try {
    const response = await fetch(`${BASE_URL}/theme/${slug}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok)
      throw new Error(`استجابة الخادم غير صالحة: ${response.status}`);

    const data = await response.json();

    if (data.status === "success" && data.theme) {
      const theme = data.theme;
      const rawData = theme.data || {};

      const invitation = {
        slug: theme.slug,
        externalThemeId: theme.id,
        userId: theme.user_id,
        themeId: theme.theme_id,
        email: theme.email,
        phone: theme.phone,
        title: theme.title,

        groomName: rawData.groomName || "",
        brideName: rawData.brideName || "",
        weddingDate: rawData.weddingDate || "",
        weddingTime: rawData.weddingTime || "",
        hijriDate: rawData.hijriDate || "",
        invitationText: rawData.invitationText || "",
        venueName: rawData.venueName || "",
        venueCity: rawData.venueCity || "",
        venueAddress: rawData.venueAddress || "",
        venueDescription: rawData.venueDescription || "",
        mapUrl: rawData.mapUrl || rawData.mapLat || "",

        loveStory: safeParseJSON(
          rawData.love_story_json || rawData.loveStory,
          [],
        ),
        galleryImages: safeParseJSON(
          rawData.gallery_images_json || rawData.galleryImages,
          [],
        ),
        videos: safeParseJSON(rawData.videos_json || rawData.videos, []),
        rsvpSettings: safeParseJSON(
          rawData.rsvp_settings_json || rawData.rsvpSettings,
          { enabled: true },
        ),
        customSections: safeParseJSON(
          rawData.custom_sections_json || rawData.customSections,
          [],
        ),
        theme: safeParseJSON(
          rawData.theme_custom_json || rawData.theme_custom || rawData.theme,
          {},
        ),
        coverImage: rawData.coverImage || theme.cover_image || "",
      };

      return { success: true, data: invitation };
    }

    throw new Error("تنسيق استجابة غير صالح من السيرفر");
  } catch (err) {
    console.error("[API] view-theme Error:", err);
    return {
      success: false,
      error: err.message || "فشلت عملية جلب بيانات الدعوة من السيرفر",
    };
  }
}

/**
 * Get Invitation by Slug (Wrapper for compatibility)
 */
export async function getInvitationBySlug(slug) {
  return viewThemeBySlug(slug);
}

/**
 * GET ALL INVITATIONS FROM SERVER
 * لو الـ API عنده listing endpoint استخدمه هنا
 * حالياً بيرجع array فاضية لأن الـ API مش بيدعم listing
 */
export async function getAllInvitationsFromServer() {
  return { success: true, data: [] };
}

/**
 * Kept for compatibility - same as getAllInvitationsFromServer
 */
export async function getAllInvitations() {
  return getAllInvitationsFromServer();
}

// Helper to convert base64 data URL to a Blob for file upload
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * UPLOAD / CREATE OR UPDATE INVITATION ON SERVER
 * POST /api/add-theme OR POST /api/update-theme/:id
 */
export async function createOrUpdateInvitationOnServer(
  invitation,
  heroImageFile,
) {
  const isUpdate = !!invitation.externalThemeId;
  const url = isUpdate
    ? `${BASE_URL}/update-theme/${invitation.externalThemeId}`
    : `${BASE_URL}/add-theme`;

  console.log(`[API] POST (Upload) theme to ${url}`, invitation);

  try {
    const formData = new FormData();

    formData.append("theme_id", invitation.themeId || "4");
    formData.append("user_id", invitation.userId || "");
    formData.append("email", invitation.email || "");
    formData.append("phone", invitation.phone || "");
    formData.append(
      "title",
      invitation.title || `${invitation.groomName} & ${invitation.brideName}`,
    );

    let uploadFile = heroImageFile;
    if (
      !uploadFile &&
      invitation.coverImage &&
      invitation.coverImage.startsWith("data:image/")
    ) {
      try {
        uploadFile = dataURLtoBlob(invitation.coverImage);
      } catch (e) {
        console.error("[API] Failed to convert coverImage to Blob:", e);
      }
    }

    if (uploadFile) {
      formData.append("hero_image", uploadFile, "hero_image.jpg");
    }

    formData.append("slug", invitation.slug);
    formData.append("groomName", invitation.groomName || "");
    formData.append("brideName", invitation.brideName || "");
    formData.append("weddingDate", invitation.weddingDate || "");
    formData.append("weddingTime", invitation.weddingTime || "");
    formData.append("hijriDate", invitation.hijriDate || "");
    formData.append("invitationText", invitation.invitationText || "");
    formData.append("venueName", invitation.venueName || "");
    formData.append("venueCity", invitation.venueCity || "");
    formData.append("venueAddress", invitation.venueAddress || "");
    formData.append("venueDescription", invitation.venueDescription || "");
    formData.append("mapUrl", invitation.mapUrl || "");
    formData.append("mapLat", invitation.mapUrl || ""); // Fallback for backend backwards compatibility

    formData.append(
      "love_story_json",
      JSON.stringify(invitation.loveStory || []),
    );
    formData.append(
      "gallery_images_json",
      JSON.stringify(invitation.galleryImages || []),
    );
    formData.append("videos_json", JSON.stringify(invitation.videos || []));
    formData.append(
      "rsvp_settings_json",
      JSON.stringify(invitation.rsvpSettings || { enabled: true }),
    );
    formData.append(
      "custom_sections_json",
      JSON.stringify(invitation.customSections || []),
    );
    formData.append(
      "theme_custom_json",
      JSON.stringify(invitation.theme || {}),
    );

    const response = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (!response.ok) {
      let errorDetail = `استجابة غير صالحة من السيرفر: ${response.status}`;
      try {
        const errBody = await response.json();
        console.error("[API] Server validation errors:", errBody);
        if (errBody.errors) {
          const msgs = Object.values(errBody.errors).flat().join(" | ");
          errorDetail = msgs || errorDetail;
        } else if (errBody.message) {
          errorDetail = errBody.message;
        }
      } catch (_) {
        /* ignore parse failure */
      }
      throw new Error(errorDetail);
    }

    const data = await response.json();
    console.log("[API] Upload Response:", data);
    return { success: true, data };
  } catch (err) {
    console.error("[API] Upload Error:", err);
    return {
      success: false,
      error: err.message || "فشلت عملية حفظ البيانات على السيرفر",
    };
  }
}

/**
 * Compatibility Wrappers
 */
export async function createInvitation(invitationData, heroImageFile) {
  return createOrUpdateInvitationOnServer(invitationData, heroImageFile);
}

export async function updateInvitation(
  externalThemeId,
  invitationData,
  heroImageFile,
) {
  const merged = { ...invitationData, externalThemeId };
  return createOrUpdateInvitationOnServer(merged, heroImageFile);
}

export async function deleteInvitation(slug) {
  console.log(`[API] Local-only delete invitation requested for: ${slug}`);
  return { success: true };
}

export async function bulkUploadInvitations(invitationsArray) {
  console.log(
    `[API] Starting bulk upload of ${invitationsArray.length} invitations...`,
  );
  return { success: true };
}

/**
 * GET WISHES (COMMENTS)
 */
export async function getWishesForSlug(slug) {
  return { success: true, data: [] };
}

/**
 * GET RSVPS
 */
export async function getRSVPsForSlug(slug) {
  return { success: true, data: [] };
}

/**
 * ADD COMMENT
 * POST /api/add-comment
 */
export async function addComment({ themeId, name, comment }) {
  console.log(`[API] POST ${BASE_URL}/add-comment`);
  try {
    const formData = new FormData();
    formData.append("theme_id", themeId);
    formData.append("name", name);
    formData.append("comment", comment);

    const response = await fetch(`${BASE_URL}/add-comment`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (!response.ok)
      throw new Error(`استجابة الخادم غير صالحة: ${response.status}`);

    const data = await response.json();
    console.log("[API] add-comment Response:", data);
    return { success: true, data };
  } catch (err) {
    console.error("[API] add-comment Error:", err);
    return { success: false, error: err.message || "فشلت عملية إضافة التعليق" };
  }
}

/**
 * DELETE COMMENT
 * POST /api/delete-comment/:id
 */
export async function deleteComment(commentId) {
  console.log(`[API] POST ${BASE_URL}/delete-comment/${commentId}`);
  try {
    const response = await fetch(`${BASE_URL}/delete-comment/${commentId}`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });

    if (!response.ok)
      throw new Error(`استجابة الخادم غير صالحة: ${response.status}`);

    const data = await response.json();
    console.log("[API] delete-comment Response:", data);
    return { success: true, data };
  } catch (err) {
    console.error("[API] delete-comment Error:", err);
    return { success: false, error: err.message || "فشلت عملية حذف التعليق" };
  }
}

/**
 * ADD RSVP
 * POST /api/add-rsvp
 */
export async function addRSVP({
  themeId,
  name,
  email,
  guests,
  events,
  message,
}) {
  console.log(`[API] POST ${BASE_URL}/add-rsvp`);
  try {
    const formData = new FormData();
    formData.append("theme_id", themeId);
    formData.append("rsvp_name", name);
    formData.append("rsvp_email", email || "");
    formData.append("rsvp_guests", guests || "");
    formData.append("rsvp_events", events || "");
    formData.append("rsvp_message", message || "");

    const response = await fetch(`${BASE_URL}/add-rsvp`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (!response.ok)
      throw new Error(`استجابة الخادم غير صالحة: ${response.status}`);

    const data = await response.json();
    console.log("[API] add-rsvp Response:", data);
    return { success: true, data };
  } catch (err) {
    console.error("[API] add-rsvp Error:", err);
    return { success: false, error: err.message || "فشلت عملية إضافة الرد" };
  }
}

/**
 * CHECK USER LOGIN
 * POST /api/check-user
 */
export async function checkUserLogin(phone, password) {
  console.log(`[API] POST ${BASE_URL}/check-user`);
  try {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);

    const response = await fetch(`${BASE_URL}/check-user`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (!response.ok) {
      let errorMsg = "رقم الهاتف أو كلمة المرور غير صحيحة";
      try {
        const errData = await response.json();
        if (errData.message) errorMsg = errData.message;
      } catch (e) {}
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error("[API] check-user Error:", err);
    return {
      success: false,
      error: err.message || "رقم الهاتف أو كلمة المرور غير صحيحة",
    };
  }
}
