import Layout from './pages/Layout';
import './App.css';
import Login from './pages/auth/Login';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import TeacherCourse from './pages/teacher/TeacherCourse';
import AllotTeacher from './pages/admin/AllotTeacher';
import TeacherAllotment from './pages/teacher/TeacherAllotment';
import EnrolledCourses from './pages/student/EnrolledCourses';
import Policy from './pages/student/Policy';
import RouteProtector from './config/RouteProtector';
import { useEffect } from 'react';
import UpcommmingEvents from './pages/student/UpcommmingEvents';
import Courses from './pages/student/Courses';
import StudentPerformance from './pages/teacher/StudentPerformance';
import StudentPerformanceReport from './pages/admin/StudentPerformanceReport';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const expiry = localStorage.getItem("expiry");
    if (expiry && new Date().getTime() > parseInt(expiry, 10)) {
      localStorage.clear();
      navigate('/');
    }
  }, [navigate]);
  return (
    <Routes>
      <Route path="/" element={
        <RouteProtector isAuthenticate={false}>
          <Login />
        </RouteProtector>
      } />
      <Route path="/restriction-message" element={<RestrictionMessage />} />
      <Route path="/create-teacher-account" element={<CreateTeacherAccount />} />
      <Route path="/create-student-account" element={<CreateStudentAccount />} />

      <Route path="/admin" element={
        <RouteProtector isAuthenticate={true}>
          <Layout userType="admin" />
        </RouteProtector>
      }>
        <Route path="course" element={<Course />} />
        <Route path="teacher" element={<Teacher />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="policy" element={<StudentPolicy />} />
        <Route path="event" element={<Event />} />
        <Route path="allot-teacher" element={<AllotTeacher />} />
        <Route path="students" element={<Students />} />
        <Route path="student-Performance-report" element={<StudentPerformanceReport />} />
      </Route>

      <Route path="/student" element={
        <RouteProtector isAuthenticate={true}>
          <Layout userType="student" />
        </RouteProtector>
      }>
        <Route path="enrolled-courses" element={<EnrolledCourses />} />
        <Route path="policy" element={<Policy />} />
        <Route path="event" element={<UpcommmingEvents />} />
        <Route path="courses" element={<Courses />} />

      </Route>

      <Route path="/teacher" element={
        <RouteProtector isAuthenticate={true}>
          <Layout userType="teacher" />
        </RouteProtector>
      }>
        <Route path="classes" element={<Classes />} />
        <Route path="course" element={<TeacherCourse />} />
        <Route path="alloted-students" element={<TeacherAllotment />} />
        <Route path="student-performance" element={<StudentPerformance />} />

      </Route>
    </Routes>
  );
}

export default App;
