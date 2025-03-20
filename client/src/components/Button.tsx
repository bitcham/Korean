import React from 'react';
import './Button.css';

type ButtonVariant =
    | 'skip'
    | 'hint'
    | 'check'
    | 'back';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'skip', children, ...props }) => {
    const buttonClass = `button ${variant}`;

    return (
        <button className={buttonClass} {...props}>
            {children}
        </button>
    );
};

export default Button;