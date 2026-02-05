/**
 * SaludConecta VE - Pantalla Home (Dashboard)
 * Representa: Interfaz Post-Login
 * 
 * Dashboard principal con accesos rápidos a todas las funcionalidades:
 * - UC1: Buscar Especialista
 * - UC3: Agendar Cita
 * - UC5: Ver mis Citas
 * - UC6: Contacto
 */

import React from 'react';
import { Navbar } from '../components/layout';
import { Card } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

type Page = 'home' | 'search' | 'booking' | 'appointments' | 'contact';

interface HomePageProps {
    /** Callback para navegar a otra página */
    onNavigate: (page: Page) => void;
    /** Callback al cerrar sesión */
    onLogout: () => void;
}

// Opciones del menú principal
const menuOptions = [
    {
        id: 'search' as Page,
        title: 'Buscar Especialista',
        description: 'Encuentra médicos por centro y especialidad',
        icon: '🔍',
        color: 'from-sky-400 to-sky-600',
        uc: 'UC1',
    },
    {
        id: 'booking' as Page,
        title: 'Agendar Cita',
        description: 'Solicita una nueva cita médica',
        icon: '📅',
        color: 'from-emerald-400 to-emerald-600',
        uc: 'UC3',
    },
    {
        id: 'appointments' as Page,
        title: 'Mis Citas',
        description: 'Revisa el estado de tus citas',
        icon: '📋',
        color: 'from-violet-400 to-violet-600',
        uc: 'UC5',
    },
    {
        id: 'contact' as Page,
        title: 'Contacto',
        description: 'Comunícate con los centros de salud',
        icon: '💬',
        color: 'from-amber-400 to-amber-600',
        uc: 'UC6',
    },
];

/**
 * Pantalla principal post-login
 * Muestra menú de accesos rápidos a las funcionalidades
 */
const HomePage: React.FC<HomePageProps> = ({ onNavigate, onLogout }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-salud-fondo">
            <Navbar
                onHomeClick={() => onNavigate('home')}
                onLogout={onLogout}
            />

            <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
                {/* Saludo personalizado */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                        ¡Hola, {user?.nombre.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-600 text-lg">
                        ¿Qué deseas hacer hoy?
                    </p>
                </div>

                {/* Grid de opciones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {menuOptions.map((option, index) => (
                        <Card
                            key={option.id}
                            hoverable
                            padding="none"
                            onClick={() => onNavigate(option.id)}
                            className="overflow-hidden animate-fade-in cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Header con gradiente */}
                            <div className={`bg-gradient-to-r ${option.color} p-4 sm:p-6`}>
                                <span className="text-4xl sm:text-5xl">{option.icon}</span>
                            </div>

                            {/* Contenido */}
                            <div className="p-4 sm:p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                                            {option.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm sm:text-base">
                                            {option.description}
                                        </p>
                                    </div>
                                    {/* Badge UC */}
                                    <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                        {option.uc}
                                    </span>
                                </div>

                                {/* Indicador de acción */}
                                <div className="flex items-center justify-end mt-4 text-salud-primario">
                                    <span className="text-sm font-medium">Acceder</span>
                                    <svg
                                        className="w-5 h-5 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Información del usuario demo */}
                {user && (
                    <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200 animate-fade-in">
                        <p className="text-sm text-gray-500 mb-2">
                            📌 <strong>Perfil de prueba activo:</strong>
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                👤 {user.nombre}
                            </span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                🪪 {user.cedula}
                            </span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full">
                                📱 {user.telefono}
                            </span>
                            <span className={`px-3 py-1 rounded-full ${user.tipo === 'maria'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                {user.tipo === 'maria' ? '✅ Caso Éxito' : '⚠️ Caso Rechazo'}
                            </span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
