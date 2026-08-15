import { useState, useEffect, useCallback } from 'react';
import { getAllPhotos, addPhoto, deletePhoto } from '../db';

export default function usePhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPhotos().then((p) => {
      setPhotos(p);
      setLoading(false);
    });
  }, []);

  const upload = useCallback(async (files, caption) => {
    const newPhotos = [];
    for (const file of files) {
      const name = caption || file.name.replace(/\.[^.]+$/, '');
      const photo = await addPhoto(file, name);
      newPhotos.push(photo);
    }
    setPhotos((prev) => [...prev, ...newPhotos]);
  }, []);

  const remove = useCallback(async (id) => {
    await deletePhoto(id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { photos, loading, upload, remove };
}
