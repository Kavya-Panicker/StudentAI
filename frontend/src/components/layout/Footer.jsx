import { useAuth } from '../../context/useAuth';

export const Footer = () => {
  const { activeUniversity, backendHealthy } = useAuth();

  return (
    <footer className="page-footer">
      <div className="footer-left">
        <span>© {new Date().getFullYear()} StudentAI University Portal</span>
        <span className="footer-separator">•</span>
        <span>Institution: <strong>{activeUniversity?.name || 'Demo University'}</strong> ({activeUniversity?.code || 'DEMO001'})</span>
      </div>

      <div className="footer-right">
        <span className="system-status-indicator">
          <span className={`status-led ${backendHealthy ? 'led-green' : 'led-amber'}`} />
          API: {backendHealthy ? 'Connected (Port 5000)' : 'Connecting / Offline'}
        </span>
        <span className="footer-separator">•</span>
        <span>Version 1.0.0</span>
      </div>
    </footer>
  );
};

export default Footer;
