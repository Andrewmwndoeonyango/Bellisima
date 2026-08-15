import { openDB } from 'idb';

const DB_NAME = 'bellisima_db';
const DB_VERSION = 1;

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });
}

// Photo CRUD
export async function addPhoto(blob, caption) {
  const db = await getDB();
  const id = await db.add('photos', { blob, caption, createdAt: Date.now() });
  return { id, blob, caption, createdAt: Date.now() };
}

export async function getAllPhotos() {
  const db = await getDB();
  return db.getAll('photos');
}

export async function deletePhoto(id) {
  const db = await getDB();
  await db.delete('photos', id);
}

// Settings CRUD
export async function getSetting(key) {
  const db = await getDB();
  const record = await db.get('settings', key);
  return record ? record.value : null;
}

export async function putSetting(key, value) {
  const db = await getDB();
  await db.put('settings', { key, value });
}
