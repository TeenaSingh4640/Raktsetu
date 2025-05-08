import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg
  className = '',
  disabled = false,
  isLoading = false,
  iconLeft = null,
  iconRight = null,
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center gap-2'; // Use @layer class

  const variantClasses = {
    primary: 'btn-primary', // Use @layer class
    secondary: 'btn-secondary', // Use @layer class
    outline: 'btn-outline', // Use @layer class
    ghost: 'btn bg-transparent text-text-secondary hover:text-text-main hover:bg-secondary/30 focus:ring-primary',
    danger: 'btn bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm', // Default from @layer
    lg: 'px-6 py-3 text-base',
  };

  const loadingClasses = isLoading ? 'opacity-70 cursor-wait' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${loadingClasses} ${disabledClasses} ${className}`}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && iconLeft && <span className="mr-1">{iconLeft}</span>}
      {!isLoading && children}
      {!isLoading && iconRight && <span className="ml-1">{iconRight}</span>}
    </button>
  );
};

export default Button;