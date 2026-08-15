export default function Footer({ time }) {
  return (
    <footer className="footer">
      <p>Made with 💙 for <span className="jabber">my Jabber</span> — Grace</p>
      <p className="footer-time">{time}</p>
    </footer>
  );
}
