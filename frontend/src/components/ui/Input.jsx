import React from 'react';

const Input = ({ id, label, type = 'text', placeholder, value, onChange, required = false, className = '', error = null, icon = null }) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {React.cloneElement(icon, { className: 'h-5 w-5 text-text-muted' })}
                    </div>
                )}
                <input
                    type={type}
                    id={id}
                    name={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`input-field ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : 'border-secondary/60 focus:ring-primary'}`} // Use @layer class and error state
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            </div>
            {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default Input;