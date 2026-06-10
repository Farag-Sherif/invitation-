// IndexedDB Database Utility for Invitations, RSVPs, and Wishes

const DB_NAME = 'InvitationsDB';
const DB_VERSION = 1;

let dbInstance = null;
let useLocalStorageFallback = false;

// Default Seed Data
export const DEFAULT_WEDDING_DATA = {
  slug: 'fatima-mohamed',
  groomName: 'محمد',
  brideName: 'فاطمة',
  weddingDate: '2026-10-24',
  weddingTime: '19:00',
  hijriDate: '8 ربيع الآخر 1448 هـ',
  
  venueName: 'قصر النخيل الملكي',
  venueAddress: 'طريق الملك فهد، حي النخيل، الرياض، المملكة العربية السعودية',
  venueCity: 'حي النخيل، مدينة الرياض',
  venueDescription: 'يسعدنا استقبالكم في قاعة النخيل الكبرى بمدينة الرياض. تم تجهيز القاعة بكافة وسائل الراحة والتنظيم الفاخر لتشريف حضوركم الكريم ومشاركتنا لحظة العمر الموعودة.',
  mapLat: '24.7136',
  mapLng: '46.6753',

  loveStory: [
    {
      year: '٢٠٢٢',
      title: 'لقاء الصدفة الأولى',
      text: 'بدأت روايتنا بحديث بسيط، وكان واضحاً منذ اللحظة الأولى أن هناك شيئاً جميلاً يُخبئه لنا القدر ليكتمد يوماً ما.',
      icon: '✨'
    },
    {
      year: '٢٠٢٣',
      title: 'عهد المودة والمحبة',
      text: 'تقاربت الأرواح وتوحدت الكلمات، وتطورت تفاصيل رحلتنا بالاحترام والدعم المتبادل الذي صنع عمقاً ودفئاً في تفاصيلنا.',
      icon: '💞'
    },
    {
      year: '٢٠٢٥',
      title: 'الارتباط الرسمي والخطوبة',
      text: 'بين فرحة الأهل والأصدقاء وتوفيق الله، أعلنا رسمياً عهد الزواج والمسيرة المشتركة لبناء بيتنا السعيد الواعد.',
      icon: '💍'
    }
  ],

  invitationText: 'يتشرف أولياء الأمور بدعوتكم لحضور حفل الزفاف الميمون ومشاركتنا بهجة العمر وليلة الميثاق الغليظ.',
  
  galleryImages: [
    { id: '1', src: '/images/couple.png', label: 'العهد الميمون', aspect: 'portrait' },
    { id: '2', src: '/images/rings.png', label: 'تفاصيل الميثاق', aspect: 'square' },
    { id: '3', src: '/images/hall.png', label: 'قاعة الاحتفال الملكية', aspect: 'landscape' },
    { id: '4', src: '/images/couple.png', label: 'همس الوفاق', aspect: 'landscape' },
    { id: '5', src: '/images/rings.png', label: 'خواتم الزواج المبارك', aspect: 'portrait' }
  ],
  
  videos: [],
  rsvpSettings: {
    enabled: true,
    deadline: '',
    maxGuests: 5
  },
  customSections: [],
  
  theme: {
    primaryColor: '#C9A84C',
    secondaryColor: '#D4707A',
    accentColor: '#F9E8B9',
    backgroundColor: '#0B0E17',
    textColor: '#FFFFFF',
    cardColor: 'rgba(255, 255, 255, 0.03)',
    animationSpeed: '1',
    borderRadius: '16px',
    fontFamily: "'Tajawal', sans-serif"
  }
};

const DEFAULT_WISHES = [
  {
    id: 'w1',
    invitationSlug: 'fatima-mohamed',
    name: 'عائلة أبو محمد',
    message: 'ألف مبروك لأجمل عروسين محمد وفاطمة! جمع الله بينكما في خير ورزقكما السعادة الدائمة والذرية الصالحة.',
    style: 'gold',
    timestamp: '2026-06-07 18:30:00',
    date: 'منذ يوم'
  },
  {
    id: 'w2',
    invitationSlug: 'fatima-mohamed',
    name: 'عائلة أبو فاطمة',
    message: 'دامت أفراحكم عامرة بالحب والبهجة والسرور! تمنياتنا لكما بحياة زوجية سعيدة وهنيئة ملؤها الرضا والطمأنينة.',
    style: 'rose',
    timestamp: '2026-06-08 12:00:00',
    date: 'منذ ساعات'
  },
  {
    id: 'w3',
    invitationSlug: 'fatima-mohamed',
    name: 'أختك سارة',
    message: 'مبارك لك يا فاطمة ومبارك لك يا محمد. تمنياتي القلبية لكما برحلة عمر ملؤها التفاهم والسلام والسكينة والبيت المعمور.',
    style: 'starlight',
    timestamp: '2026-06-08 20:15:00',
    date: 'الآن'
  }
];

