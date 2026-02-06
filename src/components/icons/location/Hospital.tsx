/**
 * Icono de Hospital - Reemplaza 🏥
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

export const HospitalIcon: React.FC<IconProps> = ({ 
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
        {/* Edificio */}
        <path d="M4 21h16M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />
        {/* Cruz médica */}
        <line x1="12" y1="7" x2="12" y2="13" />
        <line x1="9" y1="10" x2="15" y2="10" />
        {/* Puerta */}
        <path d="M10 21v-4h4v4" />
    </svg>
);
