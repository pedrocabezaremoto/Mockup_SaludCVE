/**
 * Icono de Pediatría - Reemplaza 👶
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

export const PediatricsIcon: React.FC<IconProps> = ({ 
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
        {/* Bebé simplificado */}
        <circle cx="12" cy="8" r="3" />
        <path d="M12 11c-3 0-5 1.5-5 4v3h10v-3c0-2.5-2-4-5-4z" />
        {/* Chupón/pacifier indicator */}
        <circle cx="12" cy="8" r="1" fill="currentColor" />
    </svg>
);
