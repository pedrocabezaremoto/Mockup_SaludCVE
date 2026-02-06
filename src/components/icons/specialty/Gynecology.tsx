/**
 * Icono de Ginecología - Reemplaza 🤰
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

export const GynecologyIcon: React.FC<IconProps> = ({ 
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
        {/* Símbolo femenino simplificado */}
        <circle cx="12" cy="8" r="4" />
        <line x1="12" y1="12" x2="12" y2="20" />
        <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
);
