import { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  BookOpen,
  MessageSquareText,
  Clock3,
  TrendingUp,
  BookMarked,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { getMyAttendance } from '../../api/attendanceApi';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BackendNotice from '../../components/common/BackendNotice';
import EmptyState from '../../components/common/EmptyState';

export const StudentDashboard = ({ onNavigate }) => {
  const { user, activeUniversity } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoadingAttendance(true);
        const res = await getMyAttendance();
        if (res && res.data) {
          setAttendanceRecords(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch attendance:', err.message);
      } finally {
        setLoadingAttendance(false);
      }
    };

    fetchAttendance();
  }, []);

  const totalMarkedDays = attendanceRecords.length;

  return (
    <div className="student-dashboard">
      {/* Student Welcome Banner */}
      <section className="student-hero-banner">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            ACADEMIC STUDENT DESK
          </div>
          <h1>
            Welcome back, <span>{user?.fullName || 'Student'}</span>
          </h1>
          <p className="hero-details">
            Roll No: <strong>{user?.studentId || 'STU001'}</strong> • Dept:{' '}
            <strong>{user?.department || 'Computer Science & Engineering'}</strong> • Semester:{' '}
            <strong>Semester {user?.semester || 1}</strong>
          </p>
        </div>

        <div className="hero-badge-box">
          <Badge variant="purple" size="md">
            {activeUniversity?.name || 'StudentAI University'}
          </Badge>
          <span className="hero-code-tag">Code: {activeUniversity?.code || 'SA-01'}</span>
        </div>
      </section>

      {/* Metric Cards Row */}
      <section className="summary-grid">
        <article className="summary-card">
          <div className="summary-icon blue">
            <ClipboardCheck size={20} />
          </div>
          <p className="summary-title">Total Attendance Marked</p>
          <div className="summary-value-row">
            <h3>{loadingAttendance ? '...' : totalMarkedDays}</h3>
            <span className="summary-trend">
              <TrendingUp size={14} />
            </span>
          </div>
          <p className="summary-note">Verified via Face Biometrics</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon green">
            <Award size={20} />
          </div>
          <p className="summary-title">Current Semester</p>
          <div className="summary-value-row">
            <h3>Sem {user?.semester || 1}</h3>
          </div>
          <p className="summary-note">Academic Year 2026</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon purple">
            <BookMarked size={20} />
          </div>
          <p className="summary-title">Registered Courses</p>
          <div className="summary-value-row">
            <h3>6</h3>
          </div>
          <p className="summary-note">Core & Electives Active</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon orange">
            <Clock3 size={20} />
          </div>
          <p className="summary-title">Pending Submissions</p>
          <div className="summary-value-row">
            <h3>2</h3>
          </div>
          <p className="summary-note">Assignments due this week</p>
        </article>
      </section>

      {/* Main Grid: Attendance Preview & Timetable Schedule */}
      <div className="dashboard-grid">
        {/* Left Column: Recent Attendance Log */}
        <Card
          title="Recent Attendance Log"
          subtitle="Real-time verified daily check-in records"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('Attendance')}
            >
              Open Biometrics Screen
            </Button>
          }
        >
          <BackendNotice
            status="DONE AND TESTED"
            endpoint="GET /api/attendance/me"
            description="Loaded live from your authenticated attendance history."
            className="mb-3"
          />

          {loadingAttendance ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading attendance history...</div>
          ) : attendanceRecords.length === 0 ? (
            <EmptyState
              icon={ClipboardCheck}
              title="No attendance records logged yet"
              description="Your daily attendance marked through biometric verification will appear here."
              actionLabel="Go to Attendance Verification"
              onAction={() => onNavigate('Attendance')}
            />
          ) : (
            <div className="table-container">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Verification Method</th>
                    <th>Marked Time</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.slice(0, 5).map((rec) => (
                    <tr key={rec._id}>
                      <td>
                        {new Date(rec.attendanceDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td>
                        <Badge variant="success" size="sm">
                          {rec.status}
                        </Badge>
                      </td>
                      <td>
                        <span className="badge-tag">
                          {rec.method === 'face-recognition' ? 'Face Recognition' : rec.method}
                        </span>
                      </td>
                      <td>
                        {new Date(rec.markedAt || rec.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Right Column: Quick Access & Schedule */}
        <div className="flex flex-col gap-4">
          <Card title="Today's Class Schedule" subtitle="Thursday • Computer Science Dept">
            <div className="schedule-mini-list">
              <div className="schedule-mini-item current">
                <div className="schedule-time">
                  <strong>09:00 - 10:30 AM</strong>
                  <span>Hall 302</span>
                </div>
                <div className="schedule-course">
                  <strong>CS301 • Design & Analysis of Algorithms</strong>
                  <span>Dr. Sarah Mitchell</span>
                </div>
                <Badge variant="blue" size="sm">In Progress</Badge>
              </div>

              <div className="schedule-mini-item">
                <div className="schedule-time">
                  <strong>11:00 - 12:30 PM</strong>
                  <span>Lab CS-2</span>
                </div>
                <div className="schedule-course">
                  <strong>CS304 • Database Management Systems Lab</strong>
                  <span>Prof. R. Sharma</span>
                </div>
                <Badge variant="neutral" size="sm">Upcoming</Badge>
              </div>

              <div className="schedule-mini-item">
                <div className="schedule-time">
                  <strong>02:00 - 03:30 PM</strong>
                  <span>Seminar Room</span>
                </div>
                <div className="schedule-course">
                  <strong>CS306 • Operating Systems Concepts</strong>
                  <span>Dr. Alex Carter</span>
                </div>
                <Badge variant="neutral" size="sm">Upcoming</Badge>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => onNavigate('Timetable')}
            >
              View Full Week Timetable →
            </Button>
          </Card>

          <Card title="Quick Portal Links" subtitle="Navigate academic services">
            <div className="quick-links">
              {[
                { label: 'Attendance & Biometrics', detail: 'Check-in and attendance history', icon: ClipboardCheck, page: 'Attendance', color: 'green' },
                { label: 'Course Assignments', detail: '2 submissions pending deadline', icon: BookOpen, page: 'Assignments', color: 'orange' },
                { label: 'AI Academic Assistant', detail: 'Ask questions regarding syllabus', icon: MessageSquareText, page: 'AI Assistant', color: 'blue' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className="quick-link"
                    onClick={() => onNavigate(item.page)}
                  >
                    <div className={`quick-icon ${item.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="quick-copy">
                      <strong>{item.label}</strong>
                      <span>{item.detail}</span>
                    </div>
                    <span className="quick-arrow">→</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
