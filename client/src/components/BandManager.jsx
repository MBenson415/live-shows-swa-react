import { useState, useEffect } from 'react';

export default function BandManager() {
    const [bands, setBands] = useState([]);
    const [formData, setFormData] = useState({ name: '', logo_image_link: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchBands();
    }, []);

    async function fetchBands() {
        const res = await fetch('/api/bands');
        if (res.ok) setBands(await res.json());
    }

    function handleInputChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const body = editingId ? { ...formData, id: editingId } : formData;

        const res = await fetch('/api/bands', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            setFormData({ name: '', logo_image_link: '' });
            setEditingId(null);
            fetchBands();
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure?')) return;
        const res = await fetch(`/api/bands?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchBands();
    }

    function handleEdit(band) {
        setFormData({ name: band.NAME, logo_image_link: band.LOGO_IMAGE_LINK });
        setEditingId(band.ID);
    }

    return (
        <div className="manager">
            <h2>Manage Bands</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Band Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    name="logo_image_link"
                    placeholder="Logo URL"
                    value={formData.logo_image_link}
                    onChange={handleInputChange}
                />
                <button type="submit">{editingId ? 'Update' : 'Add'} Band</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', logo_image_link: '' }); }}>Cancel</button>}
            </form>

            <ul>
                {bands.map(band => (
                    <li key={band.ID}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {band.LOGO_IMAGE_LINK && (
                                <img 
                                    src={band.LOGO_IMAGE_LINK} 
                                    alt={band.NAME} 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #ddd' }} 
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                            <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{band.NAME}</span>
                        </div>
                        <div>
                            <button onClick={() => handleEdit(band)}>Edit</button>
                            <button onClick={() => handleDelete(band.ID)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
