function Studio() {
  return (
    <div className="page-container studio-page">
      <h2>Studio</h2>
      <div className="studio-layout">
        <div className="studio-text">
          <p>
            Marshall runs the intimate recording studio Peregrine Engineering with a producer's mindset: by adeptly coaxing performances from artists that challenge their capacity, and by making decisive mix decisions aimed at creating the greatest emotional impact. His recording engineering focus is centered on capturing remarkable tones by making use of a high-end microphone locker (C414's, KM184's and a U87 Ai), analog outboard gear (Neve and API preamps, Pultec EQs and LA-2A / 1176-style compressors), an armory of amplifiers and cabinets made by Mesa Boogie, Soldano, Friedman, Randall, and plenty of digital processing power from Eventide, Strymon, and Neural DSP.
          </p>
          <p>
            Beyond providing recording and mixing services, Marshall also programs drums and electronic music.
          </p>
          <p>
            Marshall is also available for session work, providing professionally-record guitar, bass and baritone remotely or as a visitor to the studio of your choice in the central Texas region.
          </p>
          <p>
            To inquire about booking a session, send a message using the Contact link.
          </p>
        </div>
        <div className="studio-image">
          <img
            src="https://squarespacemusic.blob.core.windows.net/$web/studio.webp"
            alt="Peregrine Engineering Studio"
          />
        </div>
      </div>
      <div className="studio-content">
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/7v0C9tmdaQIKQej9kC15Px?utm_source=generator"
          width="100%"
          height="1000"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default Studio;