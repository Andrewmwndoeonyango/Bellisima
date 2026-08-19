import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
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
