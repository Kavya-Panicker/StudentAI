import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...', size = 24, fullPage = false }) => {
  const content = (
    <div className="loading-spinner-box">
      <Loader2 size={size} className="spinner-icon" />
      {label && <p className="spinner-label">{label}</p>}
    </div>
  );

  if (fullPage) {
    return <div className="loading-spinner-fullpage">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
