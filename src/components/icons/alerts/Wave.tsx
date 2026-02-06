/**
 * Icono de Saludo - Reemplaza 👋
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

export const WaveIcon: React.FC<IconProps> = ({ 
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
        {/* Mano saludando */}
        <path d="M17.5 3.5c-.5-.5-1.5-.5-2 0L9 10l-1.5-1.5c-.5-.5-1.5-.5-2 0s-.5 1.5 0 2L9 14l.5.5 8-8c.5-.5.5-1.5 0-2z" />
        <path d="M5.5 14.5c-.5.5-.5 1.5 0 2l3 3c.5.5 1.5.5 2 0" />
        <path d="M13.5 6.5l4 4" />
        <path d="M10 13l-6 6h3l6-6" />
    </svg>
);
