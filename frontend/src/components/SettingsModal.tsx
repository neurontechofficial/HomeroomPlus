import React, { useState } from 'react';
import { User } from '../types';

interface SettingsModalProps {
    user: User;
    onClose: () => void;
    onUpdateUser: (user: User) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ user, onClose, onUpdateUser }) => {
    const [secretaryEmail, setSecretaryEmail] = useState(user.secretaryEmail || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(`http://localhost:8080/api/users/${user.id}/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretaryEmail })
            });

            if (!res.ok) throw new Error('Failed to save settings');

            const updatedUser = await res.json();
            onUpdateUser(updatedUser);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Settings</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="settings-form">
                    <div className="form-group">
                        <label>House Secretary Email</label>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            All positive and negative point updates will be BCC'd to this address.
                        </p>
                        <input
                            type="email"
                            placeholder="secretary@example.com"
                            value={secretaryEmail}
                            onChange={(e) => setSecretaryEmail(e.target.value)}
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button
                        className="add-student-btn"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};
