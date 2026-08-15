import { useState, useRef, useEffect, useCallback } from 'react';
import useRealTimeClock from './hooks/useRealTimeClock';
import useCounters from './hooks/useCounters';
import usePhotos from './hooks/usePhotos';

import ParticlesCanvas from './components/ParticlesCanvas';
import CursorTrail from './components/CursorTrail';
import Hero from './components/Hero';
import LoveCounter from './components/LoveCounter';
import BirthdayCountdown from './components/BirthdayCountdown';
import LoveMessages from './components/LoveMessages';
import ReasonsGrid from './components/ReasonsGrid';
import PhotoGallery from './components/PhotoGallery';
import Lightbox from './components/Lightbox';
import LoveLetter from './components/LoveLetter';
import Playlist from './components/Playlist';
import PromisesList from './components/PromisesList';
import ComplimentButton from './components/ComplimentButton';
import HeartBurst from './components/HeartBurst';
import ChatPanel from './components/ChatPanel';
import Footer from './components/Footer';

export default function App() {
  const clock = useRealTimeClock();
  const { life, birthday } = useCounters();
  const { photos, upload, remove } = usePhotos();
  const heartRef = useRef(null);

  // Lightbox state
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const [lbItems, setLbItems] = useState([]);

  const openLightbox = useCallback((index, items) => {
    setLbIndex(index);
    setLbItems(items);
    setLbOpen(true);
  }, []);

  const navigateLightbox = useCallback((dir) => {
    setLbIndex((prev) => (prev + dir + lbItems.length) % lbItems.length);
  }, [lbItems.length]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.glass-card').forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  });

  const handleHearts = useCallback((x, y, count) => {
    heartRef.current?.burst(x, y, count);
  }, []);

  const handleLightboxDelete = useCallback((id) => {
    remove(id);
    setLbOpen(false);
  }, [remove]);

  return (
    <>
      <ParticlesCanvas />

      <div className="container">
        <Hero
          greeting={clock.greeting}
          subtitle={clock.subtitle}
          date={clock.date}
          time={clock.time}
        />
        <LoveCounter life={life} />
        <BirthdayCountdown birthday={birthday} />
        <LoveMessages />
        <ReasonsGrid />
        <PhotoGallery
          photos={photos}
          onUpload={upload}
          onRemove={remove}
          onLightbox={openLightbox}
        />
        <LoveLetter />
        <Playlist />
        <PromisesList onHeartBurst={handleHearts} />
        <Footer time={clock.time} />
      </div>

      <Lightbox
        isOpen={lbOpen}
        index={lbIndex}
        items={lbItems}
        onClose={() => setLbOpen(false)}
        onNavigate={navigateLightbox}
        onDelete={handleLightboxDelete}
      />

      <ComplimentButton onHearts={handleHearts} />
      <HeartBurst ref={heartRef} />
      <ChatPanel />
      <CursorTrail />
    </>
  );
}
