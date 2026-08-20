import { useState, useEffect, useRef } from 'react';
import { playlistSongs } from '../data';
import { listenForSharedPlaylist, setSharedPlaylist } from '../chat';

function ytSearchUrl(title, artist) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${artist}`)}`;
}

export default function Playlist({ userName }) {
  const [customSongs, setCustomSongs] = useState([]);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newReason, setNewReason] = useState('');
  const [playingIdx, setPlayingIdx] = useState(null);
  const iframeRef = useRef(null);

  // Merge hardcoded + shared songs
  const allSongs = [...playlistSongs, ...customSongs];

  useEffect(() => {
    const unsub = listenForSharedPlaylist((data) => {
      setCustomSongs(Array.isArray(data) ? data : []);
    });
    return unsub;
  }, []);

  const handlePlay = (i) => {
    if (playingIdx === i) {
      setPlayingIdx(null);
    } else {
      setPlayingIdx(i);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) return;
    const song = {
      title: newTitle.trim(),
      artist: newArtist.trim(),
      reason: newReason.trim() || '💙',
      addedBy: userName,
    };
    const next = [...customSongs, song];
    setSharedPlaylist(next);
    setNewTitle('');
    setNewArtist('');
    setNewReason('');
    setAdding(false);
  };

  const handleRemove = (i) => {
    const customIdx = i - playlistSongs.length;
    if (customIdx < 0) return; // Can't remove hardcoded songs
    const next = customSongs.filter((_, idx) => idx !== customIdx);
    setSharedPlaylist(next);
    setPlayingIdx(null);
  };

  const currentSong = playingIdx !== null ? allSongs[playingIdx] : null;

  return (
    <section className="card glass-card playlist-section">
      <h3 className="card-title">🎵 Our Soundtrack</h3>
      <p className="counter-subtitle">Tap a song to play it — add your own too!</p>

      {/* YouTube player */}
      {currentSong && (
        <div className="playlist-player">
          <div className="playlist-now-playing">
            <span className="playlist-now-icon">🎶</span>
            <span className="playlist-now-title">{currentSong.title} — {currentSong.artist}</span>
            <button className="playlist-close-player" onClick={() => setPlayingIdx(null)}>✕</button>
          </div>
          <a
            href={ytSearchUrl(currentSong.title, currentSong.artist)}
            target="_blank"
            rel="noopener noreferrer"
            className="playlist-yt-link"
          >
            ▶ Open in YouTube to listen
          </a>
        </div>
      )}

      <div className="playlist-list">
        {allSongs.map((song, i) => {
          const isCustom = i >= playlistSongs.length;
          return (
            <div
              key={i}
              className={`playlist-item${playingIdx === i ? ' playing' : ''}`}
            >
              <button
                className="playlist-play-btn"
                onClick={() => handlePlay(i)}
                title="Play"
              >
                {playingIdx === i ? '⏸' : '▶'}
              </button>
              <span className="playlist-number">{String(i + 1).padStart(2, '0')}</span>
              <div className="playlist-info">
                <div className="playlist-title">{song.title}</div>
                <div className="playlist-artist">{song.artist}</div>
              </div>
              <span className="playlist-reason">{song.reason}</span>
              {isCustom && (
                <button
                  className="playlist-remove-btn"
                  onClick={() => handleRemove(i)}
                  title="Remove"
                >
                  ×
                </button>
              )}
              {song.addedBy && (
                <span className="playlist-added-by">+{song.addedBy}</span>
              )}
            </div>
          );
        })}
      </div>

      {adding ? (
        <form className="playlist-add-form" onSubmit={handleAdd}>
          <input
            className="playlist-add-input"
            placeholder="Song title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <input
            className="playlist-add-input"
            placeholder="Artist"
            value={newArtist}
            onChange={(e) => setNewArtist(e.target.value)}
            required
          />
          <input
            className="playlist-add-input"
            placeholder="Why this song? (optional)"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            maxLength={100}
          />
          <div className="playlist-add-btns">
            <button className="playlist-save-btn" type="submit">Add</button>
            <button className="playlist-cancel-btn" type="button" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="playlist-add-song-btn" onClick={() => setAdding(true)}>
          + Add a song
        </button>
      )}

      <p className="playlist-note">Press play and let the music tell you how I feel 💙</p>
    </section>
  );
}
