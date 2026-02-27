import React, { useState, useEffect } from 'react';
import { Classroom, Student, User } from './types';
import { StudentCard } from './components/StudentCard';
import { AddPointModal } from './components/AddPointModal';
import { Auth } from './components/Auth';

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data once user is logged in
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const initData = async () => {
      try {
        // 1. Fetch classrooms for logged-in user
        let classroomsRes = await fetch(`${API_BASE}/classrooms?userId=${currentUser.id}`);
        let classrooms: Classroom[] = await classroomsRes.json();

        let targetClassroom;
        if (classrooms.length === 0) {
          const createRes = await fetch(`${API_BASE}/classrooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'My Homeroom', userId: currentUser.id })
          });
          targetClassroom = await createRes.json();
        } else {
          targetClassroom = classrooms[0];
        }

        setClassroom(targetClassroom);

        // 2. Fetch students for this classroom
        const studentsRes = await fetch(`${API_BASE}/classrooms/${targetClassroom.id}/students`);
        const studentsData: Student[] = await studentsRes.json();
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Could not connect to the backend server. Is Spring Boot running on port 8080?');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [currentUser]);

  const handleAddStudent = async () => {
    if (!classroom) {
      alert("Error: Cannot add student because the classroom was not loaded. Please ensure the backend server is running.");
      return;
    }

    const name = prompt("Enter student's name:");
    if (!name) return;

    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, classroomId: classroom.id, avatarUrl: '' })
      });
      const newStudent = await res.json();
      setStudents([...students, newStudent]);
    } catch (error) {
      console.error('Failed to add student', error);
    }
  };

  const handleAddPoint = async (studentId: number, points: number, description: string) => {
    try {
      const res = await fetch(`${API_BASE}/students/${studentId}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points, description })
      });
      const updatedStudent = await res.json();

      setStudents(students.map(s => s.id === studentId ? updatedStudent : s));
      setSelectedStudent(null);
    } catch (error) {
      console.error('Failed to add points', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setClassroom(null);
    setStudents([]);
    setError(null);
  };

  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  if (loading) return <div>Loading HomeroomPlus...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}><h2>Connection Error</h2><p>{error}</p></div>;

  return (
    <div className="app-container">
      <header className="header">
        <h1>{classroom?.name || 'Classroom'}</h1>
        <div className="header-controls">
          <button className="add-student-btn" onClick={handleAddStudent}>
            + Add Student
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <div className="student-grid">
          {students.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={setSelectedStudent}
            />
          ))}
        </div>
      </main>

      <AddPointModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onAddPoint={handleAddPoint}
      />
    </div>
  );
}

export default App;
