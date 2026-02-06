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
import { 
    SearchIcon, 
    CalendarIcon, 
    ClipboardIcon, 
    ChatIcon,
    UserIcon,
    IdCardIcon,
    MobileIcon,
    ConfirmedIcon,
    WarningIcon,
    DocumentIcon
} from '../components/icons';

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
        icon: <SearchIcon size="xl" />,
        color: 'from-sky-400 to-sky-600',
    },
    {
        id: 'booking' as Page,
        title: 'Agendar Cita',
        description: 'Solicita una nueva cita médica',
        icon: <CalendarIcon size="xl" />,
        color: 'from-emerald-400 to-emerald-600',
    },
    {
        id: 'appointments' as Page,
        title: 'Mis Citas',
        description: 'Revisa el estado de tus citas',
        icon: <ClipboardIcon size="xl" />,
        color: 'from-violet-400 to-violet-600',
    },
    {
        id: 'contact' as Page,
        title: 'Contacto',
        description: 'Comunícate con los centros de salud',
        icon: <ChatIcon size="xl" />,
        color: 'from-amber-400 to-amber-600',
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                        ¡Hola, {user?.nombre.split(' ')[0]}!
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
                            <div className={`bg-gradient-to-r ${option.color} p-4 sm:p-6 text-white`}>
                                <div className="text-4xl sm:text-5xl">{option.icon}</div>
                            </div>

                            {/* Contenido */}
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                                    {option.title}
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    {option.description}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Información del usuario demo */}
                {user && (
                    <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200 animate-fade-in">
                        <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                            <DocumentIcon size="sm" /> <strong>Perfil de prueba activo:</strong>
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                <UserIcon size="sm" /> {user.nombre}
                            </span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                <IdCardIcon size="sm" /> {user.cedula}
                            </span>
                            <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
                                <MobileIcon size="sm" /> {user.telefono}
                            </span>
                            <span className={`px-3 py-1 rounded-full flex items-center gap-2 ${user.tipo === 'maria'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                {user.tipo === 'maria' ? <><ConfirmedIcon size="sm" /> Caso Éxito</> : <><WarningIcon size="sm" /> Caso Rechazo</>}
                            </span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
