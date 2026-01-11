import React, { useRef } from 'react';
import { FaCamera, FaUserCircle } from 'react-icons/fa';

const AvatarUpload = ({ src, onFileSelect, size = 120, editable = true }) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (editable) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file);
        }
    };

    return (
        <div
            style={{
                position: 'relative', width: size, height: size, margin: '0 auto 1.5rem',
                cursor: editable ? 'pointer' : 'default'
            }}
            onClick={handleClick}
            title={editable ? "Click to change profile photo" : "Profile Photo"}
        >
            {src ? (
                <img src={src} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
            ) : (
                <FaUserCircle size={size} color="#e9ecef" style={{ background: 'white', borderRadius: '50%' }} />
            )}

            {editable && (
                <>
                    <div style={{
                        position: 'absolute', bottom: '5px', right: '5px',
                        background: '#00cc66', color: 'white',
                        borderRadius: '50%', width: '35px', height: '35px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '3px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s', zIndex: 2
                    }}>
                        <FaCamera size={16} />
                    </div>
                </>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
                disabled={!editable}
            />
        </div>
    );
};

export default AvatarUpload;
