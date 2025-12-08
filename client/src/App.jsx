import { useState, useEffect } from 'react'
import './App.css'
import BandManager from './components/BandManager';
import EventManager from './components/EventManager';
import VenueManager from './components/VenueManager';

function App() {
  const [activeTab, setActiveTab] = useState('events');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        const { clientPrincipal } = payload;
        setUserInfo(clientPrincipal);
      } catch (error) {
        console.error('No user info found', error);
      }
    }
    getUserInfo();
  }, []);

  if (!userInfo) {
    return (
      <div className="App">
        <h1>Live Shows App</h1>
        <div className="login-container">
          <p>Please login to manage live shows.</p>
          <a href="/.auth/login/aad">Login with Microsoft</a>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Live Shows App</h1>
        <div className="user-info">
          <span>Welcome, {userInfo.userDetails}</span>
          <a href="/.auth/logout">Logout</a>
        </div>
      </header>
      
      <div className="tabs">
        <button onClick={() => setActiveTab('events')} disabled={activeTab === 'events'}>Events</button>
        <button onClick={() => setActiveTab('venues')} disabled={activeTab === 'venues'}>Venues</button>
        <button onClick={() => setActiveTab('bands')} disabled={activeTab === 'bands'}>Bands</button>
      </div>

      <div className="content">
        {activeTab === 'bands' && <BandManager />}
        {activeTab === 'events' && <EventManager />}
        {activeTab === 'venues' && <VenueManager />}
      </div>
    </div>
  )
}

export default App
