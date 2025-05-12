import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, type = 'button', ...props }) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${className ?? ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
