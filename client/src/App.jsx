import { useState } from 'react'
import './App.css'
import BandManager from './components/BandManager';
import EventManager from './components/EventManager';
import VenueManager from './components/VenueManager';

function App() {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="App">
      <h1>Live Shows App</h1>
      
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
