import React from 'react';
import '../styles/global.css';

const Field = ({ label, children, error, hint }) => {
  return (
    <div className="field" style={{ marginBottom: '16px' }}>
      {label && (
        <label className="field-label" style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '500',
          color: 'var(--text-primary)'
        }}>
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <span className="field-hint" style={{
          display: 'block',
          marginTop: '4px',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field-error" style={{
          display: 'block',
          marginTop: '4px',
          fontSize: '12px',
          color: 'var(--danger)'
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

const Row = ({ children, gap = '16px', align = 'center' }) => {
  return (
    <div className="row" style={{
      display: 'flex',
      alignItems: align,
      gap: gap,
      flexWrap: 'wrap'
    }}>
      {children}
    </div>
  );
};

const TextInput = ({ 
  value, 
  onChange, 
  placeholder, 
  type = 'text', 
  disabled = false,
  error,
  icon,
  ...props 
}) => {
  return (
    <div className="text-input-wrapper" style={{ position: 'relative', width: '100%' }}>
      {icon && (
        <span style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }}>
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
        style={{
          width: '100%',
          padding: icon ? '12px 40px 12px 12px' : '12px',
          borderRadius: 'var(--radius-md)',
          border: error ? '1px solid var(--danger)' : '1px solid var(--border)',
          backgroundColor: disabled ? 'var(--bg-hover)' : 'var(--bg-card)',
          fontSize: '14px',
          transition: 'all 0.2s ease'
        }}
      />
    </div>
  );
};

const NumberInput = ({ 
  value, 
  onChange, 
  placeholder, 
  min, 
  max, 
  step = 1,
  disabled = false,
  error,
  ...props 
}) => {
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      onChange(e);
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      {...props}
      style={{
        width: '100%',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: error ? '1px solid var(--danger)' : '1px solid var(--border)',
        backgroundColor: disabled ? 'var(--bg-hover)' : 'var(--bg-card)',
        fontSize: '14px',
        textAlign: 'left',
        direction: 'ltr'
      }}
    />
  );
};

const Select = ({ 
  value, 
  onChange, 
  options, 
  placeholder,
  disabled = false,
  error,
  ...props 
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
      style={{
        width: '100%',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: error ? '1px solid var(--danger)' : '1px solid var(--border)',
        backgroundColor: disabled ? 'var(--bg-hover)' : 'var(--bg-card)',
        fontSize: '14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left 12px center',
        paddingRight: '12px',
        paddingLeft: '30px'
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  ...props 
}) => {
  const variants = {
    primary: 'gradient-primary',
    accent: 'gradient-accent',
    success: 'gradient-success',
    danger: 'gradient-danger',
    ghost: 'bg-transparent',
    outline: 'bg-transparent border-2'
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '14px' },
    lg: { padding: '16px 32px', fontSize: '16px' }
  };

  const baseStyle = {
    ...sizes[size],
    borderRadius: 'var(--radius-md)',
    fontWeight: '500',
    color: variant === 'ghost' || variant === 'outline' ? 'var(--primary)' : 'white',
    border: variant === 'outline' ? '2px solid var(--primary)' : 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: variant !== 'ghost' && variant !== 'outline' ? '0 4px 6px rgba(99, 102, 241, 0.3)' : 'none'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={variants[variant]}
      {...props}
      style={{
        ...baseStyle,
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled || loading ? 0.6 : 1
      }}
    >
      {loading && (
        <span className="spinner" style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
};

const Card = ({ children, className = '', style = {}, hover = true }) => {
  return (
    <div 
      className={`card ${className}`}
      style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow)',
        padding: '20px',
        transition: 'all 0.3s ease',
        ...style
      }}
    >
      {children}
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }}
      />
      <div 
        className="modal-content animate-popIn"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          zIndex: 1001,
          width: '90%',
          maxWidth: '400px',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: 'var(--shadow-lg)',
          animation: 'popIn 0.3s ease'
        }}
      >
        {title && (
          <h2 style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: 'var(--text-primary)'
          }}>
            {title}
          </h2>
        )}
        <div>{children}</div>
        {footer && (
          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const variants = {
    primary: { background: 'var(--primary-light)', color: 'white' },
    success: { background: 'var(--success)', color: 'white' },
    warning: { background: 'var(--warning)', color: 'white' },
    danger: { background: 'var(--danger)', color: 'white' },
    info: { background: 'var(--info)', color: 'white' },
    neutral: { background: 'var(--bg-hover)', color: 'var(--text-secondary)' }
  };

  const sizes = {
    sm: { padding: '4px 8px', fontSize: '11px' },
    md: { padding: '6px 12px', fontSize: '12px' },
    lg: { padding: '8px 16px', fontSize: '14px' }
  };

  return (
    <span 
      className="badge"
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: '20px',
        fontWeight: '500',
        display: 'inline-block'
      }}
    >
      {children}
    </span>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  const getToastStyle = (type) => {
    const styles = {
      success: { borderRight: '4px solid var(--success)', background: '#ecfdf5' },
      error: { borderRight: '4px solid var(--danger)', background: '#fef2f2' },
      warning: { borderRight: '4px solid var(--warning)', background: '#fffbeb' },
      info: { borderRight: '4px solid var(--info)', background: '#eff6ff' }
    };
    return styles[type] || styles.info;
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast animate-slideIn"
          style={{
            ...getToastStyle(toast.type),
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: 'var(--text-primary)'
          }}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export { Field, Row, TextInput, NumberInput, Select, Button, Card, Modal, Badge, ToastContainer };
