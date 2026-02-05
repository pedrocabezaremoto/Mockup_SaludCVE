/**
 * SaludConecta VE - Componente Card
 * Tarjeta contenedora reutilizable para información
 */

import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Si la tarjeta tiene efecto hover */
    hoverable?: boolean;
    /** Padding interno */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Si la tarjeta está seleccionada */
    selected?: boolean;
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

/**
 * Tarjeta contenedora con sombra y bordes redondeados
 */
const Card: React.FC<CardProps> = ({
    hoverable = false,
    padding = 'md',
    selected = false,
    children,
    className = '',
    ...props
}) => {
    return (
        <div
            className={`
        bg-white rounded-2xl shadow-lg
        border-2 transition-all duration-smooth
        ${paddingClasses[padding]}
        ${hoverable ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : ''}
        ${selected
                    ? 'border-salud-accion ring-2 ring-salud-accion/30'
                    : 'border-gray-100'
                }
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
