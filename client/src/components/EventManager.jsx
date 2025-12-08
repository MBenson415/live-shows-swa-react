import { useState, useEffect } from 'react';

export default function EventManager() {
    const [events, setEvents] = useState([]);
    const [bands, setBands] = useState([]);
    const [venues, setVenues] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '', band_id: '', venue_id: '', date: '', ticket_link: '', facebook_link: '', promo: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchEvents();
        fetchBands();
        fetchVenues();
    }, []);

    async function fetchEvents() {
        const res = await fetch('/api/events');
        if (res.ok) {
            const data = await res.json();
            data.sort((a, b) => new Date(b.DATE) - new Date(a.DATE));
            setEvents(data);
        }
    }
    
    async function fetchBands() {
        const res = await fetch('/api/bands');
        if (res.ok) setBands(await res.json());
    }

    async function fetchVenues() {
        const res = await fetch('/api/venues');
        if (res.ok) setVenues(await res.json());
    }

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const body = editingId ? { ...formData, id: editingId } : formData;

        const res = await fetch('/api/events', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            setFormData({
                name: '', band_id: '', venue_id: '', date: '', ticket_link: '', facebook_link: '', promo: ''
            });
            setEditingId(null);
            fetchEvents();
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure?')) return;
        const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchEvents();
    }

    function handleEdit(event) {
        setFormData({
            name: event.NAME,
            band_id: event.BAND_ID,
            venue_id: event.VENUE_ID,
            date: event.DATE ? event.DATE.split('T')[0] : '',
            ticket_link: event.TICKET_LINK,
            facebook_link: event.FACEBOOK_LINK,
            promo: event.PROMO
        });
        setEditingId(event.ID);
    }

    function getBandName(id) {
        const band = bands.find(b => b.ID === id);
        return band ? band.NAME : 'Unknown Band';
    }

    function getBandImage(id) {
        const band = bands.find(b => b.ID === id);
        return band ? band.LOGO_IMAGE_LINK : null;
    }

    function getVenueName(id) {
        const venue = venues.find(v => v.ID === id);
        return venue ? venue.NAME : 'Unknown Venue';
    }

    return (
        <div className="manager">
            <h2>Manage Events</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                <input name="name" placeholder="Event Name" value={formData.name} onChange={handleInputChange} required />
                <input name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                
                <select name="band_id" value={formData.band_id} onChange={handleInputChange} required>
                    <option value="">Select Band</option>
                    {bands.map(b => <option key={b.ID} value={b.ID}>{b.NAME}</option>)}
                </select>

                <select name="venue_id" value={formData.venue_id} onChange={handleInputChange} required>
                    <option value="">Select Venue</option>
                    {venues.map(v => <option key={v.ID} value={v.ID}>{v.NAME}</option>)}
                </select>

                <input name="ticket_link" placeholder="Ticket Link" value={formData.ticket_link} onChange={handleInputChange} />
                <input name="facebook_link" placeholder="Facebook Link" value={formData.facebook_link} onChange={handleInputChange} />
                <textarea name="promo" placeholder="Promo Text" value={formData.promo} onChange={handleInputChange} style={{ gridColumn: 'span 2' }} />

                <div style={{ gridColumn: 'span 2' }}>
                    <button type="submit">{editingId ? 'Update' : 'Add'} Event</button>
                    {editingId && <button type="button" onClick={() => { 
                        setEditingId(null); 
                        setFormData({ name: '', band_id: '', venue_id: '', date: '', ticket_link: '', facebook_link: '', promo: '' }); 
                    }}>Cancel</button>}
                </div>
            </form>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search events by band or venue..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '12px', fontSize: '16px' }}
                />
            </div>

            <ul>
                {events.filter(event => {
                    const term = searchTerm.toLowerCase();
                    const bandName = getBandName(event.BAND_ID).toLowerCase();
                    const venueName = getVenueName(event.VENUE_ID).toLowerCase();
                    const eventName = event.NAME.toLowerCase();
                    return bandName.includes(term) || venueName.includes(term) || eventName.includes(term);
                }).map(event => (
                    <li key={event.ID}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {getBandImage(event.BAND_ID) && (
                                <img 
                                    src={getBandImage(event.BAND_ID)} 
                                    alt={getBandName(event.BAND_ID)} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ddd' }} 
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                            <div>
                                <strong>{event.NAME}</strong> - {new Date(event.DATE).toLocaleDateString()}
                                <div style={{ fontSize: '0.9em', color: '#666' }}>
                                    {getBandName(event.BAND_ID)} @ {getVenueName(event.VENUE_ID)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(event)}>Edit</button>
                            <button onClick={() => handleDelete(event.ID)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
