import React, { useState } from 'react';

interface AddStudentModalProps {
    onClose: () => void;
    onAddStudent: (name: string, studentEmail: string, parentEmail: string) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onClose, onAddStudent }) => {
    const [name, setName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [parentEmail, setParentEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddStudent(name, studentEmail, parentEmail);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add New Student</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Student Name *</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="studentEmail">Student Email (optional)</label>
                        <input
                            type="email"
                            id="studentEmail"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="parentEmail">Parent Email (optional)</label>
                        <input
                            type="email"
                            id="parentEmail"
                            value={parentEmail}
                            onChange={(e) => setParentEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn">Add Student</button>
                </form>
            </div>
        </div>
    );
};
