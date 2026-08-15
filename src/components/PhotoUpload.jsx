import { useState, useRef } from 'react';

export default function PhotoUpload({ onUpload }) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const inputRef = useRef(null);

  const handleFiles = (selected) => {
    const arr = Array.from(selected);
    if (arr.length === 0) return;
    setFiles(arr);
    // Preview first image
    const url = URL.createObjectURL(arr[0]);
    setPreview(url);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (files.length === 0) return;
    onUpload(files, caption.trim() || undefined);
    handleClose();
  };

  const handleClose = () => {
    if (preview) URL.revokeObjectURL(preview);
    setOpen(false);
    setFiles([]);
    setPreview(null);
    setCaption('');
  };

  const onFileChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  return (
    <>
      <div className="gallery-item gallery-upload" onClick={() => inputRef.current?.click()}>
        <div className="gallery-placeholder" style={{ '--hue': 210 }}>
          <span className="placeholder-icon">+</span>
          <span className="placeholder-text">Add Photo</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </div>

      {open && (
        <div className="upload-modal-overlay" onClick={handleClose}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <button className="upload-modal-close" onClick={handleClose}>&times;</button>

            <h3 className="upload-modal-title">Add a Memory 💙</h3>

            {preview && (
              <div className="upload-preview">
                <img src={preview} alt="Preview" />
                {files.length > 1 && (
                  <span className="upload-preview-count">+{files.length - 1} more</span>
                )}
              </div>
            )}

            <label className="upload-label">
              Give it a name
              <input
                className="upload-caption-input"
                type="text"
                placeholder="e.g. Our first date, That sunset, My favourite smile..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={80}
                autoFocus
              />
            </label>

            <div className="upload-actions">
              <button className="upload-btn-cancel" onClick={handleClose}>Cancel</button>
              <button className="upload-btn-save" onClick={handleSubmit}>
                Save {files.length > 1 ? `${files.length} Photos` : 'Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
