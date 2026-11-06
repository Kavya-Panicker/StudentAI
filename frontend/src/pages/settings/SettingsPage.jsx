import { useState } from 'react';
import {
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import FormField from '../../components/forms/FormField';
import { useNotification } from '../../context/useNotification';

export const SettingsPage = () => {
  const { user, role, activeUniversity } = useAuth();
  const { showNotification } = useNotification();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showNotification({
        type: 'warning',
        title: 'Input Required',
        message: 'Please fill out all password fields.',
      });
      return;
    }
    if (newPassword.length < 8) {
      showNotification({
        type: 'error',
        title: 'Password Too Short',
        message: 'New password must contain at least 8 characters.',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showNotification({
        type: 'error',
        title: 'Mismatch',
        message: 'New passwords do not match.',
      });
      return;
    }

    showNotification({
      type: 'info',
      title: 'Password Update Staged',
      message: 'Backend password mutation endpoint (PUT /api/students/password) required to persist.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="settings-page">
      <div className="page-header-row">
        <div>
          <h2>Settings & Preferences</h2>
          <p>Manage your account security, notification alerts, and institutional settings</p>
        </div>
      </div>

      <div className="dashboard-grid mt-4">
        {/* Left Column: Account Profile & Password */}
        <div className="flex flex-col gap-4">
          <Card title="Account Profile" subtitle="Your registered university identity">
            <div className="space-y-3">
              <div className="profile-detail-item">
                <span className="detail-label">Full Name:</span>
                <span className="detail-value">{user?.fullName || 'Alex Johnson'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Account Role:</span>
                <Badge variant="blue" size="sm">
                  {role ? role.toUpperCase() : 'STUDENT'}
                </Badge>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Email Address:</span>
                <span className="detail-value">{user?.email || 'user@studentai.edu'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Student / Employee ID:</span>
                <span className="detail-value font-mono">{user?.studentId || user?.id || 'STU001'}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{user?.department || 'Computer Science & Engineering'}</span>
              </div>
            </div>
          </Card>

          <Card title="Security & Password" subtitle="Update your authentication credentials">
            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <FormField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <FormField
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
              <FormField
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
              />

              <Button type="submit" variant="primary" size="sm" icon={KeyRound} className="mt-2">
                Update Password
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Institutional Details & Alerts */}
        <div className="flex flex-col gap-4">
          <Card title="Institution Tenant Details" subtitle="Active multi-tenant configuration">
            <div className="space-y-3">
              <div className="profile-detail-item">
                <span className="detail-label">Institution:</span>
                <span className="detail-value font-semibold">{activeUniversity?.name}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">University Code:</span>
                <span className="detail-value font-mono">{activeUniversity?.code}</span>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Tenant Status:</span>
                <Badge variant="success" size="sm">Active Domain</Badge>
              </div>
              <div className="profile-detail-item">
                <span className="detail-label">Data Isolation:</span>
                <span className="detail-value text-xs text-gray-500">
                  Strictly partitioned by universityId
                </span>
              </div>
            </div>
          </Card>

          <Card title="Notification Preferences" subtitle="Configure email and portal notifications">
            <div className="space-y-4">
              <label className="toggle-row">
                <div>
                  <strong>Biometric Attendance Alerts</strong>
                  <p className="text-xs text-gray-500">Receive instant confirmation on attendance</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
              </label>

              <label className="toggle-row">
                <div>
                  <strong>Assignment Deadlines</strong>
                  <p className="text-xs text-gray-500">Email alerts 24 hours prior to deadline</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlertsEnabled}
                  onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                />
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
