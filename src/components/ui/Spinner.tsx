/**
 * SaludConecta VE - Componente Spinner
 * RF-3: Feedback visual para simular procesos de red y sincronización
 */

import React from 'react';

interface SpinnerProps {
    /** Tamaño del spinner */
    size?: 'sm' | 'md' | 'lg';
    /** Texto opcional a mostrar debajo del spinner */
    text?: string;
    /** Clases CSS adicionales */
    className?: string;
}

const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
};

/**
 * Spinner de carga animado
 * Proporciona feedback visual durante operaciones asíncronas
 */
const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    text,
    className = ''
}) => {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
            role="status"
            aria-live="polite"
        >
            <div className={`${sizeClasses[size]} relative`}>
                {/* Anillo exterior */}
                <div
                    className="absolute inset-0 border-4 border-salud-primario-claro rounded-full"
                    aria-hidden="true"
                />
                {/* Anillo animado */}
                <div
                    className="absolute inset-0 border-4 border-transparent border-t-salud-primario rounded-full animate-spin"
                    aria-hidden="true"
                />
            </div>
            {text && (
                <p className="text-gray-600 text-accesible-base animate-pulse">
                    {text}
                </p>
            )}
            <span className="sr-only">
                {text || 'Cargando...'}
            </span>
        </div>
    );
};

export default Spinner;
