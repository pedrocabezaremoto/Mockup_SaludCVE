/**
 * SaludConecta VE - Logo SVG
 * Logo minimalista B/N para la plataforma de citas médicas
 * Representa la identidad visual del proyecto
 */

import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
};

/**
 * Logo SVG de SaludConecta VE
 * Diseño: Corazón estilizado con cruz médica, representando
 * la conexión entre salud y tecnología
 */
const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClasses[size]} ${className}`}
            aria-label="Logo SaludConecta VE"
        >
            {/* Círculo exterior */}
            <circle
                cx="50"
                cy="50"
                r="46"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
            />

            {/* Corazón estilizado con pulso cardíaco */}
            <path
                d="M50 75
           C35 65, 22 52, 22 40
           C22 30, 30 24, 38 24
           C44 24, 48 28, 50 32
           C52 28, 56 24, 62 24
           C70 24, 78 30, 78 40
           C78 52, 65 65, 50 75Z"
                fill="currentColor"
                opacity="0.15"
            />

            {/* Línea de pulso cardíaco (ECG) */}
            <path
                d="M20 50
           L35 50
           L40 35
           L45 60
           L50 42
           L55 55
           L60 48
           L65 50
           L80 50"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Punto de conexión */}
            <circle
                cx="50"
                cy="42"
                r="4"
                fill="currentColor"
            />

            {/* Pequeña cruz médica */}
            <rect x="47" y="68" width="6" height="12" rx="1" fill="currentColor" />
            <rect x="44" y="71" width="12" height="6" rx="1" fill="currentColor" />
        </svg>
    );
};

export default Logo;
