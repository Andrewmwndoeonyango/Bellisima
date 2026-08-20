import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  get,
  onValue,
  onChildAdded,
  onChildRemoved,
  query,
  limitToLast,
  serverTimestamp,
  remove,
} from 'firebase/database';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:            "AIzaSyD8RH5xUqTOQbhwS0qT7O8bYSt6CAOXrF0",
  authDomain:        "bellisima-bfd22.firebaseapp.com",
  databaseURL:       "https://bellisima-bfd22-default-rtdb.firebaseio.com",
  projectId:         "bellisima-bfd22",
  storageBucket:     "bellisima-bfd22.firebasestorage.app",
  messagingSenderId: "1076106831846",
  appId:             "1:1076106831846:web:e1656441fd3a9df1e39827",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// ── Known users map (email → display name) ──
const KNOWN_USERS = {
  'amwandoeonyango@gmail.com': 'Andy',
  'njerugrace326@gmail.com': 'Grace',
};

const CHAT_PATH = 'us_chat';
const MAX_MESSAGES = 500;

// ── Auth helpers ──
export function getDisplayName(user) {
  if (!user) return 'Guest';
  return KNOWN_USERS[user.email] || user.email.split('@')[0];
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Chat helpers ──
export function sendMessage(sender, text) {
  if (!text.trim()) return;
  const chatRef = ref(db, CHAT_PATH);
  return push(chatRef, {
    sender,
    text: text.trim(),
    timestamp: serverTimestamp(),
  });
}

export function listenForMessages(onNew, onRemove) {
  const q = query(ref(db, CHAT_PATH), limitToLast(MAX_MESSAGES));

  const unsubAdded = onChildAdded(q, (snapshot) => {
    onNew({ id: snapshot.key, ...snapshot.val() });
  });

  let unsubRemoved = null;
  if (onRemove) {
    unsubRemoved = onChildRemoved(ref(db, CHAT_PATH), (snapshot) => {
      onRemove(snapshot.key);
    });
  }

  return () => {
    unsubAdded();
    if (unsubRemoved) unsubRemoved();
  };
}

export function clearAllMessages() {
  return remove(ref(db, CHAT_PATH));
}

// ── Promises helpers ──
const PROMISES_PATH = 'us_promises';

export function listenForPromises(onUpdate) {
  const promisesRef = ref(db, PROMISES_PATH);
  const unsub = onValue(promisesRef, (snapshot) => {
    onUpdate(snapshot.val() || []);
  });
  return unsub;
}

export function setPromises(checkedIndices) {
  return set(ref(db, PROMISES_PATH), checkedIndices);
}

// ── Ping ("Thinking of You") helpers ──
const PINGS_PATH = 'us_pings';

export function sendPing(sender) {
  return push(ref(db, PINGS_PATH), {
    sender,
    timestamp: serverTimestamp(),
  });
}

export function listenForPings(onNew) {
  const unsub = onChildAdded(ref(db, PINGS_PATH), (snapshot) => {
    onNew({ id: snapshot.key, ...snapshot.val() });
  });
  return () => unsub();
}

export function clearPings() {
  return remove(ref(db, PINGS_PATH));
}

// ── Mood check-in helpers ──
const MOODS_PATH = 'us_moods';

export function setMood(userId, emoji) {
  const today = new Date().toISOString().slice(0, 10);
  return set(ref(db, `${MOODS_PATH}/${today}/${userId}`), {
    emoji,
    timestamp: serverTimestamp(),
  });
}

export function listenForMoods(onUpdate) {
  const unsub = onValue(ref(db, MOODS_PATH), (snapshot) => {
    onUpdate(snapshot.val() || {});
  });
  return unsub;
}

// ── Streak tracker helpers ──
const STREAK_PATH = 'us_streak';

export function updateStreak(userId) {
  const today = new Date().toISOString().slice(0, 10);
  return update(ref(db, STREAK_PATH), {
    [`${userId}_lastVisit`]: today,
  });
}

export function listenForStreak(onUpdate) {
  const unsub = onValue(ref(db, STREAK_PATH), (snapshot) => {
    onUpdate(snapshot.val() || {});
  });
  return unsub;
}

// ── Next date countdown helpers ──
const NEXTDATE_PATH = 'us_nextdate';

export function setNextDate(dateStr, title) {
  return set(ref(db, NEXTDATE_PATH), { date: dateStr, title });
}

export function listenForNextDate(onUpdate) {
  const unsub = onValue(ref(db, NEXTDATE_PATH), (snapshot) => {
    onUpdate(snapshot.val() || null);
  });
  return unsub;
}

// ── Daily love question helpers ──
const DAILYQ_PATH = 'us_dailyq';

export function setDailyAnswer(userId, question, answer) {
  const today = new Date().toISOString().slice(0, 10);
  return set(ref(db, `${DAILYQ_PATH}/${today}/${userId}`), {
    question,
    answer,
    timestamp: serverTimestamp(),
  });
}

export function listenForDailyAnswers(onUpdate) {
  const unsub = onValue(ref(db, DAILYQ_PATH), (snapshot) => {
    onUpdate(snapshot.val() || {});
  });
  return unsub;
}

// ── Milestones helpers ──
const MILESTONES_PATH = 'us_milestones';

export function setMilestone(key, data) {
  return set(ref(db, `${MILESTONES_PATH}/${key}`), data);
}

export function listenForMilestones(onUpdate) {
  const unsub = onValue(ref(db, MILESTONES_PATH), (snapshot) => {
    onUpdate(snapshot.val() || {});
  });
  return unsub;
}

// ── Journal helpers ──
const JOURNAL_PATH = 'us_journal';

export function addJournalEntry(author, text) {
  return push(ref(db, JOURNAL_PATH), {
    author,
    text: text.trim(),
    timestamp: serverTimestamp(),
  });
}

export function listenForJournal(onNew) {
  const unsub = onChildAdded(ref(db, JOURNAL_PATH), (snapshot) => {
    onNew({ id: snapshot.key, ...snapshot.val() });
  });
  return () => unsub();
}

export function listenForAllJournal(onUpdate) {
  const unsub = onValue(ref(db, JOURNAL_PATH), (snapshot) => {
    const data = snapshot.val() || {};
    const entries = Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
    onUpdate(entries);
  });
  return unsub;
}

// ── Bucket list helpers ──
const BUCKET_PATH = 'us_bucketlist';

export function listenForBucketList(onUpdate) {
  const unsub = onValue(ref(db, BUCKET_PATH), (snapshot) => {
    onUpdate(snapshot.val() || []);
  });
  return unsub;
}

export function setBucketList(items) {
  return set(ref(db, BUCKET_PATH), items);
}

// ── Shared playlist helpers ──
const PLAYLIST_PATH = 'us_playlist';

export function listenForSharedPlaylist(onUpdate) {
  const unsub = onValue(ref(db, PLAYLIST_PATH), (snapshot) => {
    onUpdate(snapshot.val() || []);
  });
  return unsub;
}

export function setSharedPlaylist(items) {
  return set(ref(db, PLAYLIST_PATH), items);
}

// ── Photo reactions helpers ──
const REACTIONS_PATH = 'us_reactions';

export function toggleReaction(photoId, userId) {
  return set(ref(db, `${REACTIONS_PATH}/${photoId}/${userId}`), {
    timestamp: serverTimestamp(),
  });
}

export function removeReaction(photoId, userId) {
  return remove(ref(db, `${REACTIONS_PATH}/${photoId}/${userId}`));
}

export function listenForReactions(onUpdate) {
  const unsub = onValue(ref(db, REACTIONS_PATH), (snapshot) => {
    onUpdate(snapshot.val() || {});
  });
  return unsub;
}

// ── Get all chat messages (for memory replay) ──
export function getAllMessages() {
  return get(ref(db, CHAT_PATH)).then((snapshot) => {
    const data = snapshot.val() || {};
    return Object.entries(data).map(([key, val]) => ({ id: key, ...val }));
  });
}
