/**
 * SaludConecta VE - Componente Navbar
 * Barra de navegación superior con nombre de usuario activo
 * Representa: Interfaz Post-Login (mostrar usuario activo para realismo)
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

interface NavbarProps {
    /** Muestra el botón de cerrar sesión */
    showLogout?: boolean;
    /** Callback cuando se navega al home */
    onHomeClick?: () => void;
    /** Callback cuando se cierra sesión */
    onLogout?: () => void;
}

/**
 * Barra de navegación principal
 * Incluye logo, nombre de usuario y opciones de navegación
 */
const Navbar: React.FC<NavbarProps> = ({
    showLogout = true,
    onHomeClick,
    onLogout
}) => {
    const { user, logout, isAuthenticated } = useAuth();

    const handleLogout = () => {
        logout();
        onLogout?.();
    };

    return (
        <nav
            className="bg-white shadow-md sticky top-0 z-50"
            role="navigation"
            aria-label="Navegación principal"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo y nombre */}
                    <button
                        onClick={onHomeClick}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        aria-label="Ir a inicio"
                    >
                        <Logo size="sm" className="text-salud-primario" />
                        <div className="hidden sm:block">
                            <h1 className="text-lg sm:text-xl font-bold text-salud-primario">
                                SaludConecta
                            </h1>
                            <p className="text-xs text-gray-500">San Juan de los Morros</p>
                        </div>
                    </button>

                    {/* Usuario activo y acciones */}
                    {isAuthenticated && user && (
                        <div className="flex items-center gap-4">
                            {/* Nombre del usuario */}
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Bienvenido/a</p>
                                <p className="font-semibold text-salud-primario">
                                    {user.nombre}
                                </p>
                            </div>

                            {/* Avatar con inicial */}
                            <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-salud-primario-claro 
                           flex items-center justify-center text-salud-primario font-bold text-lg"
                                aria-hidden="true"
                            >
                                {user.nombre.charAt(0)}
                            </div>

                            {/* Botón de cerrar sesión */}
                            {showLogout && (
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-red-500 
                             hover:bg-red-50 rounded-lg transition-colors"
                                    aria-label="Cerrar sesión"
                                >
                                    Salir
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
