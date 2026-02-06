/**
 * Icono de Doctor/Doctora - Reemplaza 👨‍⚕️ 👩‍⚕️
 * Estilo: Minimalista unicolor
 */

import React from 'react';

interface IconProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

export const DoctorIcon: React.FC<IconProps> = ({ 
    size = 'md', 
    className = '' 
}) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${sizeMap[size]} ${className}`}
        aria-hidden="true"
    >
        {/* Cabeza */}
        <circle cx="12" cy="8" r="4" />
        {/* Cuerpo */}
        <path d="M12 12c-4 0-7 2-7 5v3h14v-3c0-3-3-5-7-5z" />
        {/* Cruz médica */}
        <line x1="12" y1="15" x2="12" y2="18" />
        <line x1="10.5" y1="16.5" x2="13.5" y2="16.5" />
    </svg>
);
