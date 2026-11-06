import { useState } from 'react';
import {
  Download,
  Printer,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import BackendNotice from '../../components/common/BackendNotice';
import { useNotification } from '../../context/useNotification';

export const ReportsPage = () => {
  const { user, activeUniversity } = useAuth();
  const { showNotification } = useNotification();
  const [selectedSemester, setSelectedSemester] = useState('Sem 4');

  const courseReportData = [
    { code: 'CS301', course: 'Design & Analysis of Algorithms', credits: 4, internal: 28, external: 62, total: 90, grade: 'A+' },
    { code: 'CS304', course: 'Database Management Systems', credits: 4, internal: 27, external: 58, total: 85, grade: 'A' },
    { code: 'CS306', course: 'Operating Systems Concepts', credits: 4, internal: 25, external: 55, total: 80, grade: 'A' },
    { code: 'MA301', course: 'Discrete Mathematical Structures', credits: 4, internal: 29, external: 65, total: 94, grade: 'A+' },
    { code: 'CS304L', course: 'DBMS Laboratory', credits: 2, internal: 48, external: 46, total: 94, grade: 'O' },
  ];

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Code,Course,Credits,Internal,External,Total,Grade\n' +
      courseReportData
        .map((c) => `${c.code},"${c.course}",${c.credits},${c.internal},${c.external},${c.total},${c.grade}`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudentAI_Grade_Report_${user?.studentId || 'Report'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification({
      type: 'success',
      title: 'Report Downloaded',
      message: 'Academic transcript CSV generated successfully.',
    });
  };

  return (
    <div className="reports-page">
      <div className="page-header-row">
        <div>
          <h2>Academic & Attendance Reports</h2>
          <p>Official grade sheets, transcripts, and semester attendance audits</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Grade Sheet
          </Button>
        </div>
      </div>

      <BackendNotice
        status="BACKEND REQUIRED"
        endpoint="GET /api/reports/transcript & /api/reports/attendance-audit"
        description="Academic reporting interface scaffold. Backend transcript generation and historical semester archives are pending backend development."
      />

      {/* Student Transcript Card */}
      <Card
        className="mt-4"
        title="Official Semester Grade Transcript"
        subtitle={`Student: ${user?.fullName || 'Alex Johnson'} • Roll No: ${user?.studentId || 'STU001'} • ${activeUniversity?.name}`}
        headerAction={
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="select-sm"
          >
            <option value="Sem 4">Semester 4 (Current)</option>
            <option value="Sem 3">Semester 3</option>
            <option value="Sem 2">Semester 2</option>
            <option value="Sem 1">Semester 1</option>
          </select>
        }
      >
        <div className="table-container">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Internal (30)</th>
                <th>End Sem (70)</th>
                <th>Total (100)</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {courseReportData.map((row) => (
                <tr key={row.code}>
                  <td><strong>{row.code}</strong></td>
                  <td>{row.course}</td>
                  <td>{row.credits}</td>
                  <td>{row.internal}</td>
                  <td>{row.external}</td>
                  <td><strong>{row.total}</strong></td>
                  <td><Badge variant="blue" size="sm">{row.grade}</Badge></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"><strong>Semester Summary</strong></td>
                <td><strong>18 Credits</strong></td>
                <td colSpan="3" className="text-right"><strong>SGPA (Semester GPA):</strong></td>
                <td><Badge variant="success" size="md">9.12 / 10.0</Badge></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;
