import { CheckCircle2, Server, Terminal } from 'lucide-react';

export const BackendNotice = ({
  status = 'BACKEND REQUIRED',
  endpoint = '',
  description = '',
  className = '',
}) => {
  const isLive = status === 'DONE AND TESTED' || status === 'LIVE';

  return (
    <div className={`backend-notice-banner ${isLive ? 'notice-live' : 'notice-pending'} ${className}`}>
      <div className="notice-icon-col">
        {isLive ? <CheckCircle2 size={18} /> : <Server size={18} />}
      </div>
      <div className="notice-content-col">
        <div className="notice-header-row">
          <span className={`notice-tag ${isLive ? 'tag-live' : 'tag-pending'}`}>
            {status}
          </span>
          {endpoint && (
            <code className="notice-endpoint">
              <Terminal size={12} />
              {endpoint}
            </code>
          )}
        </div>
        <p className="notice-text">
          {description ||
            (isLive
              ? 'This module is communicating with the active StudentAI backend API.'
              : 'Interactive UI preview ready. Requires backend database schema, routes, and authorization middleware to persist.')}
        </p>
      </div>
    </div>
  );
};

export default BackendNotice;
