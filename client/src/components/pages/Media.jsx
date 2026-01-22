import { useState } from 'react';

function Media({ activeSubpage, setActiveSubpage }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { id: 'UYBzJL1ZT3A', title: 'Video 1' },
    { id: '3xi1UQCLTlw', title: 'Video 2' },
    { id: 'MLdBw__xAus', title: 'Video 3' },
    { id: 'zp-Q_c3p6Cc', title: 'Video 4' },
    { id: 'h-fkJSswkK4', title: 'Video 5' },
  ];

  const closeModal = () => setSelectedVideo(null);

  return (
    <div className="page-container media-page">
      <h2>Media</h2>

      <div className="media-nav">
        <button
          className={activeSubpage === 'music' ? 'active' : ''}
          onClick={() => setActiveSubpage('music')}
        >
          Music
        </button>
        <button
          className={activeSubpage === 'video' ? 'active' : ''}
          onClick={() => setActiveSubpage('video')}
        >
          Video
        </button>
      </div>

      <div className="media-content">
        {activeSubpage === 'music' && (
          <div className="music-section">
            <h3>Music</h3>
            <iframe
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/artist/4cybofvMhNCcdfGKkGrV5C?utm_source=generator"
              width="100%"
              height="420"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <iframe
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/artist/6qQ5vFpVQMLMiBWUlszpOU?utm_source=generator"
              width="100%"
              height="720"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
            <iframe
              style={{ borderRadius: '12px' }}
              src="https://open.spotify.com/embed/artist/6rkyR5e6I5KwIgvEFTrGuR?utm_source=generator"
              width="100%"
              height="720"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        )}
        {activeSubpage === 'video' && (
          <div className="video-section">
            <h3>Video</h3>
            <div className="video-carousel">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="video-thumbnail"
                  onClick={() => setSelectedVideo(video.id)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                    alt={video.title}
                  />
                  <div className="video-play-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://www.youtube.com/@marshallstacks_striker"
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-channel-link"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              See more videos on the @marshallstack_striker YouTube channel
            </a>
          </div>
        )}
      </div>

      {selectedVideo && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeModal}>&times;</button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Media;