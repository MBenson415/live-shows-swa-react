import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100%',
  height: '400px',
  marginBottom: '20px'
};

const defaultCenter = {
  lat: 45.508,
  lng: -73.587
};

const libraries = ['places'];

export default function VenueManager() {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_API_KEY,
        libraries
    });

    const [venues, setVenues] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedVenueId, setExpandedVenueId] = useState(null);
    const [venueEvents, setVenueEvents] = useState({});
    const [formData, setFormData] = useState({
        name: '', state: '', zip: '', country: '', city: '', street: '', google_maps_link: '', address: ''
    });
    const [editingId, setEditingId] = useState(null);

    // Map related state
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState(defaultCenter);
    const [markers, setMarkers] = useState([]);
    const [places, setPlaces] = useState([]); // Store full place objects
    const [currentPlace, setCurrentPlace] = useState(null);
    
    const searchInputRef = useRef(null);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        fetchVenues();
        geolocate();
    }, []);

    const initAutocomplete = useCallback((node) => {
        if (node && isLoaded && !autocompleteRef.current) {
            searchInputRef.current = node;
            autocompleteRef.current = new window.google.maps.places.Autocomplete(node, {
                types: ['establishment', 'geocode'],
                fields: ['name', 'formatted_address', 'address_components', 'geometry', 'url']
            });

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace();
                setCurrentPlace(place);
                populateForm(place);

                // Center map on selection
                if (place.geometry && place.geometry.location) {
                    setCenter({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    });
                }
            });
        }
    }, [isLoaded]);

    const populateForm = (place) => {
        const addressComponents = place.address_components || [];
        const getComponent = (type) => addressComponents.find(c => c.types.includes(type));
        
        const streetNum = getComponent('street_number')?.long_name || '';
        const route = getComponent('route')?.long_name || '';
        const city = getComponent('locality')?.long_name || getComponent('sublocality')?.long_name || '';
        const state = getComponent('administrative_area_level_1')?.short_name || '';
        const zip = getComponent('postal_code')?.long_name || '';
        const country = getComponent('country')?.long_name || '';
        
        setFormData(prev => ({
            ...prev,
            name: place.name || prev.name,
            street: `${streetNum} ${route}`.trim(),
            city,
            state,
            zip,
            country,
            address: place.formatted_address || '',
            google_maps_link: place.url || ''
        }));
    };

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    const addMarker = (e) => {
        e.preventDefault();
        if (currentPlace && currentPlace.geometry) {
            const newMarker = {
                lat: currentPlace.geometry.location.lat(),
                lng: currentPlace.geometry.location.lng(),
            };
            setMarkers([...markers, { position: newMarker }]);
            setPlaces([...places, currentPlace]);
            setCenter(newMarker);
            setCurrentPlace(null);
            if (searchInputRef.current) searchInputRef.current.value = '';
        }
    };

    const handleMarkerClick = (index) => {
        const place = places[index];
        if (place) {
            populateForm(place);
            setCenter(markers[index].position);
        }
    };

    const geolocate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        }
    };

    async function fetchVenues() {
        try {
            const res = await fetch('/api/venues');
            if (res.ok) {
                const data = await res.json();
                data.sort((a, b) => (a.STATE || '').localeCompare(b.STATE || ''));
                setVenues(data);
            } else {
                console.error("Failed to fetch venues:", res.statusText);
            }
        } catch (error) {
            console.error("Error fetching venues:", error);
        }
    }

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!editingId) {
            const isDuplicate = venues.some(venue => 
                venue.NAME?.toLowerCase() === formData.name?.toLowerCase() && 
                venue.CITY?.toLowerCase() === formData.city?.toLowerCase() &&
                venue.STATE?.toLowerCase() === formData.state?.toLowerCase()
            );

            if (isDuplicate) {
                alert('This venue already exists.');
                return;
            }
        }

        const method = editingId ? 'PUT' : 'POST';
        const body = editingId ? { ...formData, id: editingId } : formData;

        try {
            const res = await fetch('/api/venues', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setFormData({
                    name: '', state: '', zip: '', country: '', city: '', street: '', google_maps_link: '', address: ''
                });
                setEditingId(null);
                fetchVenues();
            } else {
                const errorText = await res.text();
                alert(`Failed to save venue: ${errorText}`);
            }
        } catch (error) {
            console.error("Error saving venue:", error);
            alert(`Error saving venue: ${error.message}`);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/venues?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchVenues();
        } catch (error) {
            console.error("Error deleting venue:", error);
        }
    }

    function handleEdit(venue) {
        setFormData({
            name: venue.NAME,
            state: venue.STATE,
            zip: venue.ZIP,
            country: venue.COUNTRY,
            city: venue.CITY,
            street: venue.STREET,
            google_maps_link: venue.GOOGLE_MAPS_LINK,
            address: venue.ADDRESS
        });
        setEditingId(venue.ID);
    }

    async function toggleExpand(venueId) {
        if (expandedVenueId === venueId) {
            setExpandedVenueId(null);
        } else {
            setExpandedVenueId(venueId);
            if (!venueEvents[venueId]) {
                try {
                    const res = await fetch(`/api/events?venue_id=${venueId}`);
                    if (res.ok) {
                        const events = await res.json();
                        // Ensure sorted by date descending
                        events.sort((a, b) => new Date(b.DATE) - new Date(a.DATE));
                        setVenueEvents(prev => ({ ...prev, [venueId]: events }));
                    }
                } catch (error) {
                    console.error("Error fetching venue events:", error);
                }
            }
        }
    }

    return (
        <div className="manager">
            <h2>Manage Venues</h2>
            {!GOOGLE_API_KEY && <p style={{ color: 'red' }}>Warning: VITE_GOOGLE_MAPS_API_KEY is missing. Autocomplete will not work.</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                
                {/* Map Section */}
                <div style={{ gridColumn: 'span 2' }}>
                    {loadError && <div style={{color: 'red'}}>Map cannot be loaded right now, sorry.</div>}
                    {isLoaded ? (
                        <div className="map-search-container">
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    ref={initAutocomplete}
                                    type="text"
                                    placeholder="Search for a venue..."
                                    style={{ flexGrow: 1, width: '100%', padding: '8px', fontSize: '16px' }}
                                />
                                <button onClick={addMarker} type="button">View</button>
                            </div>
                            
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={center}
                                zoom={12}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                            >
                                {markers.map((marker, index) => (
                                    <Marker 
                                        key={index} 
                                        position={marker.position} 
                                        onClick={() => handleMarkerClick(index)} 
                                    />
                                ))}
                            </GoogleMap>
                        </div>
                    ) : <div>Loading Map...</div>}
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Venue Name:</label>
                    <input
                        name="name"
                        placeholder="Venue Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                    />
                </div>

                <input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} />
                <input name="state" placeholder="State" value={formData.state} onChange={handleInputChange} />
                <input name="zip" placeholder="Zip" value={formData.zip} onChange={handleInputChange} />
                <input name="country" placeholder="Country" value={formData.country} onChange={handleInputChange} />
                <input name="street" placeholder="Street" value={formData.street} onChange={handleInputChange} />
                <input name="address" placeholder="Full Address" value={formData.address} onChange={handleInputChange} />
                <input name="google_maps_link" placeholder="Google Maps Link" value={formData.google_maps_link} onChange={handleInputChange} style={{ gridColumn: 'span 2' }} />
                
                <div style={{ gridColumn: 'span 2' }}>
                    <button type="submit">{editingId ? 'Update' : 'Add'} Venue</button>
                    {editingId && <button type="button" onClick={() => { 
                        setEditingId(null); 
                        setFormData({ name: '', state: '', zip: '', country: '', city: '', street: '', google_maps_link: '', address: '' }); 
                    }}>Cancel</button>}
                </div>
            </form>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Filter venues by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '12px', fontSize: '16px' }}
                />
            </div>

            <ul>
                {venues.filter(venue => 
                    venue.NAME.toLowerCase().includes(searchTerm.toLowerCase())
                ).map(venue => (
                    <li key={venue.ID} style={{ display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexGrow: 1 }} onClick={() => toggleExpand(venue.ID)}>
                                <div className="state-box">{venue.STATE}</div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{venue.NAME}</div>
                                    <div style={{ color: '#666', fontSize: '0.9em' }}>
                                        {venue.CITY}, {venue.STATE} {venue.ZIP}
                                    </div>
                                    <div style={{ color: '#888', fontSize: '0.85em' }}>{venue.COUNTRY}</div>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => handleEdit(venue)}>Edit</button>
                                <button onClick={() => handleDelete(venue.ID)}>Delete</button>
                                <button onClick={() => toggleExpand(venue.ID)}>
                                    {expandedVenueId === venue.ID ? '▲' : '▼'}
                                </button>
                            </div>
                        </div>
                        {expandedVenueId === venue.ID && (
                            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#2c3e50' }}>Events</h4>
                                {venueEvents[venue.ID] && venueEvents[venue.ID].length > 0 ? (
                                    <ul style={{ padding: 0, display: 'grid', gap: '8px' }}>
                                        {venueEvents[venue.ID].map(event => (
                                            <li key={event.ID} style={{ padding: '10px', background: 'white', border: '1px solid #eee', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <strong>{event.NAME}</strong>
                                                    <div style={{ fontSize: '0.9em', color: '#666' }}>
                                                        {new Date(event.DATE).toLocaleDateString()} {new Date(event.DATE).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                {event.TICKET_LINK && (
                                                    <a href={event.TICKET_LINK} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9em' }}>Tickets</a>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: '#666', fontStyle: 'italic' }}>No events found for this venue.</p>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
