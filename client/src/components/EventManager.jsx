import { useState, useEffect } from 'react';
import Select from 'react-select';

export default function EventManager() {
    const [events, setEvents] = useState([]);
    const [bands, setBands] = useState([]);
    const [venues, setVenues] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFutureOnly, setShowFutureOnly] = useState(true);
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
        if (!formData.venue_id) {
            alert('Please select a venue');
            return;
        }
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

    async function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        await uploadFile(file);
    }

    async function uploadFile(file, overwrite = false) {
        // Convert file to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => {
                const base64 = reader.result.split(',')[1]; // Remove data:...;base64, prefix
                resolve(base64);
            };
            reader.onerror = reject;
        });
        reader.readAsDataURL(file);
        
        const fileData = await base64Promise;

        let url = '/api/upload';
        if (overwrite) url += '?overwrite=true';

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    fileData: fileData
                })
            });

            if (res.status === 409) {
                if (confirm('File already exists. Do you want to overwrite it?')) {
                    await uploadFile(file, true);
                }
                return;
            }

            if (res.ok) {
                const result = await res.json();
                setFormData(prev => ({ ...prev, promo: result.url }));
            } else {
                const errorData = await res.json().catch(() => ({}));
                alert('Image upload failed: ' + (errorData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        }
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

                <div style={{ minWidth: '200px' }}>
                    <Select
                        options={venues.map(v => ({ value: v.ID, label: v.NAME }))}
                        value={venues.find(v => v.ID === formData.venue_id) ? { value: formData.venue_id, label: venues.find(v => v.ID === formData.venue_id).NAME } : null}
                        onChange={(option) => setFormData(prev => ({ ...prev, venue_id: option ? option.value : '' }))}
                        placeholder="Select Venue"
                        isClearable
                        isSearchable
                        required
                    />
                </div>

                <input name="ticket_link" placeholder="Ticket Link" value={formData.ticket_link} onChange={handleInputChange} />
                <input name="facebook_link" placeholder="Facebook Link" value={formData.facebook_link} onChange={handleInputChange} />
                
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Promo Image:</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {formData.promo && <div style={{ marginTop: '5px', fontSize: '0.8em' }}>Current Link: {formData.promo}</div>}
                </div>

                <textarea name="promo" placeholder="Promo image link" value={formData.promo} onChange={handleInputChange} style={{ gridColumn: 'span 2' }} />

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
                    style={{ width: '100%', padding: '12px', fontSize: '16px', boxSizing: 'border-box' }}
                />
                <div style={{ marginTop: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showFutureOnly}
                            onChange={(e) => setShowFutureOnly(e.target.checked)}
                            style={{ width: 'auto' }}
                        />
                        Show Future Events Only
                    </label>
                </div>
            </div>

            <ul>
                {events.filter(event => {
                    const term = searchTerm.toLowerCase();
                    const bandName = getBandName(event.BAND_ID).toLowerCase();
                    const venueName = getVenueName(event.VENUE_ID).toLowerCase();
                    const eventName = event.NAME.toLowerCase();
                    const matchesSearch = bandName.includes(term) || venueName.includes(term) || eventName.includes(term);

                    if (!matchesSearch) return false;

                    if (showFutureOnly) {
                        const eventDate = new Date(event.DATE);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return eventDate >= today;
                    }

                    return true;
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
