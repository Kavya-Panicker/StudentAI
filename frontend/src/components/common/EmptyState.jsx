import { Inbox } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data available for this view.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`empty-state-box ${className}`}>
      <div className="empty-state-icon-wrap">
        <Icon size={32} />
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction} className="empty-state-btn">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
