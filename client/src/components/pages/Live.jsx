import { useState, useEffect } from 'react';

function Live() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const response = await fetch('https://retrieve-shows-api.azurewebsites.net/api/Shows?code=AmVc4bApim9xtR3Jl7y4FisknIJSgTrRHC4pPeB_q_9GAzFu1tILDg%3D%3D');

      if (!response.ok) {
        throw new Error('Failed to fetch shows');
      }

      const data = await response.json();
      console.log(data);
      setEvents(data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    });
  };

  const getGoogleMapsUrl = (event) => {
    const address = `${event.venue}, ${event.street}, ${event.city}, ${event.state} ${event.zip}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  if (loading) {
    return (
      <div className="page-container live-page">
        <h2>Live Shows</h2>
        <div className="live-content">
          <p>Loading shows...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container live-page">
        <h2>Live Shows</h2>
        <div className="live-content">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-container live-page">
        <h2>Live Shows</h2>
        <div id="events-list">
        {events.map(event => (
          <div key={event.id} className="event-item">
            <div className="event-container">
              <div className="event-info">
                <h3>{event.name || event.band}</h3>
                <p>{formatDate(event.date)}</p>
                <a
                  href={getGoogleMapsUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="venue-address"
                >
                  <span className="address-text">
                    {event.venue}<br />
                    {event.street}<br />
                    {event.city}, {event.state} {event.zip}<br />
                    {event.country}
                  </span>
                  <svg className="maps-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </a>
                {event.facebooK_LINK && (
                  <div className="facebook-link">
                    <img src="https://squarespacemusic.blob.core.windows.net/$web/facebook_icon.png" alt="Facebook" className="icon-img" />
                    <a href={event.facebooK_LINK} target="_blank" rel="noopener noreferrer">Facebook Event Link</a>
                  </div>
                )}
                {event.tickeT_LINK && (
                  <div className="ticket-link">
                    <img src="https://squarespacemusic.blob.core.windows.net/$web/ticket.png" alt="Tickets" className="icon-img" />
                    <a href={event.tickeT_LINK} target="_blank" rel="noopener noreferrer">Ticket Link</a>
                  </div>
                )}
                {event.promo && (
                  <div className="flyer-img">
                    <img src="https://squarespacemusic.blob.core.windows.net/$web/ticket.png" alt="Flyer" className="icon-img" />
                    <a href="#" onClick={(e) => { e.preventDefault(); setModalImage(event.promo); }}>Flyer</a>
                  </div>
                )}
              </div>
              {event.banD_IMAGE && (
                <div className="event-image">
                  <img src={event.banD_IMAGE} alt="Artist Image" className="event-img" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {modalImage && (
      <div className="flyer-modal-overlay" onClick={() => setModalImage(null)}>
        <div className="flyer-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="flyer-modal-close" onClick={() => setModalImage(null)}>&times;</button>
          <img src={modalImage} alt="Event Flyer" className="flyer-modal-image" />
        </div>
      </div>
    )}
    </>
  );
}

export default Live;