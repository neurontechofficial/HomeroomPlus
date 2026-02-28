import { useState, useEffect } from 'react';
import { Classroom, Student, User } from './types';
import { StudentCard } from './components/StudentCard';
import { AddPointModal } from './components/AddPointModal';
import { Auth } from './components/Auth';
import { AddStudentModal } from './components/AddStudentModal';

const API_BASE = 'http://localhost:8080/api'; // this is where spring boot runs

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
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
        let fetchedClassrooms: Classroom[] = await classroomsRes.json();

        let targetClassroom;
        if (fetchedClassrooms.length === 0) {
          const createRes = await fetch(`${API_BASE}/classrooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'My Homeroom', userId: currentUser.id })
          });
          targetClassroom = await createRes.json();
          fetchedClassrooms = [targetClassroom];
        } else {
          targetClassroom = fetchedClassrooms[0];
        }

        setClassrooms(fetchedClassrooms);
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

  const handleClassroomChange = async (classroomId: number) => {
    const target = classrooms.find(c => c.id === classroomId);
    if (!target) return;

    setClassroom(target);
    const studentsRes = await fetch(`${API_BASE}/classrooms/${target.id}/students`);
    const studentsData: Student[] = await studentsRes.json();
    setStudents(studentsData);
  };

  const handleCreateClassroom = async () => {
    if (!currentUser) return;
    const name = prompt("Enter new classroom name:");
    if (!name) return;

    try {
      const res = await fetch(`${API_BASE}/classrooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userId: currentUser.id })
      });
      const newClassroom = await res.json();
      setClassrooms([...classrooms, newClassroom]);
      setClassroom(newClassroom);
      setStudents([]); // Empty students for new class
    } catch (error) {
      console.error('Failed to create classroom', error);
    }
  };

  const handleDeleteClassroom = async () => {
    if (!classroom) return;
    if (!confirm(`Are you sure you want to delete the classroom "${classroom.name}" and all its students?`)) return;

    try {
      await fetch(`${API_BASE}/classrooms/${classroom.id}`, {
        method: 'DELETE'
      });

      const newClassrooms = classrooms.filter(c => c.id !== classroom.id);
      setClassrooms(newClassrooms);

      if (newClassrooms.length > 0) {
        // Switch to the first available class
        handleClassroomChange(newClassrooms[0].id);
      } else {
        setClassroom(null);
        setStudents([]);
      }
    } catch (error) {
      console.error('Failed to delete classroom', error);
    }
  };

  const handleAddStudentClick = () => {
    if (!classroom) {
      alert("Error: Cannot add student because the classroom was not loaded. Please ensure the backend server is running.");
      return;
    }
    setShowAddStudentModal(true);
  };

  const handleCreateStudent = async (name: string, studentEmail: string, parentEmail: string) => {
    if (!classroom) return;

    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          studentEmail,
          parentEmail,
          classroomId: classroom.id,
          avatarUrl: ''
        })
      });
      const newStudent = await res.json();
      setStudents([...students, newStudent]);
      setShowAddStudentModal(false);
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

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Are you sure you want to remove ${student.name}?`)) return;

    try {
      await fetch(`${API_BASE}/students/${student.id}`, {
        method: 'DELETE'
      });
      setStudents(students.filter(s => s.id !== student.id));
    } catch (error) {
      console.error('Failed to delete student', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setClassrooms([]);
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
        <div className="classroom-selector">
          <select
            value={classroom?.id || ''}
            onChange={(e) => handleClassroomChange(Number(e.target.value))}
            className="classroom-dropdown"
          >
            {classrooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="create-class-btn" onClick={handleCreateClassroom}>
            + New Class
          </button>
          {classroom && (
            <button className="delete-class-btn" onClick={handleDeleteClassroom} title="Delete Classroom">
              &times;
            </button>
          )}
        </div>
        <div className="header-controls">
          <button className="add-student-btn" onClick={handleAddStudentClick}>
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
              onDelete={handleDeleteStudent}
            />
          ))}
        </div>
      </main>

      <AddPointModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onAddPoint={handleAddPoint}
      />

      {showAddStudentModal && (
        <AddStudentModal
          onClose={() => setShowAddStudentModal(false)}
          onAddStudent={handleCreateStudent}
        />
      )}
    </div>
  );
}

export default App;
