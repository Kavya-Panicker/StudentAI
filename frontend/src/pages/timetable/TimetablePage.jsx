import { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  Printer,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import BackendNotice from '../../components/common/BackendNotice';

export const TimetablePage = () => {
  const [selectedDay, setSelectedDay] = useState('Thursday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const scheduleData = {
    Monday: [
      { time: '09:00 - 10:30 AM', code: 'CS301', title: 'Design & Analysis of Algorithms', prof: 'Dr. Sarah Mitchell', room: 'Hall 302', type: 'Lecture' },
      { time: '10:45 - 12:15 PM', code: 'CS304', title: 'Database Management Systems', prof: 'Prof. R. Sharma', room: 'Hall 204', type: 'Lecture' },
      { time: '01:15 - 03:15 PM', code: 'CS304L', title: 'DBMS Practical Lab', prof: 'Prof. R. Sharma', room: 'Lab CS-2', type: 'Laboratory' },
    ],
    Tuesday: [
      { time: '09:00 - 10:30 AM', code: 'CS306', title: 'Operating Systems Concepts', prof: 'Dr. Alex Carter', room: 'Hall 302', type: 'Lecture' },
      { time: '10:45 - 12:15 PM', code: 'MA301', title: 'Discrete Mathematical Structures', prof: 'Prof. Ananya Sen', room: 'Hall 105', type: 'Lecture' },
      { time: '02:00 - 03:30 PM', code: 'CS308', title: 'Computer Networks', prof: 'Dr. Vikram Nair', room: 'Hall 302', type: 'Lecture' },
    ],
    Wednesday: [
      { time: '09:00 - 10:30 AM', code: 'CS301', title: 'Design & Analysis of Algorithms', prof: 'Dr. Sarah Mitchell', room: 'Hall 302', type: 'Lecture' },
      { time: '10:45 - 12:45 PM', code: 'CS301L', title: 'Algorithms Lab Session', prof: 'Dr. Sarah Mitchell', room: 'Lab CS-1', type: 'Laboratory' },
      { time: '02:00 - 03:30 PM', code: 'CS306', title: 'Operating Systems Concepts', prof: 'Dr. Alex Carter', room: 'Hall 302', type: 'Lecture' },
    ],
    Thursday: [
      { time: '09:00 - 10:30 AM', code: 'CS301', title: 'Design & Analysis of Algorithms', prof: 'Dr. Sarah Mitchell', room: 'Hall 302', type: 'Lecture', isLive: true },
      { time: '11:00 - 12:30 PM', code: 'CS304', title: 'Database Management Systems Lab', prof: 'Prof. R. Sharma', room: 'Lab CS-2', type: 'Laboratory' },
      { time: '02:00 - 03:30 PM', code: 'CS306', title: 'Operating Systems Concepts', prof: 'Dr. Alex Carter', room: 'Seminar Hall', type: 'Lecture' },
    ],
    Friday: [
      { time: '09:00 - 10:30 AM', code: 'CS308', title: 'Computer Networks', prof: 'Dr. Vikram Nair', room: 'Hall 302', type: 'Lecture' },
      { time: '10:45 - 12:15 PM', code: 'MA301', title: 'Discrete Mathematical Structures', prof: 'Prof. Ananya Sen', room: 'Hall 105', type: 'Lecture' },
      { time: '02:00 - 04:00 PM', code: 'CS390', title: 'Capstone Project Evaluation', prof: 'Faculty Committee', room: 'Seminar Room', type: 'Project' },
    ],
  };

  const currentSchedule = scheduleData[selectedDay] || [];

  return (
    <div className="timetable-page">
      <div className="page-header-row">
        <div>
          <h2>Academic Timetable</h2>
          <p>Weekly lecture timetable, laboratory sessions, and classroom allocations</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Printer}
          onClick={() => window.print()}
        >
          Print Schedule
        </Button>
      </div>

      <BackendNotice
        status="BACKEND REQUIRED"
        endpoint="GET /api/timetable/my-schedule"
        description="Timetable UI scaffold. Backend database schema and class allocation endpoints are pending backend implementation."
      />

      {/* Day Selector Navigation */}
      <div className="timetable-day-tabs mt-4">
        {days.map((day) => (
          <button
            key={day}
            className={`day-tab-btn ${selectedDay === day ? 'active' : ''}`}
            onClick={() => setSelectedDay(day)}
          >
            <CalendarDays size={16} />
            <span>{day}</span>
          </button>
        ))}
      </div>

      {/* Schedule Cards */}
      <div className="timetable-timeline mt-4">
        {currentSchedule.map((item, idx) => (
          <div key={idx} className={`timeline-card ${item.isLive ? 'is-live' : ''}`}>
            <div className="timeline-time-col">
              <Clock size={16} />
              <strong>{item.time}</strong>
              {item.isLive && (
                <span className="live-pulse-badge">
                  <span className="pulse-dot" /> Live Class
                </span>
              )}
            </div>

            <div className="timeline-details-col">
              <div className="timeline-header">
                <span className="course-code-tag">{item.code}</span>
                <Badge variant={item.type === 'Laboratory' ? 'purple' : 'blue'} size="sm">
                  {item.type}
                </Badge>
              </div>

              <h3 className="course-headline">{item.title}</h3>

              <div className="timeline-meta-row">
                <span className="meta-item">
                  <User size={14} />
                  {item.prof}
                </span>
                <span className="meta-item">
                  <MapPin size={14} />
                  {item.room}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimetablePage;
