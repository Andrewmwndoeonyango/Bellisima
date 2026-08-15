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

/*
 * ── HOW TO SET UP YOUR FIREBASE ──
 *
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" → name it (e.g. "Bellisima")
 * 3. Disable Google Analytics (optional) → Create
 * 4. Left menu → "Realtime Database" → "Create Database"
 *    - Choose a region close to you
 *    - Start in TEST MODE (you can lock it down later)
 * 5. Left menu → ⚙️ Project Settings → General → scroll to "Your apps"
 * 6. Click the web icon </> → Register app → copy the firebaseConfig
 * 7. Paste your config below replacing the placeholder values
 */

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId:         "YOUR_PROJECT",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId:             "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const CHAT_PATH = 'us_chat';
const MAX_MESSAGES = 200;

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
