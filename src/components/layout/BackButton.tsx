/**
 * SaludConecta VE - Componente BackButton
 * Botón de "Volver" siempre visible en subpáginas
 * Requisito de navegación: evitar que el usuario se pierda
 */

import React from 'react';

interface BackButtonProps {
    /** Texto del botón */
    label?: string;
    /** Callback al hacer click */
    onClick: () => void;
    /** Clases CSS adicionales */
    className?: string;
}

/**
 * Botón de navegación para volver a la pantalla anterior
 * Siempre visible en las subpáginas para facilitar la navegación
 */
const BackButton: React.FC<BackButtonProps> = ({
    label = 'Volver',
    onClick,
    className = ''
}) => {
    return (
        <button
            onClick={onClick}
            className={`
        inline-flex items-center gap-2 px-4 py-2
        text-salud-primario font-medium
        hover:bg-salud-primario-claro rounded-lg
        transition-colors duration-smooth
        focus-visible:ring-2 focus-visible:ring-salud-primario
        ${className}
      `}
            aria-label={label}
        >
            {/* Icono de flecha */}
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                />
            </svg>
            <span>{label}</span>
        </button>
    );
};

export default BackButton;
