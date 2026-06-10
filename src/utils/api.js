import * as db from './database';

const BASE_URL = "https://invaite.test.do-go.net/api";

// Helper to safely parse JSON
function safeParseJSON(str, fallback) {
  if (!str) return fallback;
  try {
    return typeof str === 'string' ? JSON.parse(str) : str;
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
      
      // Map API theme details & nested 'data' fields into a unified invitation object
      const invitation = {
        slug: theme.slug,
        externalThemeId: theme.id,
        userId: theme.user_id,
        themeId: theme.theme_id,
        email: theme.email,
        phone: theme.phone,
        title: theme.title,
        
        // Invitation details from rawData
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
        mapLat: rawData.mapLat || "",
        mapLng: rawData.mapLng || "",
        
        // Complex components — read from _json suffixed keys (our format),
        // falling back to old key names for backward compatibility.
        loveStory: safeParseJSON(rawData.love_story_json || rawData.loveStory, []),
        galleryImages: safeParseJSON(rawData.gallery_images_json || rawData.galleryImages, []),
        videos: safeParseJSON(rawData.videos_json || rawData.videos, []),
        rsvpSettings: safeParseJSON(rawData.rsvp_settings_json || rawData.rsvpSettings, { enabled: true }),
        customSections: safeParseJSON(rawData.custom_sections_json || rawData.customSections, []),
        theme: safeParseJSON(rawData.theme_custom_json || rawData.theme_custom || rawData.theme, {}),
        coverImage: rawData.coverImage || theme.cover_image || ""
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

// Helper to convert base64 data URL to a Blob for file upload
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
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
 * UPLOAD / CREATE OR UPDATE INVITATION ON SERVER (ALL AT ONCE)
 * POST /api/add-theme OR POST /api/update-theme/:id
 */
export async function createOrUpdateInvitationOnServer(invitation, heroImageFile) {
  const isUpdate = !!invitation.externalThemeId;
  const url = isUpdate 
    ? `${BASE_URL}/update-theme/${invitation.externalThemeId}` 
    : `${BASE_URL}/add-theme`;

  console.log(`[API] POST (Upload) theme to ${url}`, invitation);

  try {
    const formData = new FormData();
    
    // Core fields expected by API root
    formData.append("theme_id", invitation.themeId || "4");
    formData.append("user_id", invitation.userId || "2");
    formData.append("email", invitation.email || "ahmed5bdelaal@gmail.com");
    formData.append("phone", invitation.phone || "01212393872");
    formData.append("title", invitation.title || `${invitation.groomName} & ${invitation.brideName}`);
    
    if (invitation.owner_name) formData.append("owner_name", invitation.owner_name);
    if (invitation.password) formData.append("password", invitation.password);
    
    let uploadFile = heroImageFile;
    if (!uploadFile && invitation.coverImage && invitation.coverImage.startsWith('data:image/')) {
      try {
        uploadFile = dataURLtoBlob(invitation.coverImage);
      } catch (e) {
        console.error("[API] Failed to convert coverImage to Blob:", e);
      }
    }

    if (uploadFile) {
      formData.append("hero_image", uploadFile, "hero_image.jpg");
    }

    // All extra details appended to FormData — stored inside the server's 'data' JSON blob.
    // Plain text fields (safe to send as-is):
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
    formData.append("mapLat", invitation.mapLat || "");
    formData.append("mapLng", invitation.mapLng || "");
    
    // Complex arrays/objects — use "_json" suffix to avoid clashing with
    // Laravel's file-upload validation rules (e.g. "galleryImages" is validated
    // as an array of image files on the backend).
    formData.append("love_story_json", JSON.stringify(invitation.loveStory || []));
    formData.append("gallery_images_json", JSON.stringify(invitation.galleryImages || []));
    formData.append("videos_json", JSON.stringify(invitation.videos || []));
    formData.append("rsvp_settings_json", JSON.stringify(invitation.rsvpSettings || { enabled: true }));
    formData.append("custom_sections_json", JSON.stringify(invitation.customSections || []));
    formData.append("theme_custom_json", JSON.stringify(invitation.theme || {}));

    const response = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    if (!response.ok) {
      // Try to capture the validation error details from the response body
      let errorDetail = `استجابة غير صالحة من السيرفر: ${response.status}`;
      try {
        const errBody = await response.json();
        console.error("[API] Server validation errors:", errBody);
        if (errBody.errors) {
          const msgs = Object.values(errBody.errors).flat().join(' | ');
          errorDetail = msgs || errorDetail;
        } else if (errBody.message) {
          errorDetail = errBody.message;
        }
      } catch (_) { /* ignore parse failure */ }
      throw new Error(errorDetail);
    }

    const data = await response.json();
    console.log("[API] Upload Response:", data);
    return { success: true, data };
  } catch (err) {
    console.error("[API] Upload Error:", err);
    return { success: false, error: err.message || "فشلت عملية حفظ البيانات على السيرفر" };
  }
}

/**
 * Compatibility Wrappers for Context
 */
export async function createInvitation(invitationData, heroImageFile) {
  return createOrUpdateInvitationOnServer(invitationData, heroImageFile);
}

export async function updateInvitation(externalThemeId, invitationData, heroImageFile) {
  // If we only have updates, we should retrieve the full object first or merge with updates
  const fullInv = await db.getInvitationBySlug(invitationData.slug);
  
  if (fullInv && fullInv.userId && invitationData.userId && String(fullInv.userId) !== String(invitationData.userId)) {
    return { success: false, error: "لا يمكن تعديل هذه الدعوة: رقم تعريف المستخدم غير متطابق" };
  }

  const merged = { ...fullInv, ...invitationData, externalThemeId };
  return createOrUpdateInvitationOnServer(merged, heroImageFile);
}

export async function deleteInvitation(slug) {
  // Since the API doesn't support deleting a theme/invitation, we perform a local delete.
  console.log(`[API] Local-only delete invitation requested for: ${slug}`);
  return { success: true };
}

export async function bulkUploadInvitations(invitationsArray) {
  // Loop and upload each invitation to the server
  console.log(`[API] Starting bulk upload of ${invitationsArray.length} invitations...`);
  return { success: true }; // Context handles the actual loop to capture database ID updates.
}

/**
 * GET ALL INVITATIONS
 * Calls local db since the API has no listing endpoint
 */
export async function getAllInvitations() {
  try {
    const data = await db.getAllInvitations();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * GET WISHES (COMMENTS)
 * Calls local db since the API has no GET comments endpoint
 */
export async function getWishesForSlug(slug) {
  try {
    const data = await db.getWishes(slug);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * GET RSVPS
 * Calls local db since the API has no GET RSVPs endpoint
 */
export async function getRSVPsForSlug(slug) {
  try {
    const data = await db.getRSVPs(slug);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * ADD COMMENT
 * POST /api/add-comment
 * Fields: name, comment, theme_id
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
 * Fields: rsvp_name, rsvp_email, theme_id, rsvp_guests, rsvp_events, rsvp_message
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
 * Fields: phone, password
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
    return { success: false, error: err.message || "رقم الهاتف أو كلمة المرور غير صحيحة" };
  }
}
