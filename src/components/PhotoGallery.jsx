import { useMemo } from 'react';
import { galleryPlaceholders, seededPhotos } from '../data';
import PhotoUpload from './PhotoUpload';

export default function PhotoGallery({ photos, onUpload, onRemove, onLightbox }) {
  // Combine seeded + uploaded photos, then fill remaining slots with placeholders
  const galleryItems = useMemo(() => {
    const items = [];

    // 1. Seeded photos (always show first)
    seededPhotos.forEach((s, i) => {
      items.push({
        type: 'seeded',
        id: `seeded-${i}`,
        src: s.src,
        caption: s.caption,
      });
    });

    // 2. Uploaded photos (from IndexedDB)
    photos.forEach((p) => {
      items.push({
        type: 'photo',
        id: p.id,
        blobUrl: URL.createObjectURL(p.blob),
        caption: p.caption,
      });
    });

    // 3. Fill remaining slots with placeholders (hide if we have enough photos)
    const totalPhotos = seededPhotos.length + photos.length;
    const remaining = galleryPlaceholders.length - totalPhotos;
    for (let i = 0; i < Math.max(0, remaining); i++) {
      const ph = galleryPlaceholders[i];
      items.push({ type: 'placeholder', index: i, ...ph });
    }

    return items;
  }, [photos]);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <section className="card glass-card gallery-section">
      <h3 className="card-title">📸 Our Moments</h3>
      <p className="counter-subtitle">Every picture tells a story, but with you, every story is a masterpiece</p>
      <div className="gallery-grid">
        {galleryItems.map((item, i) =>
          item.type === 'photo' ? (
            <div
              key={`photo-${item.id}`}
              className="gallery-item"
              onClick={() => onLightbox(i, galleryItems)}
            >
              <button
                className="gallery-delete-btn"
                onClick={(e) => handleDelete(e, item.id)}
                title="Delete photo"
              >
                ×
              </button>
              <img src={item.blobUrl} alt={item.caption} />
              <div className="gallery-caption">{item.caption}</div>
            </div>
          ) : item.type === 'seeded' ? (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => onLightbox(i, galleryItems)}
            >
              <img src={item.src} alt={item.caption} />
              <div className="gallery-caption">{item.caption}</div>
            </div>
          ) : (
            <div
              key={`ph-${item.index}`}
              className="gallery-item"
              onClick={() => onLightbox(i, galleryItems)}
            >
              <div className="gallery-placeholder" style={{ '--hue': item.hue }}>
                <span className="placeholder-icon">{item.icon}</span>
                <span className="placeholder-text">{item.label}</span>
              </div>
              <div className="gallery-caption">{item.caption}</div>
            </div>
          )
        )}
        <PhotoUpload onUpload={onUpload} />
      </div>
      <p className="gallery-hint">💡 Tap the + to add photos, × to remove — stored locally in your browser</p>
    </section>
  );
}
