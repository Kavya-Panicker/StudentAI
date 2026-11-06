import { useState } from 'react';
import {
  Users,
  BookOpen,
  PlusCircle,
  FileCheck,
  ClipboardList,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import BackendNotice from '../../components/common/BackendNotice';
import Modal from '../../components/common/Modal';
import FormField from '../../components/forms/FormField';
import { useNotification } from '../../context/useNotification';

export const FacultyDashboard = () => {
  const { user, activeUniversity } = useAuth();
  const { showNotification } = useNotification();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [courseCode, setCourseCode] = useState('CS301');
  const [dueDate, setDueDate] = useState('');
  const [searchStudent, setSearchStudent] = useState('');

  const assignedCourses = [
    { code: 'CS301', title: 'Design & Analysis of Algorithms', enrolled: 64, credits: 4, room: 'Hall 302' },
    { code: 'CS304', title: 'Database Management Systems Lab', enrolled: 32, credits: 2, room: 'Lab CS-2' },
    { code: 'CS402', title: 'Machine Learning & Deep Neural Networks', enrolled: 48, credits: 4, room: 'Room 410' },
  ];

  const studentsRoster = [
    { id: 'STU001', name: 'Alex Johnson', email: 'alex.j@studentai.example', attendance: '92%', grade: 'A' },
    { id: 'STU002', name: 'Priya Sharma', email: 'priya.s@studentai.example', attendance: '88%', grade: 'A+' },
    { id: 'STU003', name: 'David Chen', email: 'david.c@studentai.example', attendance: '74%', grade: 'B' },
    { id: 'STU004', name: 'Kavya Panicker', email: 'kavya.p@studentai.example', attendance: '96%', grade: 'A+' },
    { id: 'STU005', name: 'Marcus Taylor', email: 'marcus.t@studentai.example', attendance: '81%', grade: 'B+' },
  ];

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!assignmentTitle || !dueDate) return;

    showNotification({
      type: 'info',
      title: 'Assignment Form Processed',
      message: `Assignment "${assignmentTitle}" staged. Backend assignment storage endpoint required.`,
    });
    setCreateModalOpen(false);
    setAssignmentTitle('');
    setDueDate('');
  };

  const filteredStudents = studentsRoster.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.id.toLowerCase().includes(searchStudent.toLowerCase())
  );

  return (
    <div className="faculty-dashboard">
      {/* Faculty Hero Banner */}
      <section className="student-hero-banner faculty-hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            FACULTY & INSTRUCTOR PORTAL
          </div>
          <h1>
            Welcome, <span>{user?.fullName || 'Faculty Member'}</span>
          </h1>
          <p className="hero-details">
            Dept: <strong>{user?.department || 'Computer Science & Engineering'}</strong> • Designation:{' '}
            <strong>{user?.designation || 'Associate Professor'}</strong> • University:{' '}
            <strong>{activeUniversity?.name || 'StudentAI University'}</strong>
          </p>
        </div>

        <div className="hero-badge-box">
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Assignment
          </Button>
        </div>
      </section>

      {/* Backend Required Architecture Notice */}
      <BackendNotice
        status="BACKEND REQUIRED"
        endpoint="POST /api/faculty/assignments & GET /api/faculty/courses"
        description="Faculty portal UI scaffold. Backend endpoints for instructor authentication, course assignment CRUD, and gradebook records are pending backend implementation."
      />

      {/* Metric Cards Row */}
      <section className="summary-grid mt-4">
        <article className="summary-card">
          <div className="summary-icon purple">
            <BookOpen size={20} />
          </div>
          <p className="summary-title">Active Courses</p>
          <div className="summary-value-row">
            <h3>{assignedCourses.length}</h3>
          </div>
          <p className="summary-note">Semester 5 & 7</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon blue">
            <Users size={20} />
          </div>
          <p className="summary-title">Total Students Taught</p>
          <div className="summary-value-row">
            <h3>144</h3>
          </div>
          <p className="summary-note">Across 3 lecture batches</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon green">
            <FileCheck size={20} />
          </div>
          <p className="summary-title">Average Attendance</p>
          <div className="summary-value-row">
            <h3>86.2%</h3>
          </div>
          <p className="summary-note">Department target: 75%</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon orange">
            <ClipboardList size={20} />
          </div>
          <p className="summary-title">Assignments Evaluated</p>
          <div className="summary-value-row">
            <h3>18 / 24</h3>
          </div>
          <p className="summary-note">6 pending review</p>
        </article>
      </section>

      {/* Main Grid: Courses & Student Directory */}
      <div className="dashboard-grid">
        {/* Left: Assigned Courses */}
        <Card
          title="Assigned Courses & Modules"
          subtitle="Current semester teaching allocation"
          headerAction={<Badge variant="purple" size="sm">Fall 2026</Badge>}
        >
          <div className="faculty-course-grid">
            {assignedCourses.map((c) => (
              <div key={c.code} className="faculty-course-card">
                <div className="course-card-top">
                  <span className="course-code-badge">{c.code}</span>
                  <span className="course-room">{c.room}</span>
                </div>
                <h4 className="course-card-title">{c.title}</h4>
                <div className="course-card-footer">
                  <span>Enrolled: <strong>{c.enrolled} Students</strong></span>
                  <span>Credits: <strong>{c.credits}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Enrolled Students Roster */}
        <Card
          title="Class Student Roster"
          subtitle="Enrolled students & attendance status"
          headerAction={
            <div className="search-box-sm">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search student..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
              />
            </div>
          }
        >
          <div className="table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Attendance</th>
                  <th>Est. Grade</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((st) => (
                  <tr key={st.id}>
                    <td><strong>{st.id}</strong></td>
                    <td>{st.name}</td>
                    <td>
                      <Badge
                        variant={parseInt(st.attendance) >= 75 ? 'success' : 'danger'}
                        size="sm"
                      >
                        {st.attendance}
                      </Badge>
                    </td>
                    <td><Badge variant="blue" size="sm">{st.grade}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Course Assignment"
        subtitle="Publish problem statement & deadline for students"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <FormField
            label="Assignment Title"
            name="title"
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="e.g. Dynamic Programming Lab Assignment 3"
            required
          />

          <div className="form-field-group">
            <label className="form-field-label">Target Course</label>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="form-input-control"
            >
              {assignedCourses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Submission Deadline"
            name="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <div className="modal-actions-row">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FacultyDashboard;
