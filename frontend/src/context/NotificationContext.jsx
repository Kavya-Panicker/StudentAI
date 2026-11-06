import { useState, useCallback } from 'react';
import { NotificationContext } from './notificationContextInstance';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showNotification = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const newNotification = { id, type, title, message };

    setNotifications((prev) => [...prev, newNotification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification, removeNotification }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {notifications.map((n) => {
          const Icon =
            n.type === 'success'
              ? CheckCircle2
              : n.type === 'error'
              ? AlertCircle
              : n.type === 'warning'
              ? AlertTriangle
              : Info;

          return (
            <div key={n.id} className={`toast-card toast-${n.type}`} role="alert">
              <div className="toast-icon">
                <Icon size={18} />
              </div>
              <div className="toast-body">
                {n.title && <strong className="toast-title">{n.title}</strong>}
                <p className="toast-message">{n.message}</p>
              </div>
              <button
                className="toast-close"
                onClick={() => removeNotification(n.id)}
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
