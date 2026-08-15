import { playlistSongs } from '../data';

export default function Playlist() {
  return (
    <section className="card glass-card playlist-section">
      <h3 className="card-title">🎵 Our Soundtrack</h3>
      <p className="counter-subtitle">Songs that remind me of you, my Jabber</p>
      <div className="playlist-list">
        {playlistSongs.map((song, i) => (
          <div key={i} className="playlist-item">
            <span className="playlist-number">{String(i + 1).padStart(2, '0')}</span>
            <div className="playlist-info">
              <div className="playlist-title">{song.title}</div>
              <div className="playlist-artist">{song.artist}</div>
            </div>
            <span className="playlist-reason">{song.reason}</span>
          </div>
        ))}
      </div>
      <p className="playlist-note">Press play and let the music tell you how I feel 💙</p>
    </section>
  );
}
