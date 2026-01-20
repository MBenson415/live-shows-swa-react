import { useState, useRef, useEffect } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageCropModal = ({ equipment, onClose, onSave }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [crop, setCrop] = useState(null);
    const [completedCrop, setCompletedCrop] = useState(null);
    const [uploading, setUploading] = useState(false);
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);

    const ruHeight = equipment.RU * 1.75;
    const rackWidth = 19;
    const aspectRatio = rackWidth / ruHeight;

    useEffect(() => {
        if (equipment.ImageURL) {
            // For external URLs, we need to fetch and convert to blob URL to avoid CORS issues
            const loadImage = async () => {
                try {
                    const response = await fetch(equipment.ImageURL);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    setImageSrc(blobUrl);
                } catch (error) {
                    console.error('Error loading image:', error);
                    // Fallback to direct URL if fetch fails
                    setImageSrc(equipment.ImageURL);
                }
            };

            // Check if it's a data URL or needs fetching
            if (equipment.ImageURL.startsWith('data:')) {
                setImageSrc(equipment.ImageURL);
            } else {
                loadImage();
            }
        }

        return () => {
            // Cleanup blob URL if it was created
            if (imageSrc && imageSrc.startsWith('blob:')) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [equipment.ImageURL]);

    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;

        const cropWidth = width;
        const cropHeight = width / aspectRatio;

        const crop = {
            unit: 'px',
            width: cropWidth,
            height: Math.min(cropHeight, height),
            x: 0,
            y: 0,
            aspect: aspectRatio
        };

        setCrop(crop);
        setCompletedCrop(crop);
    };

    const getCroppedImg = async () => {
        if (!completedCrop || !imgRef.current) {
            return null;
        }

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    resolve(null);
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result.split(',')[1];
                    resolve({
                        base64: base64data,
                        blob: blob
                    });
                };
            }, 'image/jpeg', 0.95);
        });
    };

    const handleSave = async () => {
        if (!completedCrop) {
            alert('Please crop the image first');
            return;
        }

        setUploading(true);
        try {
            const croppedImageData = await getCroppedImg();
            if (!croppedImageData) {
                throw new Error('Failed to crop image');
            }

            const fileName = `rack-equipment-${equipment.RackEquipmentID}-${Date.now()}.jpg`;

            const uploadResponse = await fetch('/api/upload?overwrite=true', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fileName: fileName,
                    fileType: 'image/jpeg',
                    fileData: croppedImageData.base64
                })
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            const uploadResult = await uploadResponse.json();

            await onSave(uploadResult.url);
            onClose();
        } catch (error) {
            console.error('Error uploading cropped image:', error);
            alert('Failed to upload image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Crop Image for {equipment.Brand} {equipment.Model}</h3>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="crop-info">
                        <p>
                            <strong>Equipment Size:</strong> {equipment.RU}U ({ruHeight}" × {rackWidth}")
                        </p>
                        <p>
                            <strong>Required Aspect Ratio:</strong> {rackWidth}:{ruHeight.toFixed(2)}
                            ({aspectRatio.toFixed(2)}:1)
                        </p>
                        {equipment.ImageURL && !imageSrc && (
                            <p style={{ marginTop: '0.5rem', fontSize: '13px', color: '#666' }}>
                                Loading existing image from URL...
                            </p>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onSelectFile}
                        style={{ display: 'none' }}
                    />

                    {!imageSrc && (
                        <div className="image-upload-area">
                            <p style={{ marginBottom: '1rem', color: '#666' }}>
                                {equipment.ImageURL
                                    ? 'Waiting for image to load...'
                                    : 'No image URL set for this equipment'}
                            </p>
                            <button
                                className="btn-primary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Select New Image
                            </button>
                        </div>
                    )}

                    {imageSrc && (
                        <div className="crop-container">
                            <ReactCrop
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspectRatio}
                                minWidth={100}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop preview"
                                    src={imageSrc}
                                    crossOrigin="anonymous"
                                    onLoad={onImageLoad}
                                    style={{ maxWidth: '100%', maxHeight: '60vh' }}
                                />
                            </ReactCrop>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    {imageSrc && (
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                setImageSrc('');
                                setCrop(null);
                                setCompletedCrop(null);
                            }}
                        >
                            Change Image
                        </button>
                    )}
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={!completedCrop || uploading}
                    >
                        {uploading ? 'Uploading...' : 'Save Cropped Image'}
                    </button>
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;