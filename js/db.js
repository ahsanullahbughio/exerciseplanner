// ============================================================
// IndexedDB wrapper — persistent in-browser storage
// ============================================================

const DB_NAME    = 'ExercisePlannerDB';
const DB_VERSION = 1;

let _db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (_db) { resolve(_db); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      // Routines store
      if (!db.objectStoreNames.contains('routines')) {
        const rs = db.createObjectStore('routines', { keyPath: 'id' });
        rs.createIndex('type', 'type', { unique: false });
        rs.createIndex('createdAt', 'createdAt', { unique: false });
      }
      // Sessions store
      if (!db.objectStoreNames.contains('sessions')) {
        const ss = db.createObjectStore('sessions', { keyPath: 'id' });
        ss.createIndex('routineId', 'routineId', { unique: false });
        ss.createIndex('date', 'date', { unique: false });
      }
      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
    req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
    req.onerror   = (e) => reject(e.target.error);
  });
}

function tx(storeName, mode, fn) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const t   = db.transaction(storeName, mode);
    const st  = t.objectStore(storeName);
    const req = fn(st);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  }));
}

function getAll(storeName) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const t   = db.transaction(storeName, 'readonly');
    const st  = t.objectStore(storeName);
    const req = st.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  }));
}

// ─── Routines ─────────────────────────────────────────────

const DB = {
  // Routines
  saveRoutine(routine) {
    if (!routine.id) routine.id = 'r_' + Date.now();
    if (!routine.createdAt) routine.createdAt = new Date().toISOString();
    routine.updatedAt = new Date().toISOString();
    return tx('routines', 'readwrite', st => st.put(routine)).then(() => routine);
  },
  getRoutines() {
    return getAll('routines').then(r => r.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
  },
  getRoutine(id) {
    return tx('routines', 'readonly', st => st.get(id));
  },
  deleteRoutine(id) {
    return tx('routines', 'readwrite', st => st.delete(id));
  },

  // Sessions
  saveSession(session) {
    if (!session.id) session.id = 's_' + Date.now();
    if (!session.date) session.date = new Date().toISOString();
    return tx('sessions', 'readwrite', st => st.put(session)).then(() => session);
  },
  getSessions() {
    return getAll('sessions').then(s => s.sort((a, b) => new Date(b.date) - new Date(a.date)));
  },
  getSession(id) {
    return tx('sessions', 'readonly', st => st.get(id));
  },
  getSessionsByRoutine(routineId) {
    return getAll('sessions').then(s =>
      s.filter(x => x.routineId === routineId).sort((a, b) => new Date(b.date) - new Date(a.date))
    );
  },
  deleteSession(id) {
    return tx('sessions', 'readwrite', st => st.delete(id));
  },

  // Settings
  getSetting(key) {
    return tx('settings', 'readonly', st => st.get(key)).then(r => r ? r.value : null);
  },
  setSetting(key, value) {
    return tx('settings', 'readwrite', st => st.put({ key, value }));
  }
};
