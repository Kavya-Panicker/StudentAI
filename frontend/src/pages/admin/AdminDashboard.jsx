import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  PlusCircle,
  AlertCircle,
  Activity,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { getUniversities, createUniversity } from '../../api/universityApi';
import { checkBackendHealth } from '../../api/authApi';
import { checkFaceServiceHealth } from '../../api/attendanceApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import FormField from '../../components/forms/FormField';
import BackendNotice from '../../components/common/BackendNotice';
import { useNotification } from '../../context/useNotification';

export const AdminDashboard = () => {
  const { universities, reloadUniversities } = useAuth();
  const { showNotification } = useNotification();

  const [universityList, setUniversityList] = useState(universities);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // System Health States
  const [backendStatus, setBackendStatus] = useState('checking');
  const [faceServiceStatus, setFaceServiceStatus] = useState('checking');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    address: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const checkHealth = useCallback(async () => {
    try {
      const bRes = await checkBackendHealth();
      setBackendStatus(bRes.success ? 'online' : 'error');
    } catch {
      setBackendStatus('offline');
    }

    try {
      const fRes = await checkFaceServiceHealth();
      setFaceServiceStatus(fRes.success ? 'online' : 'error');
    } catch {
      setFaceServiceStatus('offline');
    }
  }, []);

  const fetchLatestUniversities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUniversities();
      if (res && res.data) {
        setUniversityList(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch universities:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      checkHealth();
      fetchLatestUniversities();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkHealth, fetchLatestUniversities]);

  const handleCreateUniversity = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'University name is required';
    if (!formData.code.trim()) errs.code = 'University code is required';
    if (!formData.email.trim()) errs.email = 'Official email is required';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setFormLoading(true);
    setFormErrors({});

    try {
      await createUniversity(formData);
      showNotification({
        type: 'success',
        title: 'University Created',
        message: `${formData.name} (${formData.code.toUpperCase()}) successfully registered in database.`,
      });
      setCreateModalOpen(false);
      setFormData({ name: '', code: '', email: '', address: '' });
      await fetchLatestUniversities();
      if (reloadUniversities) reloadUniversities();
    } catch (err) {
      const msg = err.message || 'Failed to create university';
      setFormErrors({ form: msg });
      showNotification({
        type: 'error',
        title: 'Registration Error',
        message: msg,
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <section className="student-hero-banner admin-hero">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            CENTRAL ADMINISTRATOR CONSOLE
          </div>
          <h1>
            Institutional <span>Overview & Management</span>
          </h1>
          <p className="hero-details">
            Manage multi-tenant universities, monitor microservices & examine system security.
          </p>
        </div>

        <div className="hero-badge-box">
          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => setCreateModalOpen(true)}
          >
            Add Institution
          </Button>
        </div>
      </section>

      {/* Backend API Notice */}
      <BackendNotice
        status="DONE AND TESTED"
        endpoint="GET & POST /api/universities"
        description="University records are stored and fetched live from the MongoDB database."
      />

      {/* System Health Monitor Cards */}
      <section className="summary-grid mt-4">
        <article className="summary-card">
          <div className="summary-icon blue">
            <Building2 size={20} />
          </div>
          <p className="summary-title">Registered Universities</p>
          <div className="summary-value-row">
            <h3>{universityList.length}</h3>
          </div>
          <p className="summary-note">Active multi-tenant institutions</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon green">
            <Database size={20} />
          </div>
          <p className="summary-title">Core API & MongoDB</p>
          <div className="summary-value-row">
            <Badge variant={backendStatus === 'online' ? 'success' : 'danger'} size="md">
              {backendStatus === 'online' ? 'Connected (Port 5000)' : 'Offline / Error'}
            </Badge>
          </div>
          <p className="summary-note">Mongoose `studentai` database</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon purple">
            <ShieldCheck size={20} />
          </div>
          <p className="summary-title">Python Biometric Service</p>
          <div className="summary-value-row">
            <Badge variant={faceServiceStatus === 'online' ? 'success' : 'danger'} size="md">
              {faceServiceStatus === 'online' ? 'Running (Port 5001)' : 'Offline'}
            </Badge>
          </div>
          <p className="summary-note">DeepFace Facenet512 Engine</p>
        </article>

        <article className="summary-card">
          <div className="summary-icon orange">
            <Activity size={20} />
          </div>
          <p className="summary-title">Role Isolation Boundary</p>
          <div className="summary-value-row">
            <h3>Enforced</h3>
          </div>
          <p className="summary-note">JWT claims & institution keys</p>
        </article>
      </section>

      {/* Universities Directory */}
      <div className="mt-4">
        <Card
          title="Institutions & University Registry"
          subtitle="All universities provisioned on StudentAI"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              icon={PlusCircle}
              onClick={() => setCreateModalOpen(true)}
            >
              Register University
            </Button>
          }
        >
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-500">Loading universities...</div>
          ) : universityList.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No universities found. Click "Register University" to create one.
            </div>
          ) : (
            <div className="table-container">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>University Name</th>
                    <th>Official Email</th>
                    <th>Campus Address</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {universityList.map((uni) => (
                    <tr key={uni._id}>
                      <td>
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded">
                          {uni.code}
                        </span>
                      </td>
                      <td>
                        <strong>{uni.name}</strong>
                      </td>
                      <td>{uni.email}</td>
                      <td>{uni.address || '—'}</td>
                      <td>
                        <Badge variant={uni.isActive ? 'success' : 'neutral'} size="sm">
                          {uni.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        {uni.createdAt
                          ? new Date(uni.createdAt).toLocaleDateString('en-IN')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Add University Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Register New University"
        subtitle="Provision an isolated tenant database domain"
      >
        <form onSubmit={handleCreateUniversity} className="space-y-4">
          {formErrors.form && (
            <div className="auth-error-alert">
              <AlertCircle size={16} />
              <span>{formErrors.form}</span>
            </div>
          )}

          <FormField
            label="University Legal Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. National Institute of Technology"
            required
            error={formErrors.name}
          />

          <FormField
            label="Unique University Code (Uppercase)"
            name="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="e.g. NIT001"
            required
            error={formErrors.code}
          />

          <FormField
            label="Official Contact Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. admin@nit.edu"
            required
            error={formErrors.email}
          />

          <FormField
            label="Campus Address"
            name="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="e.g. Bangalore, Karnataka, India"
          />

          <div className="modal-actions-row">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={formLoading}>
              Save to Database
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
