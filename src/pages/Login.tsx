/**
 * SaludConecta VE - Pantalla de Login
 * Representa: Módulo de Acceso (Modo Demo)
 * 
 * Pantalla de bienvenida minimalista con accesos rápidos
 * para los escenarios de prueba (María y Pablo)
 */

import React from 'react';
import Logo from '../components/Logo';
import { Button } from '../components/ui';
import { AcademicIcon, UserIcon, DocumentIcon } from '../components/icons';

interface LoginPageProps {
    /** Callback al simular login de María */
    onLoginMaria: () => void;
    /** Callback al simular login de Pablo */
    onLoginPablo: () => void;
}

/**
 * Pantalla de Login con acceso demo
 * Incluye dos botones prominentes para los escenarios de prueba
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginMaria, onLoginPablo }) => {
    return (
        <div className="min-h-screen bg-salud-fondo flex flex-col">
            {/* Header con degradado */}
            <div className="bg-gradient-to-br from-sky-50 to-salud-primario-claro py-8 sm:py-12">
                <div className="max-w-md mx-auto px-4 text-center">
                    {/* Logo grande */}
                    <div className="flex justify-center mb-6">
                        <Logo size="xl" className="text-salud-primario" />
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-salud-primario mb-2">
                        SaludConecta VE
                    </h1>
                    <p className="text-lg text-gray-600">
                        Gestión de Citas Médicas
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        San Juan de los Morros, Estado Guárico
                    </p>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Tarjeta de acceso demo */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 animate-fade-in">
                        <div className="text-center mb-8">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                                <AcademicIcon size="lg" className="text-salud-accion" /> Modo Demostración
                            </h2>
                            <p className="text-gray-600">
                                Seleccione un perfil de prueba para explorar el sistema
                            </p>
                        </div>

                        {/* Botones de acceso rápido */}
                        <div className="space-y-4">
                            {/* Botón María - Caso de Éxito */}
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={onLoginMaria}
                                leftIcon={<UserIcon size="lg" />}
                            >
                                <div className="text-left flex-1 ml-2">
                                    <span className="block font-bold">Simular Paciente: María</span>
                                    <span className="block text-sm opacity-80">
                                        Caso de cita exitosa
                                    </span>
                                </div>
                            </Button>

                            {/* Botón Pablo - Caso de Rechazo */}
                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                                onClick={onLoginPablo}
                                leftIcon={<UserIcon size="lg" />}
                            >
                                <div className="text-left flex-1 ml-2">
                                    <span className="block font-bold">Simular Paciente: Pablo</span>
                                    <span className="block text-sm opacity-80">
                                        Caso de centro colapsado
                                    </span>
                                </div>
                            </Button>
                        </div>

                        {/* Nota informativa */}
                        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <p className="text-sm text-amber-800 flex items-start gap-2">
                                <DocumentIcon size="sm" className="flex-shrink-0 mt-0.5" />
                                <span>
                                    <strong>Nota académica:</strong> Este mockup simula un sistema
                                    de citas médicas. Los datos y funcionalidades son demostrativos
                                    para la presentación ante la UNERG.
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Proyecto Universitario • UNERG 2026-1
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
