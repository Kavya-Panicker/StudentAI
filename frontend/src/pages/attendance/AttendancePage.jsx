import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardCheck,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  AlertCircle,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import BackendNotice from '../../components/common/BackendNotice';
import FaceCheckInModal from './FaceCheckInModal';
import { getMyAttendance } from '../../api/attendanceApi';

export const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyAttendance();
      if (res && res.data) {
        setRecords(res.data);
      }
    } catch (err) {
      console.warn('Attendance load error:', err.message);
      setError(err.message || 'Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAttendance();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAttendance]);

  // Filter records
  const filteredRecords = records.filter((rec) => {
    const formattedDate = new Date(rec.attendanceDate).toLocaleDateString('en-IN');
    const matchesDate = searchDate ? formattedDate.includes(searchDate) : true;
    const matchesStatus = statusFilter === 'ALL' || rec.status.toUpperCase() === statusFilter;
    return matchesDate && matchesStatus;
  });

  const presentDays = records.filter((r) => r.status === 'Present').length;
  // Calculate today's status in IST
  const todayIST = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const markedToday = records.some((r) => {
    const recordDate = new Date(r.attendanceDate).toISOString().slice(0, 10);
    return recordDate === todayIST;
  });

  return (
    <div className="attendance-page">
      {/* Header action bar */}
      <div className="page-header-row">
        <div>
          <h2>Attendance Management</h2>
          <p>Review verified biometric attendance records and daily check-ins</p>
        </div>

        <div className="header-actions">
          <Button
            variant="primary"
            icon={Camera}
            onClick={() => setModalOpen(true)}
          >
            Launch Face Check-In
          </Button>
        </div>
      </div>

      {/* Backend API Notice */}
      <BackendNotice
        status="DONE AND TESTED"
        endpoint="GET /api/attendance/me"
        description="Attendance history queries the live StudentAI MongoDB attendance collection via JWT authentication."
      />

      {/* Metric Cards */}
      <div className="summary-grid mt-4">
        <article className="summary-card">
          <div className="summary-icon green">
            <CheckCircle2 size={20} />
          </div>
          <p className="summary-title">Days Present</p>
          <div className="summary-value-row">
            <h3>{loading ? '...' : presentDays}</h3>
          </div>
          <p className="summary-note">Total verified days</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon blue">
            <ClipboardCheck size={20} />
          </div>
          <p className="summary-title">Today's Status</p>
          <div className="summary-value-row">
            <Badge variant={markedToday ? 'success' : 'warning'} size="md">
              {markedToday ? 'Present Today' : 'Not Marked Today'}
            </Badge>
          </div>
          <p className="summary-note">{new Date().toLocaleDateString('en-IN')}</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon purple">
            <ShieldCheck size={20} />
          </div>
          <p className="summary-title">Verification Engine</p>
          <div className="summary-value-row">
            <h3>Facenet512</h3>
          </div>
          <p className="summary-note">OpenCV Biometric Detector</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon orange">
            <Clock size={20} />
          </div>
          <p className="summary-title">ERP Attendance Policy</p>
          <div className="summary-value-row">
            <h3>75%</h3>
          </div>
          <p className="summary-note">Minimum requirement for exams</p>
        </article>
      </div>

      {/* Attendance Table Panel */}
      <Card
        title="Official Attendance History"
        subtitle="Individual student attendance ledger with biometric timestamps"
        headerAction={
          <div className="flex items-center gap-2">
            <div className="search-box-sm">
              <Search size={14} />
              <input
                type="text"
                placeholder="Filter by date..."
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <select
              className="select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PRESENT">Present</option>
            </select>
          </div>
        }
      >
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Fetching records from database...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500 text-sm">
            <AlertCircle size={24} className="mx-auto mb-2" />
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={fetchAttendance} className="mt-3">
              Retry Load
            </Button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No Attendance Records Found"
            description={
              searchDate || statusFilter !== 'ALL'
                ? 'No records match the applied filters.'
                : 'No attendance records have been marked yet in this semester.'
            }
            actionLabel="Open Face Check-In"
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div className="table-container">
            <table className="portal-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Attendance Date</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Confidence Score</th>
                  <th>Marked At (IST)</th>
                  <th>Audit Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec, index) => (
                  <tr key={rec._id}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>
                        {new Date(rec.attendanceDate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </strong>
                    </td>
                    <td>
                      <Badge variant="success" size="sm">
                        {rec.status}
                      </Badge>
                    </td>
                    <td>
                      <span className="method-pill">
                        <ShieldCheck size={13} />
                        {rec.method}
                      </span>
                    </td>
                    <td>
                      {rec.faceMatchConfidence !== null && rec.faceMatchConfidence !== undefined
                        ? `${rec.faceMatchConfidence.toFixed(1)}%`
                        : 'Server Verified'}
                    </td>
                    <td>
                      {new Date(rec.markedAt || rec.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td>
                      <code className="text-xs text-gray-400">
                        {rec._id.slice(-8)}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Biometric Verification Modal */}
      <FaceCheckInModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AttendancePage;
