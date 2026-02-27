import React from 'react';
import { Student } from '../types';

interface AddPointModalProps {
    student: Student | null;
    onClose: () => void;
    onAddPoint: (studentId: number, points: number, description: string) => void;
}

export const AddPointModal: React.FC<AddPointModalProps> = ({ student, onClose, onAddPoint }) => {
    if (!student) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Award point to {student.name}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="points-grid">
                    <button
                        className="point-btn positive"
                        onClick={() => onAddPoint(student.id, 1, 'Great Teamwork')}
                    >
                        <span className="point-icon">🤝</span>
                        <span className="point-label">Teamwork</span>
                        <span className="point-value">+1</span>
                    </button>
                    <button
                        className="point-btn positive"
                        onClick={() => onAddPoint(student.id, 1, 'Working Hard')}
                    >
                        <span className="point-icon">💪</span>
                        <span className="point-label">Working Hard</span>
                        <span className="point-value">+1</span>
                    </button>
                    <button
                        className="point-btn negative"
                        onClick={() => onAddPoint(student.id, -1, 'Off Task')}
                    >
                        <span className="point-icon">⚠️</span>
                        <span className="point-label">Off Task</span>
                        <span className="point-value">-1</span>
                    </button>
                    <button
                        className="point-btn negative"
                        onClick={() => onAddPoint(student.id, -1, 'Talking out of turn')}
                    >
                        <span className="point-icon">🤫</span>
                        <span className="point-label">Talking</span>
                        <span className="point-value">-1</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
