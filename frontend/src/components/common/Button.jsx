import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="btn-spinner" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={16} className="btn-icon-left" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon size={16} className="btn-icon-right" />}
        </>
      )}
    </button>
  );
};

export default Button;