const DEFAULT_RSVPS = [
  {
    id: 'r1',
    invitationSlug: 'fatima-mohamed',
    name: 'أحمد علي',
    status: 'yes',
    guestsCount: '2',
    message: 'سأحضر الحفل',
    timestamp: '2026-06-08 19:00:00'
  }
];

// 1. Initialize DB
export function initDB() {
  return new Promise((resolve) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    if (!window.indexedDB) {
      console.warn('IndexedDB not supported, falling back to LocalStorage.');
      useLocalStorageFallback = true;
      resolve(null);
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (e) => {
        console.error('IndexedDB open error:', e);
        useLocalStorageFallback = true;
        resolve(null);
      };

      request.onsuccess = (e) => {
        dbInstance = e.target.result;
        console.log('IndexedDB initialized successfully.');
        seedInitialDataIfNeeded().then(() => resolve(dbInstance));
      };

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('invitations')) {
          db.createObjectStore('invitations', { keyPath: 'slug' });
        }
        if (!db.objectStoreNames.contains('rsvps')) {
          const rsvpStore = db.createObjectStore('rsvps', { keyPath: 'id' });
          rsvpStore.createIndex('invitationSlug', 'invitationSlug', { unique: false });
        }
        if (!db.objectStoreNames.contains('wishes')) {
          const wishesStore = db.createObjectStore('wishes', { keyPath: 'id' });
          wishesStore.createIndex('invitationSlug', 'invitationSlug', { unique: false });
        }
        console.log('IndexedDB schema upgraded/created.');
      };
    } catch (err) {
      console.error('Error during IndexedDB setup:', err);
      useLocalStorageFallback = true;
      resolve(null);
    }
  });
}

// Helper to seed data if database is empty
async function seedInitialDataIfNeeded() {
  const invitations = await getAllInvitations();
  if (invitations.length === 0) {
    console.log('No invitations found. Seeding default wedding data...');
    await saveInvitation(DEFAULT_WEDDING_DATA);
    
    // Seed default wishes
    for (const wish of DEFAULT_WISHES) {
      await saveWish(wish);
    }
    
    // Seed default RSVPs
    for (const rsvp of DEFAULT_RSVPS) {
      await saveRSVP(rsvp);
    }
    console.log('Default wedding data seeded successfully.');
  }
}

// 2. Generic LocalStorage Fallback Helpers
function getLS(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setLS(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

// 3. Database CRUD implementations

// GET ALL INVITATIONS
export function getAllInvitations() {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      const list = getLS('ls-invitations', []);
      resolve(list);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('invitations', 'readonly');
      const store = transaction.objectStore('invitations');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e);
    });
  });
}

// GET INVITATION BY SLUG
export function getInvitationBySlug(slug) {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      const list = getLS('ls-invitations', []);
      const found = list.find(item => item.slug === slug);
      resolve(found || null);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('invitations', 'readonly');
      const store = transaction.objectStore('invitations');
      const request = store.get(slug);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (e) => reject(e);
    });
  });
}

// SAVE/CREATE/UPDATE INVITATION
export function saveInvitation(invitation) {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      const list = getLS('ls-invitations', []);
      const index = list.findIndex(item => item.slug === invitation.slug);
      if (index >= 0) {
        list[index] = { ...list[index], ...invitation };
      } else {
        list.push(invitation);
      }
      setLS('ls-invitations', list);
      resolve(invitation);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('invitations', 'readwrite');
      const store = transaction.objectStore('invitations');
      const request = store.put(invitation);

      request.onsuccess = () => resolve(invitation);
      request.onerror = (e) => reject(e);
    });
  });
}

// SAVE MULTIPLE INVITATIONS (BULK)
export function saveMultipleInvitations(invitations) {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      const list = getLS('ls-invitations', []);
      invitations.forEach(invitation => {
        const index = list.findIndex(item => item.slug === invitation.slug);
        if (index >= 0) {
          list[index] = { ...list[index], ...invitation };
        } else {
          list.push(invitation);
        }
      });
      setLS('ls-invitations', list);
      resolve(invitations);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('invitations', 'readwrite');
      const store = transaction.objectStore('invitations');
      
      transaction.oncomplete = () => {
        resolve(invitations);
      };
      transaction.onerror = (e) => {
        reject(e);
      };

      invitations.forEach(inv => {
        store.put(inv);
      });
    });
  });
}

