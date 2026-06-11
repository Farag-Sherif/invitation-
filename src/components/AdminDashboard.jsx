import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Heart, Palette, Database, LogOut, 
  Save, Eye, Check, Download, Trash2, Key, AlertTriangle, HelpCircle,
  Image, ArrowUp, ArrowDown, Upload, Plus, Search, Link2, X, ChevronLeft, Film, Settings
} from 'lucide-react';
import { useWeddingData } from '../context/WeddingDataContext';
import useTheme from '../hooks/useTheme';

const FONTS = [
  { name: 'تاجوال (عصري)', value: "'Tajawal', sans-serif" },
  { name: 'أميري (كلاسيكي)', value: "'Amiri', serif" },
  { name: 'Cormorant (فاخر)', value: "'Cormorant Garamond', serif" },
  { name: 'Cinzel (ملكي)', value: "'Cinzel', serif" },
  { name: 'Alex Brush (رومانسي)', value: "'Alex Brush', cursive" }
];

export default function AdminDashboard({ onLogout, singleInvitationMode, userEditSlug }) {
  const weddingData = useWeddingData();
  const { 
    allInvitations, 
    activeSlug, 
    isLoading, 
    loadInvitation, 
    createInvitation, 
    updateInvitation, 
    deleteInvitation,
    rsvps,
    wishes,
    deleteRSVP,
    deleteWish,
    bulkUploadInvitations,
    publishInvitation
  } = weddingData;

  const { theme, updateField: updateThemeField, resetTheme } = useTheme();
  
  const [isUploading, setIsUploading] = useState(false);
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState('general'); 
  const [editingSlug, setEditingSlug] = useState(singleInvitationMode ? userEditSlug : '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slugToDelete, setSlugToDelete] = useState(null);

  // Import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [importId, setImportId] = useState('');
  const [importSlug, setImportSlug] = useState('');
  const [importError, setImportError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Form states for general data (editing active invitation)
  const [groomName, setGroomName] = useState('');
  const [brideName, setBrideName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingTime, setWeddingTime] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [invitationText, setInvitationText] = useState('');
  const [themeId, setThemeId] = useState('4');
  const [userId, setUserId] = useState(sessionStorage.getItem('admin-user-id') || '2');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Form states for venue details
  const [venueName, setVenueName] = useState('');
  const [venueCity, setVenueCity] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [venueDescription, setVenueDescription] = useState('');
  const [mapUrl, setMapUrl] = useState('');

  // Form states for love story (array of 3 cards)
  const [story0, setStory0] = useState({ year: '', title: '', text: '', icon: '' });
  const [story1, setStory1] = useState({ year: '', title: '', text: '', icon: '' });
  const [story2, setStory2] = useState({ year: '', title: '', text: '', icon: '' });

  // Additional elements
  const [coverImage, setCoverImage] = useState('');
  const [videos, setVideos] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  
  // RSVP custom settings
  const [rsvpEnabled, setRsvpEnabled] = useState(true);
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  const [rsvpMaxGuests, setRsvpMaxGuests] = useState(5);

  // Custom sections
  const [customSections, setCustomSections] = useState([]);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');

  // Security states
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Gallery states
  const [galleryImages, setGalleryImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageLabel, setNewImageLabel] = useState('');
  const [newImageAspect, setNewImageAspect] = useState('portrait');

  // Load all invitation list on mount or setup single invitation mode
  useEffect(() => {
    if (singleInvitationMode && userEditSlug) {
      handleEditInvitation(userEditSlug);
    } else if (weddingData.refreshInvitations) {
      weddingData.refreshInvitations();
    }
  }, [singleInvitationMode, userEditSlug]);

  // Update editor states when active invitation changes
  useEffect(() => {
    if (weddingData.activeInvitation) {
      const inv = weddingData.activeInvitation;
      setGroomName(inv.groomName || '');
      setBrideName(inv.brideName || '');
      setWeddingDate(inv.weddingDate || '');
      setWeddingTime(inv.weddingTime || '');
      setHijriDate(inv.hijriDate || '');
      setInvitationText(inv.invitationText || '');
      setThemeId(inv.themeId || '4');
      setUserId(inv.userId || '2');
      setEmail(inv.email || '');
      setPhone(inv.phone || '');
      
      setVenueName(inv.venueName || '');
      setVenueCity(inv.venueCity || '');
      setVenueAddress(inv.venueAddress || '');
      setVenueDescription(inv.venueDescription || '');
      setMapUrl(inv.mapUrl || inv.mapLat || '');

      setStory0(inv.loveStory?.[0] || { year: '', title: '', text: '', icon: '' });
      setStory1(inv.loveStory?.[1] || { year: '', title: '', text: '', icon: '' });
      setStory2(inv.loveStory?.[2] || { year: '', title: '', text: '', icon: '' });

      setCoverImage(inv.coverImage || '');
      setGalleryImages(inv.galleryImages || []);
      setVideos(inv.videos || []);
      setRsvpEnabled(inv.rsvpSettings?.enabled ?? true);
      setRsvpDeadline(inv.rsvpSettings?.deadline || '');
      setRsvpMaxGuests(inv.rsvpSettings?.maxGuests || 5);
      setCustomSections(inv.customSections || []);
    }
  }, [weddingData.activeInvitation]);

  const triggerSuccessFeedback = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishActiveInvitation = async () => {
    setIsPublishing(true);
    try {
      const res = await publishInvitation(editingSlug);
      if (res.success) {
        triggerSuccessFeedback();
        alert('تم نشر وتحديث الدعوة بنجاح على السيرفر (API)!');
      } else {
        alert('فشل عملية النشر: ' + (res.error || 'خطأ غير معروف'));
      }
    } catch (err) {
      alert('حدث خطأ أثناء النشر: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Select an invitation to edit
  const handleEditInvitation = async (slug) => {
    setEditingSlug(slug);
    await loadInvitation(slug);
    setActiveTab('general');
  };

  // Stop editing and go back to list
  const handleBackToList = () => {
    if (singleInvitationMode) return;
    setEditingSlug('');
    setActiveTab('manage');
    if (weddingData.refreshInvitations) {
      weddingData.refreshInvitations();
    }
  };

  // Helper to generate a slug from Groom and Bride names
  const generateSlugFromNames = (groom, bride) => {
    const arabicToEnglishMap = {
      'أ': 'a', 'إ': 'a', 'آ': 'a', 'ا': 'a',
      'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
      'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th',
      'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
      'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z',
      'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
      'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
      'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
      'ة': 'h', 'ئ': 'e', 'ؤ': 'o', 'لا': 'la'
    };

    const clean = (name) => {
      if (!name) return '';
      return name
        .trim()
        .split('')
        .map(char => arabicToEnglishMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    };

    const g = clean(groom);
    const b = clean(bride);
    const base = (g && b) ? `${g}-${b}` : (g || b || 'wedding');
    const rand = Math.floor(100 + Math.random() * 900);
    return `${base}-${rand}`;
  };

  const handleCreateAndPublishAll = async () => {
    if (!groomName || !brideName) {
      alert("الرجاء إدخال اسم العريس واسم العروسة في تبويب البيانات العامة على الأقل");
      return;
    }
    
    setIsPublishing(true);
    try {
      const generatedSlug = generateSlugFromNames(groomName, brideName);
      const urlParams = new URLSearchParams(window.location.search);
      const userParam = urlParams.get('user');
      const storedUserId = sessionStorage.getItem('admin-user-id') || '2';

      const fullData = {
        slug: generatedSlug,
        userId: storedUserId,
        email: email,
        phone: phone || userParam || '',
        groomName,
        brideName,
        weddingDate,
        weddingTime,
        hijriDate,
        invitationText: invitationText || 'يتشرف أولياء الأمور بدعوتكم لحضور حفل الزفاف الميمون ومشاركتنا بهجة العمر وليلة الميثاق الغليظ.',
        themeId: '4',
        venueName,
        venueCity,
        venueAddress,
        venueDescription,
        mapUrl,
        loveStory: [story0, story1, story2],
        rsvpSettings: { enabled: rsvpEnabled, deadline: rsvpDeadline, maxGuests: rsvpMaxGuests },
        coverImage,
        galleryImages,
        videos,
        customSections,
      };

      const res = await createInvitation(fullData);
      if (res.success) {
        triggerSuccessFeedback();
        alert('تم إنشاء ونشر الدعوة بنجاح على السيرفر (API)!');
        window.location.href = `/${generatedSlug}/admin${userParam ? `?user=${userParam}` : ''}`;
      } else {
        alert('فشل الإنشاء: ' + (res.error || 'خطأ غير معروف'));
      }
    } catch (e) {
      alert('خطأ: ' + e.message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Import from server handler
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    setImportError('');
    setIsImporting(true);

    try {
      const cleanSlug = importSlug.trim().toLowerCase();
      
      // Fetch theme from server using the api helper
      const { viewThemeBySlug } = await import('../utils/api');
      const apiRes = await viewThemeBySlug(cleanSlug);

      if (apiRes.success && apiRes.data) {
        const themeData = apiRes.data;
        
        // Match checking: verify the theme's externalThemeId matches importId
        if (String(themeData.externalThemeId) !== String(importId.trim())) {
          setImportError('معرف الدعوة (ID) غير متطابق مع اسم المستخدم/الرابط المدخل');
          setIsImporting(false);
          return;
        }

        // Save it locally
        const { saveInvitation } = await import('../utils/database');
        await saveInvitation(themeData);

        // Refresh list
        if (weddingData.refreshInvitations) {
          await weddingData.refreshInvitations();
        }
        
        setShowImportModal(false);
        setImportId('');
        setImportSlug('');
        
        // Open the editor for the imported invitation
        handleEditInvitation(cleanSlug);
      } else {
        setImportError(apiRes.error || 'فشلت عملية جلب الدعوة من السيرفر. تأكد من صحة الرابط.');
      }
    } catch (err) {
      setImportError(err.message || 'حدث خطأ غير متوقع أثناء الاستيراد');
    } finally {
      setIsImporting(false);
    }
  };

  // Confirm delete handler
  const triggerDeleteConfirm = (slug) => {
    setSlugToDelete(slug);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    if (!slugToDelete) return;
    const res = await deleteInvitation(slugToDelete);
    if (res.success) {
      setShowDeleteModal(false);
      setSlugToDelete(null);
      if (editingSlug === slugToDelete) {
        setEditingSlug('');
        setActiveTab('manage');
      }
    } else {
      alert('فشلت عملية حذف الدعوة');
    }
  };

  // Save changes to database
  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    if (singleInvitationMode) {
      const storedUserId = sessionStorage.getItem('admin-user-id') || userId || '2';
      await updateInvitation(editingSlug, {
        groomName,
        brideName,
        weddingDate,
        weddingTime,
        hijriDate,
        invitationText,
        themeId: '4',
        userId: storedUserId,
        email,
        phone
      });
    }
    triggerSuccessFeedback();
  };

  const handleSaveVenue = async (e) => {
    e.preventDefault();
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, {
        venueName,
        venueCity,
        venueAddress,
        venueDescription,
        mapUrl,
      });
    }
    triggerSuccessFeedback();
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, {
        loveStory: [story0, story1, story2]
      });
    }
    triggerSuccessFeedback();
  };

  const handleSaveRSVPSettings = async (e) => {
    e.preventDefault();
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, {
        rsvpSettings: {
          enabled: rsvpEnabled,
          deadline: rsvpDeadline,
          maxGuests: rsvpMaxGuests
        }
      });
    }
    triggerSuccessFeedback();
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 1200;
        
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        setCoverImage(base64);
        if (singleInvitationMode) {
          updateInvitation(editingSlug, { coverImage: base64 });
        }
        triggerSuccessFeedback();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleLocalImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت لتفادي امتلاء مساحة التخزين.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_DIM = 800;
        
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.75);
        setNewImageUrl(base64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    const newImg = {
      id: Date.now().toString(),
      src: newImageUrl.trim(),
      label: newImageLabel.trim() || 'صورة جديدة',
      aspect: newImageAspect
    };

    const updated = [...galleryImages, newImg];
    setGalleryImages(updated);
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, { galleryImages: updated });
    }
    
    setNewImageUrl('');
    setNewImageLabel('');
    setNewImageAspect('portrait');
    triggerSuccessFeedback();
  };

  const handleDeleteImage = async (id) => {
    const updated = galleryImages.filter(img => img.id !== id);
    setGalleryImages(updated);
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, { galleryImages: updated });
    }
  };

  const handleMoveImage = async (index, direction) => {
    const list = [...galleryImages];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }
    setGalleryImages(list);
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, { galleryImages: list });
    }
  };

  // Video Management handlers
  const handleAddVideo = async (e) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;

    // Convert youtube URL to embed format if applicable
    let embedUrl = newVideoUrl.trim();
    if (embedUrl.includes('youtube.com/watch?v=')) {
      const videoId = embedUrl.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (embedUrl.includes('youtu.be/')) {
      const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const updated = [...videos, embedUrl];
    setVideos(updated);
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, { videos: updated });
    }
    setNewVideoUrl('');
    triggerSuccessFeedback();
  };

  const handleDeleteVideo = async (index) => {
    const updated = videos.filter((_, idx) => idx !== index);
    setVideos(updated);
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, { videos: updated });
    }
  };

  // Custom Sections Management
  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim() || !newSectionContent.trim()) return;

    const newSec = {
      id: Date.now().toString(),
      title: newSectionTitle.trim(),
      content: newSectionContent.trim()
    };

    const updated = [...customSections, newSec];
    setCustomSections(updated);
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, { customSections: updated });
    }
    
    setNewSectionTitle('');
    setNewSectionContent('');
    triggerSuccessFeedback();
  };

  const handleDeleteSection = async (id) => {
    const updated = customSections.filter(sec => sec.id !== id);
    setCustomSections(updated);
    if (singleInvitationMode) {
      await updateInvitation(editingSlug, { customSections: updated });
    }
  };

  // Password and cleaning handlers
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    updateInvitation(editingSlug, {
      adminPassword: newPassword.trim()
    });
    setNewPassword('');
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleClearWishes = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع التهاني؟ لا يمكن استرجاعها.')) {
      wishes.forEach(w => deleteWish(w.id));
    }
  };

  const handleBulkSync = async () => {
    if (allInvitations.length === 0) {
      alert('لا توجد بيانات دعوات لرفعها');
      return;
    }
    
    if (window.confirm(`هل أنت متأكد من رفع جميع الدعوات (${allInvitations.length}) إلى الـ API دفعة واحدة؟`)) {
      setIsUploading(true);
      try {
        const res = await bulkUploadInvitations(allInvitations);
        if (res.success) {
          alert('تم رفع كافة البيانات للـ API بنجاح!');
        } else {
          alert(res.error || 'فشلت عملية الرفع');
        }
      } catch (err) {
        alert('حدث خطأ أثناء الرفع: ' + err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleJsonBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const invitationsArray = Array.isArray(data) ? data : [data];
        
        // Basic validation
        const isValid = invitationsArray.every(item => item && typeof item === 'object' && item.slug);
        if (!isValid) {
          alert('ملف JSON غير صالح. يجب أن يحتوي الملف على مصفوفة من الدعوات مع وجود الاسم التعريفي (slug) لكل دعوة.');
          return;
        }

        if (window.confirm(`هل تريد رفع عدد (${invitationsArray.length}) دعوة من ملف JSON إلى الـ API؟`)) {
          setIsUploading(true);
          const res = await bulkUploadInvitations(invitationsArray);
          if (res.success) {
            alert('تم استيراد ورفع كافة الدعوات بنجاح للـ API!');
          } else {
            alert(res.error || 'فشلت عملية الرفع دفعة واحدة');
          }
        }
      } catch (err) {
        alert('خطأ في قراءة ملف JSON: ' + err.message);
      } finally {
        setIsUploading(false);
        e.target.value = ''; // Reset file input
      }
    };
    reader.readAsText(file);
  };

  // Filtering invitations list
  const filteredInvitations = allInvitations.filter(inv => {
    const query = searchQuery.toLowerCase();
    return (
      inv.slug.toLowerCase().includes(query) ||
      (inv.groomName || '').toLowerCase().includes(query) ||
      (inv.brideName || '').toLowerCase().includes(query)
    );
  });

  const editTabs = [
    { id: 'general', name: 'البيانات العامة', icon: User },
    { id: 'venue', name: 'تفاصيل القاعة', icon: MapPin },
    { id: 'story', name: 'قصة الحب', icon: Heart },
    { id: 'gallery', name: 'الصور والفيديو', icon: Image },
    { id: 'theme', name: 'تخصيص المظهر', icon: Palette },
    { id: 'rsvp-settings', name: 'إعدادات RSVP', icon: Settings },
    { id: 'data', name: 'التهاني والسرية', icon: Database },
  ];



  return (
    <div className="font-tajawal" style={{ 
      minHeight: '100vh', 
      background: 'var(--color-bg, #0B0E17)', 
      color: 'white', 
      paddingBottom: '4rem',
      direction: 'rtl'
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 10% 10%, rgba(201, 168, 76, 0.04) 0%, transparent 60%), radial-gradient(circle at 90% 90%, rgba(212, 112, 122, 0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header bar */}
      <header className="glass-premium" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(11, 14, 23, 0.85)',
        backdropFilter: 'blur(16px)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary, #C9A84C) 0%, var(--color-secondary, #D4707A) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-bg, #0B0E17)',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              cursor: 'pointer'
            }} onClick={handleBackToList}>
              💍
            </div>
            <div>
              <h1 className="font-amiri" style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                {singleInvitationMode ? 'تعديل دعوتك' : 'إنشاء دعوة جديدة'}
              </h1>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                {singleInvitationMode ? `تعديل دعوة: ${editingSlug}` : 'أدخل بياناتك لإنشاء دعوة الزفاف الخاصة بك ورفعها مرة واحدة'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {singleInvitationMode ? (
              <>
                <button
                  onClick={handlePublishActiveInvitation}
                  disabled={isPublishing}
                  className="primary-action"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 1.1rem',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, var(--color-primary, #C9A84C) 0%, var(--color-secondary, #D4707A) 100%)',
                    border: 'none',
                    color: 'var(--color-bg, #0B0E17)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    opacity: isPublishing ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}
                >
                  <Upload size={16} />
                  <span>تحديث على السيرفر (API)</span>
                </button>

                <button
                  onClick={() => window.open(`/${editingSlug}`, '_blank')}
                  className="secondary-action"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-primary, #C9A84C)',
                    background: 'rgba(201, 168, 76, 0.1)',
                    color: 'var(--color-primary, #C9A84C)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s'
                  }}
                >
                  <Eye size={16} />
                  <span>معاينة ({editingSlug})</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleCreateAndPublishAll}
                disabled={isPublishing}
                className="primary-action"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--color-primary, #C9A84C) 0%, var(--color-secondary, #D4707A) 100%)',
                  border: 'none',
                  color: 'var(--color-bg, #0B0E17)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  opacity: isPublishing ? 0.7 : 1,
                  transition: 'all 0.3s'
                }}
              >
                <Upload size={16} />
                <span>إنشاء ونشر الدعوة (Publish)</span>
              </button>
            )}
            
            <button
              onClick={onLogout}
              className="wish-style-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(212, 112, 122, 0.4)',
                background: 'rgba(212, 112, 122, 0.05)',
                color: 'var(--color-secondary, #D4707A)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              <LogOut size={16} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1.5rem',
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '2rem'
      }} className="admin-grid-container">
        
        {/* Navigation Sidebar (Only shown when editing an invitation) */}
        {(
          <aside className="glass-premium" style={{
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '1.25rem',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{
              padding: '0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              <span className="modern-chip" style={{ fontSize: '10px' }}>
                تعديل: {groomName} & {brideName}
              </span>
            </div>

            {editTabs.map(tab => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? 'linear-gradient(135deg, var(--color-primary, #C9A84C) 0%, var(--color-secondary, #D4707A) 100%)' : 'transparent',
                    color: isActive ? 'var(--color-bg, #0B0E17)' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    fontWeight: isActive ? 'bold' : 'normal',
                    fontSize: '0.9rem',
                    textAlign: 'right',
                    transition: 'all 0.3s'
                  }}
                >
                  <IconComponent size={18} style={{ strokeWidth: isActive ? 2.5 : 2 }} />
                  <span>{tab.name}</span>
                </button>
              );
            })}

          </aside>
        )}

        {/* Form Content Area */}
        <section style={{ position: 'relative' }}>
          
          {/* Floating Save Alert Feedback */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                style={{
                  position: 'fixed',
                  top: '90px',
                  left: '50%',
                  zIndex: 9999,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '0.85rem 2rem',
                  borderRadius: '50px',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}
              >
                <Check size={18} />
                <span>تم حفظ التغييرات بنجاح!</span>
              </motion.div>
            )}
          </AnimatePresence>



          {/* TAB 1: General Details */}
          {activeTab === 'general' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-premium" style={{
              padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <h2 className="font-amiri" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                تعديل البيانات العامة للزفاف
              </h2>
              <form onSubmit={handleSaveGeneral} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-responsive">
                  <div className="form-group">
                    <label className="admin-label">اسم العريس</label>
                    <input type="text" required value={groomName} onChange={e => setGroomName(e.target.value)} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label className="admin-label">اسم العروسة</label>
                    <input type="text" required value={brideName} onChange={e => setBrideName(e.target.value)} className="admin-input" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }} className="grid-responsive-3">
                  <div className="form-group">
                    <label className="admin-label">تاريخ الحفل الميلادي</label>
                    <input type="date" required value={weddingDate} onChange={e => setWeddingDate(e.target.value)} className="admin-input text-center" />
                  </div>
                  <div className="form-group">
                    <label className="admin-label">وقت الحفل</label>
                    <input type="time" required value={weddingTime} onChange={e => setWeddingTime(e.target.value)} className="admin-input text-center" />
                  </div>
                  <div className="form-group">
                    <label className="admin-label">التاريخ الهجري (مثال: 8 ربيع الآخر 1448 هـ)</label>
                    <input type="text" value={hijriDate} onChange={e => setHijriDate(e.target.value)} className="admin-input" placeholder="سيتم حسابه تلقائياً إن تُرِك فارغاً" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="admin-label">نص الدعوة الرئيسي</label>
                  <textarea rows="3" required value={invitationText} onChange={e => setInvitationText(e.target.value)} className="admin-input" style={{ resize: 'none' }} />
                </div>


                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-responsive">
                  <div className="form-group">
                    <label className="admin-label">البريد الإلكتروني (Email)</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="admin-input" style={{ direction: 'ltr', textAlign: 'right' }} />
                  </div>
                  <div className="form-group">
                    <label className="admin-label">رقم الهاتف (Phone)</label>
                    <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} className="admin-input" style={{ direction: 'ltr', textAlign: 'right' }} />
                  </div>
                </div>

                <button type="submit" className="primary-action admin-submit-btn">
                  <Save size={18} />
                  <span>حفظ البيانات العامة</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 2: Venue Details */}
          {activeTab === 'venue' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-premium" style={{
              padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <h2 className="font-amiri" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                تعديل تفاصيل مكان الاحتفال وقاعة الزفاف
              </h2>
              <form onSubmit={handleSaveVenue} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-responsive">
                  <div className="form-group">
                    <label className="admin-label">اسم القاعة</label>
                    <input type="text" required value={venueName} onChange={e => setVenueName(e.target.value)} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label className="admin-label">المدينة / الحي</label>
                    <input type="text" required value={venueCity} onChange={e => setVenueCity(e.target.value)} className="admin-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="admin-label">العنوان بالتفصيل</label>
                  <input type="text" required value={venueAddress} onChange={e => setVenueAddress(e.target.value)} className="admin-input" />
                </div>

                <div className="form-group">
                  <label className="admin-label">وصف إرشادي للمكان للضيوف</label>
                  <textarea rows="3" required value={venueDescription} onChange={e => setVenueDescription(e.target.value)} className="admin-input" style={{ resize: 'none' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="grid-responsive">
                  <div className="form-group">
                    <label className="admin-label">رابط المكان من خرائط Google (Google Maps Link)</label>
                    <input type="url" required value={mapUrl} onChange={e => setMapUrl(e.target.value)} className="admin-input text-left" style={{ direction: 'ltr' }} placeholder="https://maps.app.goo.gl/..." />
                  </div>
                </div>

                <button type="submit" className="primary-action admin-submit-btn">
                  <Save size={18} />
                  <span>حفظ معلومات المكان والخريطة</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 3: Love Story */}
          {activeTab === 'story' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-premium" style={{
              padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <h2 className="font-amiri" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                تعديل محطات قصة الحب في الجدول الزمني
              </h2>
              <form onSubmit={handleSaveStory} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Story 0 */}
                <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
                  <span className="modern-chip mb-2" style={{ fontSize: '10px' }}>المحطة الأولى 💍</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', gap: '1rem' }} className="grid-story-layout">
                    <div className="form-group">
                      <label className="admin-label">السنة</label>
                      <input type="text" value={story0.year} onChange={e => setStory0({...story0, year: e.target.value})} className="admin-input text-center" />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">أيقونة (إيموجي)</label>
                      <input type="text" value={story0.icon} onChange={e => setStory0({...story0, icon: e.target.value})} className="admin-input text-center" />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">العنوان</label>
                      <input type="text" value={story0.title} onChange={e => setStory0({...story0, title: e.target.value})} className="admin-input" />
                    </div>
                  </div>
                  <div className="form-group mt-2">
                    <label className="admin-label">الوصف والقصة التفصيلية</label>
                    <textarea rows="2" value={story0.text} onChange={e => setStory0({...story0, text: e.target.value})} className="admin-input" style={{ resize: 'none' }} />
                  </div>
                </div>

                {/* Story 1 */}
                <div style={{ borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '1.5rem' }}>
                  <span className="modern-chip mb-2" style={{ fontSize: '10px' }}>المحطة الثانية 💞</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', gap: '1rem' }} className="grid-story-layout">
                    <div className="form-group">
                      <label className="admin-label">السنة</label>
                      <input type="text" value={story1.year} onChange={e => setStory1({...story1, year: e.target.value})} className="admin-input text-center" />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">أيقونة (إيموجي)</label>
                      <input type="text" value={story1.icon} onChange={e => setStory1({...story1, icon: e.target.value})} className="admin-input text-center" />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">العنوان</label>
                      <input type="text" value={story1.title} onChange={e => setStory1({...story1, title: e.target.value})} className="admin-input" />
                    </div>
                  </div>
                  <div className="form-group mt-2">
                    <label className="admin-label">الوصف والقصة التفصيلية</label>
                    <textarea rows="2" value={story1.text} onChange={e => setStory1({...story1, text: e.target.value})} className="admin-input" style={{ resize: 'none' }} />
                  </div>
                </div>

                {/* Story 2 */}
                <div>
                  <span className="modern-chip mb-2" style={{ fontSize: '10px' }}>المحطة الثالثة ✨</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 100px 1fr', gap: '1rem' }} className="grid-story-layout">
                    <div className="form-group">
                      <label className="admin-label">السنة</label>
                      <input type="text" value={story2.year} onChange={e => setStory2({...story2, year: e.target.value})} className="admin-input text-center" />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">أيقونة (إيموجي)</label>
                      <input type="text" value={story2.icon} onChange={e => setStory2({...story2, icon: e.target.value})} className="admin-input text-center" />
                    </div>
                    <div className="form-group">
                      <label className="admin-label">العنوان</label>
                      <input type="text" value={story2.title} onChange={e => setStory2({...story2, title: e.target.value})} className="admin-input" />
                    </div>
                  </div>
                  <div className="form-group mt-2">
                    <label className="admin-label">الوصف والقصة التفصيلية</label>
                    <textarea rows="2" value={story2.text} onChange={e => setStory2({...story2, text: e.target.value})} className="admin-input" style={{ resize: 'none' }} />
                  </div>
                </div>

                <button type="submit" className="primary-action admin-submit-btn">
                  <Save size={18} />
                  <span>حفظ محطات قصة الحب</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 4: Gallery & Video Settings */}
          {activeTab === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Cover Image Block */}
              <div className="glass-premium" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <h3 className="font-amiri" style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  صورة غلاف الدعوة (Cover Image)
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '180px',
                    height: '110px',
                    borderRadius: '12px',
                    border: '1px dashed rgba(255,255,255,0.2)',
                    background: coverImage ? `url(${coverImage}) center/cover no-repeat` : 'rgba(255,255,255,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: '0.8rem'
                  }}>
                    {!coverImage && 'لا توجد صورة غلاف'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                      اختر صورة غلاف ذات دقة جيدة كخلفية لافتتاحية الدعوة.
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <label style={{
                        padding: '0.5rem 1.2rem',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }} className="hover-glow">
                        <Upload size={14} />
                        <span>تحميل صورة جديدة</span>
                        <input type="file" accept="image/*" onChange={handleCoverImageUpload} style={{ display: 'none' }} />
                      </label>
                      {coverImage && (
                        <button type="button" onClick={() => { setCoverImage(''); updateInvitation(editingSlug, { coverImage: '' }); }} className="wish-style-btn" style={{
                          padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', background: 'rgba(239,68,68,0.05)', fontSize: '0.8rem', cursor: 'pointer'
                        }}>
                          إزالة الغلاف
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Images List */}
              <div className="glass-premium" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <h3 className="font-amiri" style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  ألبوم صور الزفاف (Gallery)
                </h3>
                
                {/* Add new image form */}
                <form onSubmit={handleAddImage} style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 120px auto',
                  gap: '12px',
                  alignItems: 'end',
                  marginBottom: '2rem',
                  background: 'rgba(255,255,255,0.01)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }} className="grid-responsive">
                  <div className="form-group">
                    <label className="admin-label">رابط الصورة (URL) أو ارفع ملف</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="text" placeholder="https://..." value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="admin-input" style={{ flex: 1 }} />
                      <label style={{
                        padding: '0.8rem',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Upload size={16} />
                        <input type="file" accept="image/*" onChange={handleLocalImageUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="admin-label">تسمية توضيحية للصورة</label>
                    <input type="text" placeholder="مثال: لحظة التلاقي" value={newImageLabel} onChange={e => setNewImageLabel(e.target.value)} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label className="admin-label">أبعاد العرض</label>
                    <select value={newImageAspect} onChange={e => setNewImageAspect(e.target.value)} className="admin-input" style={{ background: 'var(--color-bg, #0B0E17)' }}>
                      <option value="portrait">طولي (Portrait)</option>
                      <option value="landscape">عرضي (Landscape)</option>
                      <option value="square">مربع (Square)</option>
                    </select>
                  </div>
                  <button type="submit" className="primary-action admin-submit-btn" style={{ margin: 0, height: '42px' }}>
                    <Plus size={16} />
                    <span>إضافة</span>
                  </button>
                </form>

                {/* Images grid list */}
                {galleryImages.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '2rem 0', fontSize: '0.85rem' }}>لا توجد صور مضافة للألبوم حتى الآن.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
                    {galleryImages.map((img, index) => (
                      <div key={img.id} style={{
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <div style={{ height: '120px', background: `url(${img.src}) center/cover no-repeat` }} />
                        <div style={{ padding: '8px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{img.label}</p>
                            <span style={{ fontSize: '9px', color: 'var(--color-primary, #C9A84C)' }}>
                              {img.aspect === 'portrait' ? 'طولي' : img.aspect === 'landscape' ? 'عرضي' : 'مربع'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button type="button" onClick={() => handleMoveImage(index, 'up')} disabled={index === 0} style={{ padding: '2px', background: 'none', border: 'none', color: 'white', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}>
                                <ArrowUp size={12} />
                              </button>
                              <button type="button" onClick={() => handleMoveImage(index, 'down')} disabled={index === galleryImages.length - 1} style={{ padding: '2px', background: 'none', border: 'none', color: 'white', cursor: index === galleryImages.length - 1 ? 'not-allowed' : 'pointer', opacity: index === galleryImages.length - 1 ? 0.3 : 1 }}>
                                <ArrowDown size={12} />
                              </button>
                            </div>
                            <button type="button" onClick={() => handleDeleteImage(img.id)} style={{ padding: '2px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos Section */}
              <div className="glass-premium" style={{ padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <h3 className="font-amiri" style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  مقاطع الفيديو (YouTube / URL)
                </h3>

                <form onSubmit={handleAddVideo} style={{ display: 'flex', gap: '12px', alignItems: 'end', marginBottom: '1.5rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="admin-label">رابط يوتيوب أو فيديو مباشر</label>
                    <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} className="admin-input" />
                  </div>
                  <button type="submit" className="primary-action admin-submit-btn" style={{ margin: 0, height: '42px' }}>
                    <Plus size={16} />
                    <span>إضافة فيديو</span>
                  </button>
                </form>

                {videos.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '1.5rem 0', fontSize: '0.85rem' }}>لا توجد فيديوهات مضافة حالياً.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {videos.map((vid, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                          <Film size={14} style={{ color: 'var(--color-primary, #C9A84C)' }} />
                          <span style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{vid}</span>
                        </div>
                        <button type="button" onClick={() => handleDeleteVideo(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 5: Theme customization */}
          {activeTab === 'theme' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-premium" style={{
              padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '1.5rem', justifyContent: 'space-between' }}>
                <h2 className="font-amiri" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                  تخصيص المظهر وتصميم الألوان
                </h2>
                <button
                  type="button"
                  onClick={resetTheme}
                  className="wish-style-btn"
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'none',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  إعادة ضبط الافتراضي
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Colors Grid */}
                <div>
                  <span className="admin-label" style={{ display: 'block', marginBottom: '10px', fontSize: '12px' }}>نظام الألوان المخصص</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1.25rem' }}>
                    
                    <div className="color-editor-block">
                      <label className="text-[10px] text-white/50 block mb-1">اللون الرئيسي (Gold)</label>
                      <div className="color-picker-input-container">
                        <input
                          type="color"
                          value={theme.primaryColor}
                          onChange={(e) => updateThemeField('primaryColor', e.target.value)}
                        />
                        <span className="text-[10px] uppercase font-mono mt-1 block">{theme.primaryColor}</span>
                      </div>
                    </div>

                    <div className="color-editor-block">
                      <label className="text-[10px] text-white/50 block mb-1">اللون الثانوي (Rose)</label>
                      <div className="color-picker-input-container">
                        <input
                          type="color"
                          value={theme.secondaryColor}
                          onChange={(e) => updateThemeField('secondaryColor', e.target.value)}
                        />
                        <span className="text-[10px] uppercase font-mono mt-1 block">{theme.secondaryColor}</span>
                      </div>
                    </div>

                    <div className="color-editor-block">
                      <label className="text-[10px] text-white/50 block mb-1">لون الإضاءة (Accent)</label>
                      <div className="color-picker-input-container">
                        <input
                          type="color"
                          value={theme.accentColor}
                          onChange={(e) => updateThemeField('accentColor', e.target.value)}
                        />
                        <span className="text-[10px] uppercase font-mono mt-1 block">{theme.accentColor}</span>
                      </div>
                    </div>

                    <div className="color-editor-block">
                      <label className="text-[10px] text-white/50 block mb-1">لون الخلفية الأساسية</label>
                      <div className="color-picker-input-container">
                        <input
                          type="color"
                          value={theme.backgroundColor}
                          onChange={(e) => updateThemeField('backgroundColor', e.target.value)}
                        />
                        <span className="text-[10px] uppercase font-mono mt-1 block">{theme.backgroundColor}</span>
                      </div>
                    </div>

                    <div className="color-editor-block">
                      <label className="text-[10px] text-white/50 block mb-1">لون النصوص</label>
                      <div className="color-picker-input-container">
                        <input
                          type="color"
                          value={theme.textColor}
                          onChange={(e) => updateThemeField('textColor', e.target.value)}
                        />
                        <span className="text-[10px] uppercase font-mono mt-1 block">{theme.textColor}</span>
                      </div>
                    </div>

                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-responsive">
                  {/* Font family */}
                  <div className="form-group">
                    <label className="admin-label">نوع الخط المعتمد للموقع</label>
                    <select
                      value={theme.fontFamily}
                      onChange={(e) => updateThemeField('fontFamily', e.target.value)}
                      className="admin-input w-full"
                      style={{ background: 'var(--color-bg, #0B0E17)' }}
                    >
                      {FONTS.map((font) => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Card Opacity */}
                  <div className="form-group">
                    <label className="admin-label">درجة شفافية تأثير الزجاج للبطاقات</label>
                    <select
                      value={theme.cardColor}
                      onChange={(e) => updateThemeField('cardColor', e.target.value)}
                      className="admin-input w-full"
                      style={{ background: 'var(--color-bg, #0B0E17)' }}
                    >
                      <option value="rgba(255, 255, 255, 0.02)">زجاجي ناعم شفاف جداً (2%)</option>
                      <option value="rgba(255, 255, 255, 0.05)">زجاجي متوازن عادي (5%)</option>
                      <option value="rgba(255, 255, 255, 0.1)">زجاجي واضح (10%)</option>
                      <option value="rgba(255, 255, 255, 0.18)">زجاجي معتم قوي (18%)</option>
                      <option value="rgba(11, 14, 23, 0.35)">زجاجي داكن بلون الخلفية (35%)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-responsive">
                  {/* Border Radius */}
                  <div className="form-group">
                    <div className="flex justify-between items-center mb-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="admin-label m-0">حجم انحناء حواف البطاقات</label>
                      <span className="text-[11px] text-white/50 font-bold">{theme.borderRadius}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="32"
                      step="2"
                      value={parseInt(theme.borderRadius) || 0}
                      onChange={(e) => updateThemeField('borderRadius', `${e.target.value}px`)}
                      style={{
                        width: '100%',
                        accentColor: 'var(--color-primary, #C9A84C)',
                        height: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  {/* Animation Speed */}
                  <div className="form-group">
                    <div className="flex justify-between items-center mb-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="admin-label m-0">سرعة تأثيرات الحركة والأنيميشن</label>
                      <span className="text-[11px] text-white/50 font-bold">{theme.animationSpeed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.15"
                      value={parseFloat(theme.animationSpeed) || 1}
                      onChange={(e) => updateThemeField('animationSpeed', e.target.value)}
                      style={{
                        width: '100%',
                        accentColor: 'var(--color-primary, #C9A84C)',
                        height: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 6: RSVP Settings */}
          {activeTab === 'rsvp-settings' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-premium" style={{
              padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)'
            }}>
              <h2 className="font-amiri" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                خيارات تأكيد الحضور (RSVP Settings)
              </h2>
              <form onSubmit={handleSaveRSVPSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="rsvpEnabled"
                    checked={rsvpEnabled}
                    onChange={e => setRsvpEnabled(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary, #C9A84C)', cursor: 'pointer' }}
                  />
                  <label htmlFor="rsvpEnabled" style={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}>
                    تفعيل استمارة تأكيد الحضور للضيوف
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-responsive">
                  <div className="form-group">
                    <label className="admin-label">تاريخ الموعد النهائي للتأكيد (اختياري)</label>
                    <input
                      type="date"
                      value={rsvpDeadline}
                      onChange={e => setRsvpDeadline(e.target.value)}
                      className="admin-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="admin-label">الحد الأقصى للمرافقين لكل عائلة</label>
                    <select
                      value={rsvpMaxGuests}
                      onChange={e => setRsvpMaxGuests(parseInt(e.target.value))}
                      className="admin-input"
                      style={{ background: 'var(--color-bg, #0B0E17)' }}
                    >
                      <option value="1">بدون مرافقين (أنا فقط)</option>
                      <option value="2">مرافق واحد كحد أقصى</option>
                      <option value="3">مرافقين 2 كحد أقصى</option>
                      <option value="5">4 مرافقين كحد أقصى</option>
                      <option value="8">عائلة كاملة (مفتوح)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="primary-action admin-submit-btn">
                  <Save size={18} />
                  <span>حفظ خيارات الحضور</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* TAB 7: Data and Logs */}
          {activeTab === 'data' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

              {/* Wishes Wall items */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-premium" style={{
                padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', marginBottom: '1.25rem', justifyContent: 'space-between' }}>
                  <h3 className="font-amiri" style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>
                    التهاني والرسائل المنشورة على الجدار
                  </h3>
                  {wishes.length > 0 && (
                    <button type="button" onClick={handleClearWishes} className="text-xs text-rose-400 hover:underline flex items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={12} />
                      <span>حذف كافة التهاني</span>
                    </button>
                  )}
                </div>

                {wishes.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '2rem 0', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                    لا توجد تهاني منشورة حالياً لهذه الدعوة.
                  </p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }} className="admin-table">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>
                          <th style={{ padding: '10px 8px', width: '140px' }}>الاسم</th>
                          <th style={{ padding: '10px 8px' }}>نص الرسالة / التهنئة</th>
                          <th style={{ padding: '10px 8px', width: '100px' }}>الستايل</th>
                          <th style={{ padding: '10px 8px', width: '100px', textAlign: 'center' }}>إجراء</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishes.map((w) => (
                          <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>{w.name}</td>
                            <td style={{ padding: '10px 8px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{w.message}</td>
                            <td style={{ padding: '10px 8px' }}>
                              <span style={{ fontSize: '10px', color: 'var(--color-primary, #C9A84C)' }}>
                                {w.style === 'gold' ? 'ذهب ملكي' : w.style === 'rose' ? 'ورد جوري' : 'نجوم'}
                              </span>
                            </td>
                            <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                              <button
                                onClick={() => deleteWish(w.id)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                                title="حذف الرسالة"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>

              {/* Password Panel */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-premium" style={{
                padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)'
              }}>
                <h3 className="font-amiri" style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                  أمن وحماية لوحة التحكم
                </h3>
                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                  <div className="form-group">
                    <label className="admin-label">كلمة مرور لوحة التحكم الجديدة</label>
                    <input 
                      type="password" 
                      placeholder="اكتب الباسورد الجديد هنا" 
                      required 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)} 
                      className="admin-input text-center" 
                      style={{ letterSpacing: '2px' }}
                    />
                  </div>
                  {passwordSuccess && (
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>✓ تم تحديث كلمة المرور بنجاح.</span>
                  )}
                  <button type="submit" className="secondary-action" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--color-primary, #C9A84C)',
                    background: 'rgba(201, 168, 76, 0.05)',
                    color: 'var(--color-primary, #C9A84C)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    width: 'fit-content'
                  }}>
                    <Key size={16} />
                    <span>تحديث كلمة المرور</span>
                  </button>
                </form>
              </motion.div>

            </div>
          )}

        </section>
      </main>

      {/* 4. MODALS OVERLAYS */}
      
      {/* Create New Invitation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(4, 7, 15, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-premium"
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '2.5rem',
                borderRadius: '20px',
                background: '#0B0E17',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ position: 'absolute', left: '16px', top: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>

              <h3 className="font-amiri" style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                إنشاء دعوة زفاف جديدة
              </h3>

              <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(201, 168, 76, 0.06)',
                  border: '1px solid rgba(201, 168, 76, 0.15)',
                  fontSize: '0.8rem',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.6
                }}>
                  💡 سيتم إنشاء رابط الدعوة (Slug) تلقائياً من أسماء العريس والعروسة
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="admin-label">اسم العريس *</label>
                    <input type="text" required value={newGroom} onChange={e => setNewGroom(e.target.value)} className="admin-input" />
                  </div>
                  <div className="form-group">
                    <label className="admin-label">اسم العروسة *</label>
                    <input type="text" required value={newBride} onChange={e => setNewBride(e.target.value)} className="admin-input" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="admin-label">تاريخ الحفل الميلادي</label>
                    <input type="date" required value={newDate} onChange={e => setNewDate(e.target.value)} className="admin-input text-center" />
                  </div>
                  <div className="form-group">
                    <label className="admin-label">وقت الحفل</label>
                    <input type="time" required value={newTime} onChange={e => setNewTime(e.target.value)} className="admin-input text-center" />
                  </div>
                </div>


                {createError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0, fontWeight: 'bold' }}>⚠️ {createError}</p>
                )}

                <button type="submit" className="primary-action admin-submit-btn" style={{ width: '100%', margin: '10px 0 0 0', justifyContent: 'center' }}>
                  <Plus size={16} />
                  <span>تأكيد وإنشاء الدعوة</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(4, 7, 15, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-premium"
              style={{
                width: '100%',
                maxWidth: '420px',
                padding: '2.5rem',
                borderRadius: '20px',
                background: '#0B0E17',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <AlertTriangle size={28} />
              </div>

              <h3 className="font-amiri" style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 10px', color: '#FFF' }}>
                حذف الدعوة نهائياً؟
              </h3>

              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
                أنت على وشك حذف الدعوة ذات الرابط المخصص <strong style={{ color: 'var(--color-primary, #C9A84C)' }}>/{slugToDelete}</strong> بالكامل.
                <br />
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>تحذير:</span> سيتم مسح كافة البيانات والصور والألبوم، بالإضافة لجميع الردود (RSVPs) والتهاني بشكل دائم ولا يمكن التراجع عن هذا الإجراء.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#ef4444',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  نعم، احذف نهائياً
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setSlugToDelete(null); }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  تراجع وإلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import from Server Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(4, 7, 15, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-premium"
              style={{
                width: '100%',
                maxWidth: '460px',
                padding: '2.5rem',
                borderRadius: '20px',
                background: '#0B0E17',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => { setShowImportModal(false); setImportError(''); }}
                style={{ position: 'absolute', left: '16px', top: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>

              <h3 className="font-amiri" style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                استيراد دعوة من السيرفر
              </h3>

              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(201, 168, 76, 0.06)',
                border: '1px solid rgba(201, 168, 76, 0.15)',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.6,
                marginBottom: '1.25rem'
              }}>
                💡 أدخل معرف الدعوة (ID) واسم المستخدم (Slug) لجلب بيانات الدعوة من السيرفر وحفظها محلياً للتعديل.
              </div>

              <form onSubmit={handleImportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="admin-label">معرف الدعوة على السيرفر (Invitation ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 15"
                    value={importId}
                    onChange={(e) => { setImportId(e.target.value); setImportError(''); }}
                    className="admin-input"
                    style={{ direction: 'ltr', textAlign: 'right' }}
                  />
                </div>

                <div className="form-group">
                  <label className="admin-label">اسم المستخدم / رابط الدعوة (Slug) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ahmed-fatima-123"
                    value={importSlug}
                    onChange={(e) => { setImportSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')); setImportError(''); }}
                    className="admin-input"
                    style={{ direction: 'ltr', textAlign: 'right' }}
                  />
                </div>

                {importError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0, fontWeight: 'bold' }}>⚠️ {importError}</p>
                )}

                <button 
                  type="submit" 
                  disabled={isImporting}
                  className="primary-action admin-submit-btn" 
                  style={{ 
                    width: '100%', 
                    margin: '10px 0 0 0', 
                    justifyContent: 'center',
                    opacity: isImporting ? 0.7 : 1
                  }}
                >
                  <Download size={16} />
                  <span>{isImporting ? 'جاري الاستيراد...' : 'استيراد وفتح الدعوة'}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled helper CSS rules */}
      <style>{`
        .admin-label {
          font-size: 0.8rem;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 6px;
          display: block;
        }
        .admin-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: white;
          outline: none;
          font-size: 0.9rem;
          transition: all 0.3s;
        }
        .admin-input:focus {
          border-color: var(--color-primary, #C9A84C);
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.15);
        }
        .admin-submit-btn {
          width: fit-content;
          align-self: flex-start;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.8rem 2rem;
          border-radius: 10px;
          border: none;
          background: var(--color-primary, #C9A84C);
          color: var(--color-bg, #0B0E17);
          font-weight: bold;
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: 1rem;
          box-shadow: 0 4px 12px rgba(201, 168, 76, 0.2);
        }
        .color-picker-input-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 12px;
          text-align: center;
        }
        .color-picker-input-container input[type="color"] {
          width: 56px;
          height: 40px;
          border: 0;
          border-radius: 6px;
          cursor: pointer;
          background: none;
        }
        .admin-table th, .admin-table td {
          padding: 12px 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }
        .admin-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.01);
        }
        
        @media (max-width: 900px) {
          .admin-grid-container {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .grid-responsive-3 {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .grid-story-layout {
            grid-template-columns: 1fr 1fr !important;
          }
          .grid-story-layout > div:last-child {
            grid-column: span 2;
          }
        }
      `}</style>
    </div>
  );
}
