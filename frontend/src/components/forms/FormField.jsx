export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  helpText,
  disabled = false,
  rightElement,
  children,
  className = '',
}) => {
  return (
    <div className={`form-field-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={name} className="form-field-label">
          {label}
          {required && <span className="field-required-asterisk">*</span>}
        </label>
      )}

      {children ? (
        children
      ) : (
        <div className="form-input-wrapper">
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className="form-input-control"
          />
          {rightElement && <div className="form-input-right">{rightElement}</div>}
        </div>
      )}

      {error && <p className="form-field-error">{error}</p>}
      {!error && helpText && <p className="form-field-help">{helpText}</p>}
    </div>
  );
};

export default FormField;
