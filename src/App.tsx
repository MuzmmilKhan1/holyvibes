import Layout from './pages/Layout';
import './App.css';
import Login from './pages/auth/Login';
import { Routes, Route } from 'react-router-dom';
import Course from './pages/admin/Course';
import CreateTeacherAccount from './pages/auth/CreateTeacherAccount';
import CreateStudentAccount from './pages/auth/CreateStudentAccount';
import Teacher from './pages/admin/Teacher';
import RestrictionMessage from './pages/RestrictionMessage';
import AdminClasses from './pages/admin/Classes';
import StudentPolicy from './pages/admin/StudentPolicy';
import Event from './pages/admin/Event';
import Classes from './pages/teacher/Classes';
import Students from './pages/admin/Students';

function App() {
  return (
    <>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/restriction-message" element={<RestrictionMessage />} />
        <Route path="/create-teacher-account" element={<CreateTeacherAccount />} />
        <Route path="/create-student-account" element={<CreateStudentAccount />} />

        <Route path="/admin" element={<Layout userType="admin" />}>
          <Route path="course" element={<Course />} />
          <Route path="teacher" element={<Teacher />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="policy" element={<StudentPolicy />} />
          <Route path="event" element={<Event />} />
          <Route path="students" element={<Students />} />
        </Route>

        <Route path="/student" element={<Layout userType="student" />} >
          <Route path="classes" element={<Teacher />} />
        </Route>

        <Route path="/teacher" element={<Layout userType="teacher" />} >
          <Route path="classes" element={<Classes />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;