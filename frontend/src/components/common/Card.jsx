export const Card = ({ children, className = '', title, subtitle, headerAction, footer }) => {
  return (
    <article className={`portal-card ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="portal-card-header">
          <div className="portal-card-header-titles">
            {title && <h3 className="portal-card-title">{title}</h3>}
            {subtitle && <p className="portal-card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="portal-card-action">{headerAction}</div>}
        </div>
      )}
      <div className="portal-card-body">{children}</div>
      {footer && <div className="portal-card-footer">{footer}</div>}
    </article>
  );
};

export default Card;