// DELETE INVITATION
export function deleteInvitation(slug) {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      let list = getLS('ls-invitations', []);
      list = list.filter(item => item.slug !== slug);
      setLS('ls-invitations', list);
      
      // Also delete RSVPs and wishes related to this slug
      let rsvps = getLS('ls-rsvps', []);
      rsvps = rsvps.filter(item => item.invitationSlug !== slug);
      setLS('ls-rsvps', rsvps);

      let wishes = getLS('ls-wishes', []);
      wishes = wishes.filter(item => item.invitationSlug !== slug);
      setLS('ls-wishes', wishes);

      resolve(true);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction(['invitations', 'rsvps', 'wishes'], 'readwrite');
      
      // Delete invitation
      transaction.objectStore('invitations').delete(slug);

      // Clean up RSVPs and wishes asynchronously in IDB using cursor or index
      // For IDB transaction completion we can just wait for transactions to end.
      transaction.oncomplete = () => {
        // Run cleanup of rsvps & wishes
        cleanupOrphanRecords(slug);
        resolve(true);
      };
      transaction.onerror = (e) => reject(e);
    });
  });
}

// Internal helper to clean up rsvps & wishes from IDB
async function cleanupOrphanRecords(slug) {
  const db = await initDB();
  
  // Clean RSVPs
  const rsvpTx = db.transaction('rsvps', 'readwrite');
  const rsvpStore = rsvpTx.objectStore('rsvps');
  const rsvpIndex = rsvpStore.index('invitationSlug');
  const rsvpRequest = rsvpIndex.openCursor(IDBKeyRange.only(slug));
  rsvpRequest.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      cursor.delete();
      cursor.continue();
    }
  };

  // Clean Wishes
  const wishTx = db.transaction('wishes', 'readwrite');
  const wishStore = wishTx.objectStore('wishes');
  const wishIndex = wishStore.index('invitationSlug');
  const wishRequest = wishIndex.openCursor(IDBKeyRange.only(slug));
  wishRequest.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      cursor.delete();
      cursor.continue();
    }
  };
}

// GET RSVPS FOR SLUG
export function getRSVPs(slug) {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      const list = getLS('ls-rsvps', []);
      const filtered = list.filter(item => item.invitationSlug === slug);
      resolve(filtered);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('rsvps', 'readonly');
      const store = transaction.objectStore('rsvps');
      const index = store.index('invitationSlug');
      const request = index.getAll(IDBKeyRange.only(slug));

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e);
    });
  });
}

// SAVE RSVP
export function saveRSVP(rsvp) {
  return new Promise((resolve, reject) => {
    if (!rsvp.id) {
      rsvp.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    }
    if (!rsvp.timestamp) {
      rsvp.timestamp = new Date().toLocaleString('ar-EG');
    }

    if (useLocalStorageFallback) {
      const list = getLS('ls-rsvps', []);
      const index = list.findIndex(item => item.id === rsvp.id);
      if (index >= 0) {
        list[index] = { ...list[index], ...rsvp };
      } else {
        list.push(rsvp);
      }
      setLS('ls-rsvps', list);
      resolve(rsvp);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('rsvps', 'readwrite');
      const store = transaction.objectStore('rsvps');
      const request = store.put(rsvp);

      request.onsuccess = () => resolve(rsvp);
      request.onerror = (e) => reject(e);
    });
  });
}

// DELETE RSVP
export function deleteRSVP(id) {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      let list = getLS('ls-rsvps', []);
      list = list.filter(item => item.id !== id);
      setLS('ls-rsvps', list);
      resolve(true);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('rsvps', 'readwrite');
      const store = transaction.objectStore('rsvps');
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e);
    });
  });
}

// GET WISHES FOR SLUG
export function getWishes(slug) {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      const list = getLS('ls-wishes', []);
      const filtered = list.filter(item => item.invitationSlug === slug);
      resolve(filtered);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('wishes', 'readonly');
      const store = transaction.objectStore('wishes');
      const index = store.index('invitationSlug');
      const request = index.getAll(IDBKeyRange.only(slug));

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (e) => reject(e);
    });
  });
}

// SAVE WISH
export function saveWish(wish) {
  return new Promise((resolve, reject) => {
    if (!wish.id) {
      wish.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    }
    if (!wish.timestamp) {
      wish.timestamp = new Date().toLocaleString('ar-EG');
    }

    if (useLocalStorageFallback) {
      const list = getLS('ls-wishes', []);
      const index = list.findIndex(item => item.id === wish.id);
      if (index >= 0) {
        list[index] = { ...list[index], ...wish };
      } else {
        list.push(wish);
      }
      setLS('ls-wishes', list);
      resolve(wish);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('wishes', 'readwrite');
      const store = transaction.objectStore('wishes');
      const request = store.put(wish);

      request.onsuccess = () => resolve(wish);
      request.onerror = (e) => reject(e);
    });
  });
}

// DELETE WISH
export function deleteWish(id) {
  return new Promise((resolve, reject) => {
    if (useLocalStorageFallback) {
      let list = getLS('ls-wishes', []);
      list = list.filter(item => item.id !== id);
      setLS('ls-wishes', list);
      resolve(true);
      return;
    }

    initDB().then((db) => {
      const transaction = db.transaction('wishes', 'readwrite');
      const store = transaction.objectStore('wishes');
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (e) => reject(e);
    });
  });
}
