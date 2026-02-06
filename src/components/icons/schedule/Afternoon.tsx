/**
 * Icono de Tarde/Atardecer - Reemplaza 🌆
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

export const AfternoonIcon: React.FC<IconProps> = ({ 
    size = 'md', 
    className = '' 
}) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        className={`${sizeMap[size]} ${className}`}
        aria-hidden="true"
    >
        {/* Luna creciente */}
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);
