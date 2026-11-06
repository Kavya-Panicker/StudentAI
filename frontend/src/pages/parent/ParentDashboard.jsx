import {
  Award,
  ClipboardCheck,
  BookOpen,
  CalendarDays,
  PhoneCall,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import BackendNotice from '../../components/common/BackendNotice';

export const ParentDashboard = () => {
  const { user, activeUniversity } = useAuth();

  const wardInfo = {
    name: user?.wardName || 'Alex Miller',
    studentId: user?.wardStudentId || 'STU2026-CS-042',
    department: user?.wardDepartment || 'Computer Science & Engineering',
    semester: user?.wardSemester || 4,
    attendanceRate: '89.4%',
    cgpa: '8.72 / 10.0',
    advisorName: 'Dr. Sarah Mitchell',
    advisorEmail: 's.mitchell@studentai.edu',
  };

  const wardCourses = [
    { code: 'CS301', name: 'Design & Analysis of Algorithms', attendance: '92%', grade: 'A' },
    { code: 'CS304', name: 'Database Management Systems', attendance: '88%', grade: 'A' },
    { code: 'CS306', name: 'Operating Systems', attendance: '85%', grade: 'B+' },
    { code: 'MA301', name: 'Discrete Mathematical Structures', attendance: '91%', grade: 'A' },
  ];

  return (
    <div className="parent-dashboard">
      {/* Parent Banner */}
      <section className="student-hero-banner parent-hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            PARENT & GUARDIAN PORTAL
          </div>
          <h1>
            Welcome, <span>{user?.fullName || 'Parent Account'}</span>
          </h1>
          <p className="hero-details">
            Monitoring Ward: <strong>{wardInfo.name}</strong> • Roll No:{' '}
            <strong>{wardInfo.studentId}</strong> • Dept:{' '}
            <strong>{wardInfo.department}</strong> (Sem {wardInfo.semester})
          </p>
        </div>

        <div className="hero-badge-box">
          <Badge variant="green" size="md">
            Active Ward Linked
          </Badge>
          <span className="hero-code-tag">{activeUniversity?.name}</span>
        </div>
      </section>

      {/* Backend Required Architecture Notice */}
      <BackendNotice
        status="BACKEND REQUIRED"
        endpoint="GET /api/parents/ward-profile & GET /api/parents/ward-attendance"
        description="Parent-ward security requirement: Parent accounts must only access student records they are authorized to view. Dedicated backend parent authentication and authorized parent-child verification middleware are pending backend development."
      />

      {/* Ward Status Cards */}
      <section className="summary-grid mt-4">
        <article className="summary-card">
          <div className="summary-icon green">
            <ClipboardCheck size={20} />
          </div>
          <p className="summary-title">Ward Attendance Rate</p>
          <div className="summary-value-row">
            <h3>{wardInfo.attendanceRate}</h3>
          </div>
          <p className="summary-note">Requirement: Minimum 75%</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon blue">
            <Award size={20} />
          </div>
          <p className="summary-title">Cumulative GPA (CGPA)</p>
          <div className="summary-value-row">
            <h3>{wardInfo.cgpa}</h3>
          </div>
          <p className="summary-note">First Class with Distinction</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon purple">
            <BookOpen size={20} />
          </div>
          <p className="summary-title">Enrolled Courses</p>
          <div className="summary-value-row">
            <h3>4 Core</h3>
          </div>
          <p className="summary-note">All courses on track</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon orange">
            <CalendarDays size={20} />
          </div>
          <p className="summary-title">Upcoming Exams</p>
          <div className="summary-value-row">
            <h3>Nov 18</h3>
          </div>
          <p className="summary-note">Mid-Term Examination Week</p>
        </article>
      </section>

      {/* Grid: Course Progress & Mentor Contact */}
      <div className="dashboard-grid">
        <Card
          title="Course Academic Progress & Attendance"
          subtitle="Real-time academic records for current semester"
        >
          <div className="table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Attendance</th>
                  <th>Performance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {wardCourses.map((c) => (
                  <tr key={c.code}>
                    <td><strong>{c.code}</strong></td>
                    <td>{c.name}</td>
                    <td>
                      <Badge variant="success" size="sm">
                        {c.attendance}
                      </Badge>
                    </td>
                    <td><Badge variant="blue" size="sm">{c.grade}</Badge></td>
                    <td>
                      <span className="flex items-center gap-1 text-xs text-green-700">
                        <CheckCircle2 size={13} /> Satisfactory
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Academic Advisor Contact */}
        <div className="flex flex-col gap-4">
          <Card title="Assigned Academic Advisor" subtitle="Direct university contact for ward guidance">
            <div className="mentor-card-body">
              <div className="mentor-avatar">SM</div>
              <div className="mentor-info">
                <h4>{wardInfo.advisorName}</h4>
                <p className="text-xs text-gray-500">Associate Professor • Dept Mentor</p>
                <div className="mentor-contact-item mt-2">
                  <Mail size={14} />
                  <span>{wardInfo.advisorEmail}</span>
                </div>
                <div className="mentor-contact-item">
                  <PhoneCall size={14} />
                  <span>+91 98765 43210 (Mon-Fri 2-4 PM)</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="University Circulars & Alerts" subtitle="Official notifications sent to parents">
            <div className="circular-list">
              <div className="circular-item">
                <span className="circular-dot" />
                <div>
                  <strong>Parent-Teacher Conference Scheduled</strong>
                  <p>Saturday, Nov 14 at 10:00 AM • Main Auditorium</p>
                </div>
              </div>
              <div className="circular-item">
                <span className="circular-dot" />
                <div>
                  <strong>Odd Semester Fee Payment Clearance</strong>
                  <p>Due date: Nov 30, 2026. Online portal active.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
