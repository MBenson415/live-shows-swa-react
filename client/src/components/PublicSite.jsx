import { useState, useEffect } from 'react';
import About from './pages/About';
import Projects from './pages/Projects';
import Live from './pages/Live';
import Press from './pages/Press';
import Media from './pages/Media';
import Studio from './pages/Studio';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import '../styles/PublicSite.css';

function PublicSite({ onNavigateToAdmin }) {
  const [activePage, setActivePage] = useState('about');
  const [mediaSubpage, setMediaSubpage] = useState('music');

  // Prefetch events on site load
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  // Prefetch blog posts on site load
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('https://retrieve-shows-api.azurewebsites.net/api/Shows?code=AmVc4bApim9xtR3Jl7y4FisknIJSgTrRHC4pPeB_q_9GAzFu1tILDg%3D%3D');
        if (!response.ok) {
          throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        setEvents(data);
        setEventsLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setEventsError(err.message);
        setEventsLoading(false);
      }
    }

    async function fetchBlogPosts() {
      try {
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
        setBlogLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setBlogError(err.message);
        setBlogLoading(false);
      }
    }

    fetchEvents();
    fetchBlogPosts();
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'live':
        return <Live events={events} loading={eventsLoading} error={eventsError} />;
      case 'press':
        return <Press />;
      case 'media':
        return <Media activeSubpage={mediaSubpage} setActiveSubpage={setMediaSubpage} />;
      case 'studio':
        return <Studio />;
      case 'contact':
        return <Contact />;
      case 'blog':
        return <Blog posts={blogPosts} loading={blogLoading} error={blogError} />;
      default:
        return <About />;
    }
  };

  return (
    <div className="public-site">
      <header className="public-header">
        <h1 className="site-title">Marshall Benson</h1>
        <div className="site-subtitle-wrapper">
          <img src="https://squarespacemusic.blob.core.windows.net/$web/copilot_striker_cropped.png" alt="The Striker" className="site-subtitle-image" />
        </div>
        <nav className="main-nav">
          <button
            className={activePage === 'about' ? 'active' : ''}
            onClick={() => setActivePage('about')}
          >
            Home
          </button>
          <button
            className={activePage === 'projects' ? 'active' : ''}
            onClick={() => setActivePage('projects')}
          >
            Projects
          </button>
          <button
            className={activePage === 'live' ? 'active' : ''}
            onClick={() => setActivePage('live')}
          >
            Live
          </button>
          <button
            className={activePage === 'press' ? 'active' : ''}
            onClick={() => setActivePage('press')}
          >
            Press
          </button>
          <button
            className={activePage === 'media' ? 'active' : ''}
            onClick={() => setActivePage('media')}
          >
            Media
          </button>
          <button
            className={activePage === 'blog' ? 'active' : ''}
            onClick={() => setActivePage('blog')}
          >
            Blog
          </button>
          <button
            className={activePage === 'studio' ? 'active' : ''}
            onClick={() => setActivePage('studio')}
          >
            Studio
          </button>
          <button
            className={activePage === 'contact' ? 'active' : ''}
            onClick={() => setActivePage('contact')}
          >
            Contact
          </button>
          <button
            className="admin-button"
            onClick={onNavigateToAdmin}
          >
            Admin
          </button>
        </nav>
      </header>

      <main className="public-content">
        {renderPage()}
      </main>

      <footer className="public-footer">
        <div className="social-links">
          <a href="https://instagram.com/marshallstacks.atx" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://open.spotify.com/playlist/7v0C9tmdaQIKQej9kC15Px?si=b34e644e04024804" target="_blank" rel="noopener noreferrer" aria-label="Spotify">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/marshall.benson/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://x.com/thestrikeratx" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/@marshallstacks_striker" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Marshall Benson. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PublicSite;