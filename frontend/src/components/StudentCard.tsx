import React from 'react';
import { Student } from '../types';

interface StudentCardProps {
    student: Student;
    onClick: (student: Student) => void;
    onDelete?: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick, onDelete }) => {
    const getBadgeClass = (points: number) => {
        if (points > 0) return 'positive';
        if (points < 0) return 'negative';
        return 'neutral';
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete(student);
    };

    return (
        <div className="student-card" onClick={() => onClick(student)}>
            {onDelete && (
                <button className="delete-student-btn" onClick={handleDelete} title="Remove student">
                    &times;
                </button>
            )}
            <div className="avatar">
                {student.avatarUrl ? (
                    <img src={student.avatarUrl} alt={student.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                    student.name.charAt(0)
                )}
            </div>
            <h3 className="student-name">{student.name}</h3>
            <div className={`points-badge ${getBadgeClass(student.totalPoints)}`}>
                {student.totalPoints > 0 ? '+' : ''}{student.totalPoints}
            </div>
        </div>
    );
};
