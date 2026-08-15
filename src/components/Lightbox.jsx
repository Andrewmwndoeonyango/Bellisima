import { useEffect, useCallback } from 'react';

export default function Lightbox({ isOpen, index, items, onClose, onNavigate, onDelete }) {
  const handleKey = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') onNavigate(-1);
    if (e.key === 'ArrowRight') onNavigate(1);
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (onDelete && items[index]?.type === 'photo') {
        onDelete(items[index].id);
      }
    }
  }, [isOpen, onClose, onNavigate, onDelete, items, index]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !items[index]) return null;

  const item = items[index];
  const isPhoto = item.type === 'photo' || item.type === 'seeded';
  const imgSrc = item.type === 'photo' ? item.blobUrl : item.type === 'seeded' ? item.src : null;
  const canDelete = item.type === 'photo' && onDelete;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (canDelete) onDelete(item.id);
  };

  return (
    <div className={`lightbox${isOpen ? ' active' : ''}`} onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>&times;</button>
      {canDelete && (
        <button className="lightbox-delete" onClick={handleDelete} title="Delete photo">
          🗑️
        </button>
      )}
      <button className="lightbox-nav lightbox-prev" onClick={(e) => { e.stopPropagation(); onNavigate(-1); }}>&#10094;</button>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {isPhoto && imgSrc ? (
          <img src={imgSrc} alt={item.caption} className="visible" />
        ) : (
          <div className="lightbox-placeholder">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        )}
        <p className="lightbox-caption">{item.caption}</p>
      </div>
      <button className="lightbox-nav lightbox-next" onClick={(e) => { e.stopPropagation(); onNavigate(1); }}>&#10095;</button>
    </div>
  );
}
