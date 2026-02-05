/**
 * SaludConecta VE - Componente Button
 * Botón reutilizable con variantes accesibles
 * Diseñado para público rural y personas mayores (botones táctiles amplios)
 */

import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Variante visual del botón */
    variant?: ButtonVariant;
    /** Tamaño del botón */
    size?: ButtonSize;
    /** Indica si el botón está en estado de carga */
    isLoading?: boolean;
    /** Icono a mostrar antes del texto */
    leftIcon?: React.ReactNode;
    /** Icono a mostrar después del texto */
    rightIcon?: React.ReactNode;
    /** Si ocupa todo el ancho disponible */
    fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: `
    bg-salud-accion text-white 
    hover:bg-salud-accion-hover 
    focus-visible:ring-4 focus-visible:ring-salud-accion/50
  `,
    secondary: `
    bg-salud-primario-claro text-salud-primario 
    hover:bg-sky-200
  `,
    outline: `
    border-2 border-salud-primario text-salud-primario 
    hover:bg-salud-primario hover:text-white
  `,
    danger: `
    bg-red-500 text-white 
    hover:bg-red-600
    focus-visible:ring-4 focus-visible:ring-red-500/50
  `,
    ghost: `
    text-gray-600 
    hover:bg-gray-100
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-4 text-accesible-base min-h-touch',
    lg: 'px-8 py-5 text-accesible-lg min-h-touch-lg',
};

/**
 * Botón accesible con múltiples variantes
 * Cumple con requisitos de accesibilidad para usuarios mayores
 */
const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    children,
    className = '',
    ...props
}) => {
    return (
        <button
            disabled={disabled || isLoading}
            className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl
        transition-all duration-smooth
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {isLoading ? (
                <>
                    <span
                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                    />
                    <span>Procesando...</span>
                </>
            ) : (
                <>
                    {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
