import React from 'react';

const Card = ({ children, className = '', padding = 'p-6', element: Element = 'div', ...props }) => {
    return (
        <Element className={`card ${padding} ${className}`} {...props}> {/* Use @layer class */}
            {children}
        </Element>
    );
};

export default Card;