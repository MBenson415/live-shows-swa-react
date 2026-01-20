import { useState, useEffect } from 'react'
import './App.css'
import BandManager from './components/BandManager';
import EventManager from './components/EventManager';
import VenueManager from './components/VenueManager';
import RackBuilder from './components/RackBuilder';

function App() {
  const [activeTab, setActiveTab] = useState('events');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function getUserInfo() {
      try {
        const response = await fetch('/.auth/me');
        if (!response.ok) return;
        const payload = await response.json();
        const { clientPrincipal } = payload;
        setUserInfo(clientPrincipal);
      } catch (error) {
        console.error('No user info found', error);
      }
    }
    getUserInfo();
  }, []);

  const handleLogin = (e) => {
    if (import.meta.env.DEV) {
      e.preventDefault();
      setUserInfo({
        userDetails: "marshall@clinedge.io",  
        identityProvider: "aad",
        userId: "dev_user_id",
        userRoles: ["anonymous", "authenticated"]
      });
    }
  };

  const handleLogout = (e) => {
    if (import.meta.env.DEV) {
      e.preventDefault();
      setUserInfo(null);
    }
  };

  if (!userInfo) {
    return (
      <div className="App">
        <h1>Live Shows App</h1>
        <div className="login-container">
          <p>Please login to manage live shows.</p>
          <a href="/.auth/login/aad" onClick={handleLogin}>Login with Microsoft</a>
        </div>
      </div>
    );
  }

  if (userInfo.userDetails !== 'marshall@clinedge.io') {
    return (
      <div className="App">
        <h1>Live Shows App</h1>
        <div className="login-container">
          <p>Unauthorized user: {userInfo.userDetails}</p>
          <p>Please login with marshall@clinedge.io</p>
          <a href="/.auth/logout" onClick={handleLogout}>Logout</a>
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
          <a href="https://portal.azure.com/#view/Microsoft_Azure_Storage/ContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2F4c6dabdd-a6e5-4e06-be96-74b110203a4a%2Fresourcegroups%2Fretrieveshowsapi%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fsquarespacemusic/path/%24web/etag/%220x8DD254A2FE12B12%22/defaultId//publicAccessVal/Blob" target="_blank" rel="noopener noreferrer">Azure Storage</a>
          <a href="/.auth/logout" onClick={handleLogout}>Logout</a>
        </div>
      </header>
      
      <div className="tabs">
        <button onClick={() => setActiveTab('events')} disabled={activeTab === 'events'}>Events</button>
        <button onClick={() => setActiveTab('venues')} disabled={activeTab === 'venues'}>Venues</button>
        <button onClick={() => setActiveTab('bands')} disabled={activeTab === 'bands'}>Bands</button>
        <button onClick={() => setActiveTab('racks')} disabled={activeTab === 'racks'}>Rack Builder</button>
      </div>

      <div className="content">
        {activeTab === 'bands' && <BandManager />}
        {activeTab === 'events' && <EventManager />}
        {activeTab === 'venues' && <VenueManager />}
        {activeTab === 'racks' && <RackBuilder />}
      </div>
    </div>
  )
}

export default App
