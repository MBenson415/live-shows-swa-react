import { useState, useEffect } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import ImageCropModal from './ImageCropModal';

const RackBuilder = () => {
    const [racks, setRacks] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [allEquipment, setAllEquipment] = useState([]); // Store all equipment for totals
    const [selectedRack, setSelectedRack] = useState(null);
    const [rackFormData, setRackFormData] = useState({
        RackName: '',
        RUCapacity: '',
        RackModel: '',
        RackBrand: '',
        RackDescription: '',
        RackImageURL: '',
        RackDepth: '',
        RackCost: '',
        RackWeight: '',
        PowerConditionerCapacity: ''
    });
    const [equipmentFormData, setEquipmentFormData] = useState({
        Model: '',
        Brand: '',
        Description: '',
        ImageURL: '',
        RU: '',
        Depth: '',
        RUPosition: '',
        Cost: '',
        Weight: '',
        Is_Backmounted: false,
        PowerConditionerDemand: ''
    });
    const [editingRackId, setEditingRackId] = useState(null);
    const [editingEquipmentId, setEditingEquipmentId] = useState(null);
    const [draggingEquipmentId, setDraggingEquipmentId] = useState(null);
    const [showEquipmentForm, setShowEquipmentForm] = useState(false);
    const [cropModalEquipment, setCropModalEquipment] = useState(null);
    const [showRackModal, setShowRackModal] = useState(false);
    const [viewingBack, setViewingBack] = useState(false);

    useEffect(() => {
        loadRacks();
        loadAllEquipment();
    }, []);

    useEffect(() => {
        if (selectedRack) {
            loadEquipment(selectedRack.RackID);
        }
    }, [selectedRack]);

    const loadRacks = async () => {
        try {
            const response = await fetch('/api/racks');
            const data = await response.json();
            setRacks(data);
        } catch (error) {
            console.error('Error loading racks:', error);
        }
    };

    const loadAllEquipment = async () => {
        try {
            const response = await fetch('/api/rackEquipment');
            const data = await response.json();
            setAllEquipment(data);
        } catch (error) {
            console.error('Error loading all equipment:', error);
        }
    };

    const loadEquipment = async (rackId) => {
        try {
            const response = await fetch(`/api/rackEquipment?rack_id=${rackId}`);
            const data = await response.json();
            setEquipment(data);
        } catch (error) {
            console.error('Error loading equipment:', error);
        }
    };

    const handleRackChange = (e) => {
        setRackFormData({ ...rackFormData, [e.target.name]: e.target.value });
    };

    const handleEquipmentChange = (e) => {
        setEquipmentFormData({ ...equipmentFormData, [e.target.name]: e.target.value });
    };

    const handleRackSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingRackId ? '/api/racks' : '/api/racks';
            const method = editingRackId ? 'PUT' : 'POST';
            const body = editingRackId
                ? { ...rackFormData, RackID: editingRackId }
                : rackFormData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setRackFormData({
                    RackName: '',
                    RUCapacity: '',
                    RackModel: '',
                    RackBrand: '',
                    RackDescription: '',
                    RackImageURL: '',
                    RackDepth: '',
                    RackCost: '',
                    RackWeight: '',
                    PowerConditionerCapacity: ''
                });
                setEditingRackId(null);
                setShowRackModal(false);
                loadRacks();
            }
        } catch (error) {
            console.error('Error saving rack:', error);
        }
    };

    const handleEquipmentSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRack) {
            alert('Please select a rack first');
            return;
        }

        try {
            const url = editingEquipmentId ? '/api/rackEquipment' : '/api/rackEquipment';
            const method = editingEquipmentId ? 'PUT' : 'POST';

            const cleanedData = {
                Model: equipmentFormData.Model,
                Brand: equipmentFormData.Brand,
                Description: equipmentFormData.Description || null,
                ImageURL: equipmentFormData.ImageURL || null,
                RU: parseInt(equipmentFormData.RU),
                Depth: equipmentFormData.Depth ? parseFloat(equipmentFormData.Depth) : null,
                RUPosition: parseInt(equipmentFormData.RUPosition),
                Cost: equipmentFormData.Cost ? parseFloat(equipmentFormData.Cost) : null,
                Weight: equipmentFormData.Weight ? parseFloat(equipmentFormData.Weight) : null,
                Is_Backmounted: equipmentFormData.Is_Backmounted ? 1 : 0,
                PowerConditionerDemand: equipmentFormData.PowerConditionerDemand ? parseInt(equipmentFormData.PowerConditionerDemand) : null,
                RackID: selectedRack.RackID
            };

            const body = editingEquipmentId
                ? { ...cleanedData, RackEquipmentID: editingEquipmentId }
                : cleanedData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                setEquipmentFormData({
                    Model: '',
                    Brand: '',
                    Description: '',
                    ImageURL: '',
                    RU: '',
                    Depth: '',
                    RUPosition: '',
                    Cost: '',
                    Weight: '',
                    Is_Backmounted: false,
                    PowerConditionerDemand: ''
                });
                setEditingEquipmentId(null);
                setShowEquipmentForm(false);
                loadEquipment(selectedRack.RackID);
                loadAllEquipment();
            }
        } catch (error) {
            console.error('Error saving equipment:', error);
        }
    };

    const handleEditRack = (rack) => {
        setRackFormData({
            RackName: rack.RackName,
            RUCapacity: rack.RUCapacity,
            RackModel: rack.RackModel || '',
            RackBrand: rack.RackBrand || '',
            RackDescription: rack.RackDescription || '',
            RackImageURL: rack.RackImageURL || '',
            RackDepth: rack.RackDepth || '',
            RackCost: rack.RackCost || '',
            RackWeight: rack.RackWeight || '',
            PowerConditionerCapacity: rack.PowerConditionerCapacity || ''
        });
        setEditingRackId(rack.RackID);
        setShowRackModal(true);
    };

    const handleCloseRackModal = () => {
        setShowRackModal(false);
        setEditingRackId(null);
        setRackFormData({
            RackName: '',
            RUCapacity: '',
            RackModel: '',
            RackBrand: '',
            RackDescription: '',
            RackImageURL: '',
            RackDepth: '',
            RackCost: '',
            RackWeight: '',
            PowerConditionerCapacity: ''
        });
    };

    const handleDeleteRack = async (id) => {
        if (window.confirm('Are you sure? This will delete all equipment in this rack.')) {
            try {
                await fetch(`/api/racks?id=${id}`, { method: 'DELETE' });
                if (selectedRack?.RackID === id) {
                    setSelectedRack(null);
                    setEquipment([]);
                }
                loadRacks();
            } catch (error) {
                console.error('Error deleting rack:', error);
            }
        }
    };

    const handleEditEquipment = (equip) => {
        setEquipmentFormData({
            Model: equip.Model,
            Brand: equip.Brand,
            Description: equip.Description || '',
            ImageURL: equip.ImageURL || '',
            RU: equip.RU,
            Depth: equip.Depth || '',
            RUPosition: equip.RUPosition,
            Cost: equip.Cost || '',
            Weight: equip.Weight || '',
            Is_Backmounted: equip.Is_Backmounted === 1 || equip.Is_Backmounted === true,
            PowerConditionerDemand: equip.PowerConditionerDemand || ''
        });
        setEditingEquipmentId(equip.RackEquipmentID);
        setShowEquipmentForm(true);
    };

    const handleDeleteEquipment = async (id) => {
        if (window.confirm('Delete this equipment?')) {
            try {
                await fetch(`/api/rackEquipment?id=${id}`, { method: 'DELETE' });
                loadEquipment(selectedRack.RackID);
                loadAllEquipment();
            } catch (error) {
                console.error('Error deleting equipment:', error);
            }
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement required before drag starts
            },
        })
    );

    const handleDragStart = (event) => {
        const equipmentId = parseInt(event.active.id);
        console.log('Drag started for equipment:', equipmentId);
        setDraggingEquipmentId(equipmentId);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        setDraggingEquipmentId(null);

        if (!over) return;

        const equipmentId = parseInt(active.id);
        const targetRUPosition = parseInt(over.id);

        const draggedEquipment = equipment.find(eq => eq.RackEquipmentID === equipmentId);
        if (!draggedEquipment) return;

        const newPosition = Math.max(1, Math.min(targetRUPosition, selectedRack.RUCapacity - draggedEquipment.RU + 1));

        console.log('Drop detected:', {
            draggedEquipment: draggedEquipment.Model,
            currentPosition: draggedEquipment.RUPosition,
            targetRU: targetRUPosition,
            newPosition: newPosition
        });

        if (newPosition !== draggedEquipment.RUPosition) {
            try {
                // Calculate which equipment needs to be moved
                const updates = [];

                // Determine if dragged equipment is back-mounted
                const isBackMounted = draggedEquipment.Is_Backmounted === 1 || draggedEquipment.Is_Backmounted === true;

                // Get all other equipment (exclude the dragged one) that's on the same side (front or back)
                const otherEquipment = equipment.filter(eq => {
                    if (eq.RackEquipmentID === equipmentId) return false;
                    const eqIsBackMounted = eq.Is_Backmounted === 1 || eq.Is_Backmounted === true;
                    return eqIsBackMounted === isBackMounted;
                });

                // Check for collisions with the new position
                const draggedStart = newPosition;
                const draggedEnd = newPosition + draggedEquipment.RU - 1;

                console.log('Checking for conflicts in range:', draggedStart, 'to', draggedEnd, 'on', isBackMounted ? 'BACK' : 'FRONT');

                // Find equipment that overlaps with the new position
                const conflictingEquipment = otherEquipment.filter(eq => {
                    const eqStart = eq.RUPosition;
                    const eqEnd = eq.RUPosition + eq.RU - 1;
                    const hasConflict = (draggedStart <= eqEnd && draggedEnd >= eqStart);
                    if (hasConflict) {
                        console.log('Conflict found:', eq.Model, 'at position', eqStart, '-', eqEnd);
                    }
                    return hasConflict;
                });

                // Sort conflicting equipment by position
                conflictingEquipment.sort((a, b) => a.RUPosition - b.RUPosition);

                // Calculate new positions for conflicting equipment (push them down)
                let nextAvailablePosition = draggedEnd + 1;
                for (const conflictEq of conflictingEquipment) {
                    // Make sure we don't exceed rack capacity
                    if (nextAvailablePosition + conflictEq.RU - 1 > selectedRack.RUCapacity) {
                        alert('Not enough space in rack to move equipment. Please remove or rearrange equipment first.');
                        setDraggingEquipmentId(null);
                        return;
                    }

                    console.log('Moving', conflictEq.Model, 'from', conflictEq.RUPosition, 'to', nextAvailablePosition);

                    updates.push({
                        ...conflictEq,
                        RUPosition: nextAvailablePosition
                    });

                    nextAvailablePosition += conflictEq.RU;
                }

                // Add the dragged equipment update
                updates.push({
                    ...draggedEquipment,
                    RUPosition: newPosition
                });

                console.log('Total updates to perform:', updates.length);

                // Execute all updates
                for (const update of updates) {
                    console.log('Updating:', update.Model, 'to position', update.RUPosition);
                    await fetch('/api/rackEquipment', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(update)
                    });
                }

                loadEquipment(selectedRack.RackID);
                loadAllEquipment();
            } catch (error) {
                console.error('Error updating equipment position:', error);
                alert('Failed to update equipment positions');
            }
        } else {
            console.log('Position unchanged, no update needed');
        }

        setDraggingEquipmentId(null);
    };

    const handleCropImage = (equip) => {
        setCropModalEquipment(equip);
    };

    const handleSaveCroppedImage = async (imageUrl) => {
        if (!cropModalEquipment) return;

        try {
            await fetch('/api/rackEquipment', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...cropModalEquipment,
                    ImageURL: imageUrl
                })
            });
            loadEquipment(selectedRack.RackID);
            loadAllEquipment();
        } catch (error) {
            console.error('Error updating equipment image:', error);
            alert('Failed to update equipment image');
        }
    };

    // Helper component for droppable rack units
    const DroppableRackUnit = ({ ruNumber, pixelsPerInch }) => {
        const { setNodeRef, isOver } = useDroppable({
            id: ruNumber.toString()
        });

        return (
            <div
                ref={setNodeRef}
                className="rack-unit"
                style={{
                    height: `${1.75 * pixelsPerInch}px`,
                    backgroundColor: isOver ? 'rgba(106, 17, 203, 0.1)' : 'transparent'
                }}
            >
                <span className="ru-label">{ruNumber}</span>
            </div>
        );
    };

    // Helper component for draggable equipment
    const DraggableEquipment = ({ equip, topPosition, height, rackWidthPx }) => {
        const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
            id: equip.RackEquipmentID.toString()
        });

        const style = {
            top: `${topPosition}px`,
            height: `${height}px`,
            width: `${rackWidthPx - 20}px`, // Reduced padding from 40 to 20 total (10px each side)
            opacity: isDragging ? 0.5 : 1,
            cursor: isDragging ? 'grabbing' : 'grab',
            transform: transform ? `translateX(-50%) translate3d(${transform.x}px, ${transform.y}px, 0)` : 'translateX(-50%)',
        };

        return (
            <div
                ref={setNodeRef}
                {...listeners}
                {...attributes}
                className="rack-equipment-visual"
                style={style}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleCropImage(equip);
                }}
                title="Drag to move, double-click to crop/upload image"
            >
                {equip.ImageURL ? (
                    <img
                        src={equip.ImageURL}
                        alt={equip.Model}
                        className="equipment-image"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                        draggable={false}
                    />
                ) : (
                    <div className="equipment-placeholder" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                        <div className="equipment-text">
                            <strong>{equip.Brand} {equip.Model}</strong>
                            <br />
                            <small>{equip.RU}U</small>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderRackVisual = () => {
        if (!selectedRack) return null;

        const rackHeightInches = selectedRack.RUCapacity * 1.75;
        const pixelsPerInch = 30;
        const rackHeightPx = rackHeightInches * pixelsPerInch;
        const rackWidthPx = 19 * pixelsPerInch;

        const units = [];
        for (let i = 1; i <= selectedRack.RUCapacity; i++) {
            units.push(
                <DroppableRackUnit
                    key={i}
                    ruNumber={i}
                    pixelsPerInch={pixelsPerInch}
                />
            );
        }

        // Filter equipment by front/back mounting based on current view
        const displayEquipment = viewingBack
            ? equipment.filter(eq => eq.Is_Backmounted === 1 || eq.Is_Backmounted === true)
            : equipment.filter(eq => eq.Is_Backmounted === 0 || eq.Is_Backmounted === false || !eq.Is_Backmounted);

        const equipmentElements = displayEquipment.map(equip => {
            const topPosition = (equip.RUPosition - 1) * 1.75 * pixelsPerInch;
            const height = equip.RU * 1.75 * pixelsPerInch;

            return (
                <DraggableEquipment
                    key={equip.RackEquipmentID}
                    equip={equip}
                    topPosition={topPosition}
                    height={height}
                    rackWidthPx={rackWidthPx}
                />
            );
        });

        return (
            <div className="rack-visual-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>{selectedRack.RackName} - {selectedRack.RUCapacity}U</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            className={`btn-${viewingBack ? 'secondary' : 'primary'}`}
                            onClick={() => setViewingBack(false)}
                            style={{ padding: '8px 16px' }}
                        >
                            View Front
                        </button>
                        <button
                            className={`btn-${viewingBack ? 'primary' : 'secondary'}`}
                            onClick={() => setViewingBack(true)}
                            style={{ padding: '8px 16px' }}
                        >
                            View Back
                        </button>
                    </div>
                </div>
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div
                        className="rack-visual"
                        style={{
                            height: `${rackHeightPx}px`,
                            width: `${rackWidthPx}px`
                        }}
                    >
                        {units}
                        {equipmentElements}
                    </div>
                    <DragOverlay>
                        {draggingEquipmentId ? (
                            <div className="rack-equipment-visual" style={{
                                opacity: 0.8,
                                cursor: 'grabbing',
                                width: `${rackWidthPx - 20}px`,
                                transform: 'none',
                                position: 'relative',
                                left: 'auto'
                            }}>
                                Dragging...
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        );
    };

    return (
        <div className="rack-builder-container">
            <div className="rack-builder-header">
                <h2>Rack Builder</h2>
                <button className="btn-primary" onClick={() => setShowRackModal(true)}>
                    Add New Rack
                </button>
            </div>

            <div className="rack-builder-layout">
                <div className="rack-list-section">
                    <h3>Your Racks</h3>
                    {racks.length === 0 ? (
                        <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>
                            No racks yet. Click "Add New Rack" to get started.
                        </p>
                    ) : (
                        racks.map(rack => {
                            // Calculate totals for this rack (equipment + rack itself)
                            const rackEquipment = allEquipment.filter(eq => eq.RackID === rack.RackID);
                            const equipmentCost = rackEquipment.reduce((sum, eq) => sum + (eq.Cost || 0), 0);
                            const equipmentWeight = rackEquipment.reduce((sum, eq) => sum + (eq.Weight || 0), 0);
                            const totalCost = equipmentCost + (rack.RackCost || 0);
                            const totalWeight = equipmentWeight + (rack.RackWeight || 0);
                            const powerDemand = rackEquipment.reduce((sum, eq) => sum + (eq.PowerConditionerDemand || 0), 0);

                            return (
                                <div
                                    key={rack.RackID}
                                    className={`rack-item ${selectedRack?.RackID === rack.RackID ? 'selected' : ''}`}
                                    onClick={() => setSelectedRack(rack)}
                                >
                                    <div className="rack-item-info">
                                        <strong>{rack.RackName}</strong>
                                        <span>{rack.RUCapacity}U</span>
                                        {(totalCost > 0 || totalWeight > 0 || rack.PowerConditionerCapacity) && (
                                            <div className="rack-totals">
                                                {totalCost > 0 && (
                                                    <span className="total-cost">
                                                        ${totalCost.toFixed(2)}
                                                    </span>
                                                )}
                                                {totalWeight > 0 && (
                                                    <span className="total-weight">
                                                        {totalWeight.toFixed(1)} lbs
                                                    </span>
                                                )}
                                                {rack.PowerConditionerCapacity && (
                                                    <span className="total-power">
                                                        Power: {powerDemand} / {rack.PowerConditionerCapacity}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="rack-item-actions">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditRack(rack); }}>Edit</button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteRack(rack.RackID); }}>Delete</button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="rack-visual-section">
                    {selectedRack ? (
                        <>
                            {renderRackVisual()}
                            <div className="equipment-controls">
                                <button
                                    className="btn-primary"
                                    onClick={() => setShowEquipmentForm(!showEquipmentForm)}
                                >
                                    {showEquipmentForm ? 'Hide Form' : 'Add Equipment'}
                                </button>
                            </div>

                            {showEquipmentForm && (
                                <div className="equipment-form">
                                    <h3>{editingEquipmentId ? 'Edit Equipment' : 'Add New Equipment'}</h3>
                                    <form onSubmit={handleEquipmentSubmit}>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Brand:</label>
                                                <input
                                                    type="text"
                                                    name="Brand"
                                                    value={equipmentFormData.Brand}
                                                    onChange={handleEquipmentChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Model:</label>
                                                <input
                                                    type="text"
                                                    name="Model"
                                                    value={equipmentFormData.Model}
                                                    onChange={handleEquipmentChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>RU (Rack Units):</label>
                                                <input
                                                    type="number"
                                                    name="RU"
                                                    value={equipmentFormData.RU}
                                                    onChange={handleEquipmentChange}
                                                    min="1"
                                                    max={selectedRack?.RUCapacity || 100}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Starting Position (RU):</label>
                                                <input
                                                    type="number"
                                                    name="RUPosition"
                                                    value={equipmentFormData.RUPosition}
                                                    onChange={handleEquipmentChange}
                                                    min="1"
                                                    max={selectedRack?.RUCapacity || 100}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Depth (inches):</label>
                                                <input
                                                    type="number"
                                                    name="Depth"
                                                    value={equipmentFormData.Depth}
                                                    onChange={handleEquipmentChange}
                                                    step="0.01"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Weight (lbs):</label>
                                                <input
                                                    type="number"
                                                    name="Weight"
                                                    value={equipmentFormData.Weight}
                                                    onChange={handleEquipmentChange}
                                                    step="0.01"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Cost ($):</label>
                                                <input
                                                    type="number"
                                                    name="Cost"
                                                    value={equipmentFormData.Cost}
                                                    onChange={handleEquipmentChange}
                                                    step="0.01"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Power Demand (Amps):</label>
                                                <input
                                                    type="number"
                                                    name="PowerConditionerDemand"
                                                    value={equipmentFormData.PowerConditionerDemand}
                                                    onChange={handleEquipmentChange}
                                                    min="0"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Image URL:</label>
                                                <input
                                                    type="url"
                                                    name="ImageURL"
                                                    value={equipmentFormData.ImageURL}
                                                    onChange={handleEquipmentChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Description:</label>
                                            <textarea
                                                name="Description"
                                                value={equipmentFormData.Description}
                                                onChange={handleEquipmentChange}
                                                rows="3"
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    name="Is_Backmounted"
                                                    checked={equipmentFormData.Is_Backmounted}
                                                    onChange={(e) => setEquipmentFormData({
                                                        ...equipmentFormData,
                                                        Is_Backmounted: e.target.checked
                                                    })}
                                                    style={{ cursor: 'pointer', width: 'auto' }}
                                                />
                                                <span>Back-mounted</span>
                                            </label>
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn-primary">
                                                {editingEquipmentId ? 'Update Equipment' : 'Add Equipment'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => {
                                                    setEditingEquipmentId(null);
                                                    setShowEquipmentForm(false);
                                                    setEquipmentFormData({
                                                        Model: '',
                                                        Brand: '',
                                                        Description: '',
                                                        ImageURL: '',
                                                        RU: '',
                                                        Depth: '',
                                                        RUPosition: '',
                                                        Cost: '',
                                                        Weight: '',
                                                        Is_Backmounted: false
                                                    });
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="equipment-list">
                                <h3>Equipment in {selectedRack.RackName}</h3>
                                {equipment.length === 0 ? (
                                    <p>No equipment yet. Add some equipment to get started!</p>
                                ) : (
                                    [...equipment].sort((a, b) => a.RUPosition - b.RUPosition).map(equip => (
                                        <div key={equip.RackEquipmentID} className="equipment-item">
                                            <div className="equipment-item-info">
                                                <strong>{equip.Brand} {equip.Model}</strong>
                                                <span>
                                                    Position: {equip.RUPosition}U | Size: {equip.RU}U
                                                    {(equip.Is_Backmounted === 1 || equip.Is_Backmounted === true) && (
                                                        <span style={{
                                                            marginLeft: '8px',
                                                            color: '#8b0000',
                                                            fontWeight: 'bold',
                                                            background: 'rgba(255, 182, 193, 0.4)',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px'
                                                        }}>
                                                            Back-mounted
                                                        </span>
                                                    )}
                                                </span>
                                                {equip.Description && <p>{equip.Description}</p>}
                                                {(equip.Cost > 0 || equip.Weight > 0 || (selectedRack.RackDepth && equip.Depth)) && (
                                                    <div className="rack-totals" style={{ marginTop: '8px' }}>
                                                        {equip.Cost > 0 && (
                                                            <span className="total-cost">
                                                                ${equip.Cost.toFixed(2)}
                                                            </span>
                                                        )}
                                                        {equip.Weight > 0 && (
                                                            <span className="total-weight">
                                                                {equip.Weight.toFixed(1)} lbs
                                                            </span>
                                                        )}
                                                        {selectedRack.RackDepth && equip.Depth && (
                                                            <span className="total-depth">
                                                                Depth Δ: {(selectedRack.RackDepth - equip.Depth).toFixed(2)}"
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="equipment-item-actions">
                                                <button onClick={() => handleEditEquipment(equip)}>Edit</button>
                                                <button onClick={() => handleDeleteEquipment(equip.RackEquipmentID)}>Delete</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="no-rack-selected">
                            <p>Select a rack from the list to view and manage its equipment</p>
                        </div>
                    )}
                </div>
            </div>

            {cropModalEquipment && (
                <ImageCropModal
                    equipment={cropModalEquipment}
                    onClose={() => setCropModalEquipment(null)}
                    onSave={handleSaveCroppedImage}
                />
            )}

            {showRackModal && (
                <div className="modal-overlay" onClick={handleCloseRackModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingRackId ? 'Edit Rack' : 'Create New Rack'}</h3>
                            <button className="modal-close" onClick={handleCloseRackModal}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleRackSubmit}>
                                <div className="form-group">
                                    <label>Rack Name:</label>
                                    <input
                                        type="text"
                                        name="RackName"
                                        value={rackFormData.RackName}
                                        onChange={handleRackChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>RU Capacity:</label>
                                    <input
                                        type="number"
                                        name="RUCapacity"
                                        value={rackFormData.RUCapacity}
                                        onChange={handleRackChange}
                                        min="1"
                                        max="100"
                                        required
                                    />
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Rack Brand:</label>
                                        <input
                                            type="text"
                                            name="RackBrand"
                                            value={rackFormData.RackBrand}
                                            onChange={handleRackChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Rack Model:</label>
                                        <input
                                            type="text"
                                            name="RackModel"
                                            value={rackFormData.RackModel}
                                            onChange={handleRackChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label>Description:</label>
                                    <textarea
                                        name="RackDescription"
                                        value={rackFormData.RackDescription}
                                        onChange={handleRackChange}
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Image URL:</label>
                                    <input
                                        type="text"
                                        name="RackImageURL"
                                        value={rackFormData.RackImageURL}
                                        onChange={handleRackChange}
                                    />
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Depth (inches):</label>
                                        <input
                                            type="number"
                                            name="RackDepth"
                                            value={rackFormData.RackDepth}
                                            onChange={handleRackChange}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Cost ($):</label>
                                        <input
                                            type="number"
                                            name="RackCost"
                                            value={rackFormData.RackCost}
                                            onChange={handleRackChange}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Weight (lbs):</label>
                                        <input
                                            type="number"
                                            name="RackWeight"
                                            value={rackFormData.RackWeight}
                                            onChange={handleRackChange}
                                            step="0.1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Power Capacity (Amps):</label>
                                        <input
                                            type="number"
                                            name="PowerConditionerCapacity"
                                            value={rackFormData.PowerConditionerCapacity}
                                            onChange={handleRackChange}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={handleRackSubmit}
                            >
                                {editingRackId ? 'Update Rack' : 'Create Rack'}
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleCloseRackModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RackBuilder;