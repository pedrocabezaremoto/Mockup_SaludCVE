/**
 * SaludConecta VE - Aplicación Principal
 * 
 * Router principal que maneja la navegación entre páginas
 * usando estados de React (useState) para simular el SPA
 * sin necesidad de bibliotecas de enrutamiento externas.
 * 
 * Proyecto académico para la UNERG - San Juan de los Morros, Guárico
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import { Doctor } from './types';

// Páginas
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import SearchPage from './pages/Search';
import DoctorProfilePage from './pages/DoctorProfile';
import BookingWizardPage from './pages/BookingWizard';
import MyAppointmentsPage from './pages/MyAppointments';
import ContactPage from './pages/Contact';
import MyInfoPage from './pages/MyInfo';

/** Tipos de página disponibles en la aplicación */
type Page = 'login' | 'home' | 'search' | 'doctor-profile' | 'booking' | 'appointments' | 'contact' | 'my-info';

/**
 * Componente interno que maneja la navegación
 * Debe estar dentro del AuthProvider para acceder al contexto
 */
const AppContent: React.FC = () => {
    const { isAuthenticated, login, logout } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('login');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    // Manejar login de usuario demo
    const handleLogin = (userId: string) => {
        login(userId);
        setCurrentPage('home');
    };

    // Manejar logout
    const handleLogout = () => {
        logout();
        setCurrentPage('login');
        setSelectedDoctor(null);
    };

    // Manejar navegación entre páginas
    const handleNavigate = (page: Page | 'home' | 'search' | 'booking' | 'appointments' | 'contact') => {
        // Mapear las páginas simplificadas
        if (page === 'home' || page === 'search' || page === 'booking' || page === 'appointments' || page === 'contact') {
            setCurrentPage(page as Page);
        } else {
            setCurrentPage(page);
        }
    };

    // Manejar selección de doctor
    const handleSelectDoctor = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setCurrentPage('doctor-profile');
    };

    // Manejar inicio de agendamiento desde perfil del doctor
    const handleBookAppointment = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setCurrentPage('booking');
    };

    // Renderizar página actual
    const renderCurrentPage = () => {
        // Si no está autenticado, mostrar login
        if (!isAuthenticated && currentPage !== 'login') {
            return (
                <LoginPage
                    onLoginMaria={() => handleLogin('user-maria')}
                    onLoginPablo={() => handleLogin('user-pablo')}
                />
            );
        }

        switch (currentPage) {
            case 'login':
                return (
                    <LoginPage
                        onLoginMaria={() => handleLogin('user-maria')}
                        onLoginPablo={() => handleLogin('user-pablo')}
                    />
                );

            case 'home':
                return (
                    <HomePage
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                );

            case 'search':
                return (
                    <SearchPage
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                        onSelectDoctor={handleSelectDoctor}
                    />
                );

            case 'doctor-profile':
                return selectedDoctor ? (
                    <DoctorProfilePage
                        doctor={selectedDoctor}
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                        onBookAppointment={handleBookAppointment}
                    />
                ) : (
                    <SearchPage
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                        onSelectDoctor={handleSelectDoctor}
                    />
                );

            case 'booking':
                return (
                    <BookingWizardPage
                        doctor={selectedDoctor}
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                        onComplete={() => setCurrentPage('appointments')}
                    />
                );

            case 'appointments':
                return (
                    <MyAppointmentsPage
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                );

            case 'contact':
                return (
                    <ContactPage
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                );

            case 'my-info':
                return (
                    <MyInfoPage
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                );

            default:
                return (
                    <HomePage
                        onNavigate={handleNavigate}
                        onLogout={handleLogout}
                    />
                );
        }
    };

    return (
        <div className="antialiased">
            {renderCurrentPage()}
        </div>
    );
};

/**
 * Componente raíz de la aplicación
 * Provee los contextos globales (Auth y Appointments)
 */
const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppointmentProvider>
                <AppContent />
            </AppointmentProvider>
        </AuthProvider>
    );
};

export default App;
