import { useState } from 'react';
import {
  Clock,
  UploadCloud,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import BackendNotice from '../../components/common/BackendNotice';
import { useNotification } from '../../context/useNotification';

export const AssignmentsPage = () => {
  const { showNotification } = useNotification();
  const [filter, setFilter] = useState('ALL');
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const initialAssignments = [
    {
      id: 'ASN-01',
      code: 'CS301',
      course: 'Design & Analysis of Algorithms',
      title: 'Dynamic Programming & Memoization Lab',
      dueDate: 'Tomorrow, 11:59 PM',
      weight: '10 Marks',
      status: 'Pending',
      description: 'Implement Longest Common Subsequence and 0/1 Knapsack problem using dynamic programming.',
    },
    {
      id: 'ASN-02',
      code: 'CS304',
      course: 'Database Management Systems',
      title: 'SQL Normalization & Complex Joins',
      dueDate: 'Nov 04, 2026',
      weight: '15 Marks',
      status: 'Pending',
      description: 'Complete normalization case study up to BCNF with relational algebra equivalences.',
    },
    {
      id: 'ASN-03',
      code: 'CS306',
      course: 'Operating Systems Concepts',
      title: 'Process Synchronization using Semaphores',
      dueDate: 'Oct 24, 2026',
      weight: '10 Marks',
      status: 'Submitted',
      submittedOn: 'Oct 23, 2026',
      grade: '9.5 / 10',
      description: 'Solve the Dining Philosophers Problem without deadlocks using POSIX semaphores.',
    },
    {
      id: 'ASN-04',
      code: 'MA301',
      course: 'Discrete Mathematics',
      title: 'Graph Theory & Eulerian Paths',
      dueDate: 'Oct 18, 2026',
      weight: '10 Marks',
      status: 'Evaluated',
      submittedOn: 'Oct 17, 2026',
      grade: '10 / 10',
      description: 'Prove the Handshaking Lemma and determine Hamiltonian cycle properties.',
    },
  ];

  const [assignments, setAssignments] = useState(initialAssignments);

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status.toUpperCase() === filter;
  });

  const handleOpenSubmit = (asn) => {
    setSelectedAssignment(asn);
    setSelectedFile(null);
    setSubmissionModalOpen(true);
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showNotification({
        type: 'warning',
        title: 'File Required',
        message: 'Please choose a document before submitting.',
      });
      return;
    }

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAssignment.id
          ? { ...a, status: 'Submitted', submittedOn: 'Just now' }
          : a
      )
    );

    showNotification({
      type: 'success',
      title: 'Submission Staged',
      message: `File "${selectedFile.name}" accepted. Backend document storage required to persist.`,
    });
    setSubmissionModalOpen(false);
  };

  return (
    <div className="assignments-page">
      <div className="page-header-row">
        <div>
          <h2>Course Assignments</h2>
          <p>Track homework, laboratory problem sets, and submission deadlines</p>
        </div>

        {/* Filter buttons */}
        <div className="filter-pill-group">
          {['ALL', 'PENDING', 'SUBMITTED', 'EVALUATED'].map((f) => (
            <button
              key={f}
              className={`filter-pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <BackendNotice
        status="BACKEND REQUIRED"
        endpoint="POST /api/assignments/submit & GET /api/assignments"
        description="Assignment UI scaffold. Backend assignment submission schema, file storage (S3/GridFS), and grading endpoints are pending backend implementation."
      />

      {/* Assignment List */}
      <div className="assignment-grid mt-4">
        {filteredAssignments.map((asn) => (
          <div key={asn.id} className="assignment-card">
            <div className="assignment-top">
              <span className="course-code-tag">{asn.code}</span>
              <Badge
                variant={
                  asn.status === 'Submitted'
                    ? 'blue'
                    : asn.status === 'Evaluated'
                    ? 'success'
                    : 'warning'
                }
                size="sm"
              >
                {asn.status}
              </Badge>
            </div>

            <h3 className="assignment-title">{asn.title}</h3>
            <p className="assignment-course">{asn.course}</p>
            <p className="assignment-desc">{asn.description}</p>

            <div className="assignment-footer">
              <div className="due-info">
                <Clock size={14} />
                <span>Due: <strong>{asn.dueDate}</strong></span>
              </div>

              {asn.status === 'Pending' ? (
                <Button
                  variant="primary"
                  size="sm"
                  icon={UploadCloud}
                  onClick={() => handleOpenSubmit(asn)}
                >
                  Submit Work
                </Button>
              ) : (
                <div className="grade-badge">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span>{asn.grade ? `Grade: ${asn.grade}` : 'Under Review'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        title="Submit Assignment"
        subtitle={selectedAssignment ? `${selectedAssignment.code} • ${selectedAssignment.title}` : ''}
      >
        <form onSubmit={handleSubmitFile} className="space-y-4">
          <div className="upload-dropzone">
            <UploadCloud size={38} className="text-blue-500 mb-2" />
            <p className="font-semibold text-sm">Upload your project / PDF report</p>
            <span className="text-xs text-gray-400">Supported formats: PDF, ZIP, DOCX (Max 25MB)</span>
            <input
              type="file"
              id="file-input"
              className="mt-3 text-xs"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>

          {selectedFile && (
            <div className="selected-file-pill">
              <FileText size={16} />
              <span>{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          <div className="modal-actions-row">
            <Button variant="ghost" onClick={() => setSubmissionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!selectedFile}>
              Confirm Submission
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssignmentsPage;
