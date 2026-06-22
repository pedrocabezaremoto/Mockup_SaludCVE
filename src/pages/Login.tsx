/**
 * SaludConecta VE - Pantalla de Acceso Multiusuario
 * Representa: Módulo de Acceso Académico UNERG
 * 
 * Permite simular el inicio de sesión para tres tipos de usuarios:
 * - Administradores (Admin)
 * - Médicos (Doctor)
 * - Pacientes (Paciente)
 */

import React, { useState } from 'react';
import Logo from '../components/Logo';
import { Button } from '../components/ui';
import { 
    AcademicIcon, 
    UserIcon, 
    DoctorIcon, 
    IdCardIcon, 
    InfoIcon,
    ConfirmedIcon,
    RejectedIcon
} from '../components/icons';

interface LoginPageProps {
    /** Callback para manejar el inicio de sesión pasándole el userId */
    onLogin: (userId: string) => void;
}

/**
 * Mapeo de credenciales de demostración para validaciones en el formulario tradicional
 */
const DEMO_CREDENTIALS = [
    { label: 'Paciente (Éxito)', cedula: 'V-12.345.678', userId: 'user-maria' },
    { label: 'Paciente (Rechazo)', cedula: 'V-23.456.789', userId: 'user-pablo' },
    { label: 'Administrador', cedula: 'V-9.876.543', userId: 'user-admin' },
    { label: 'Médico Dra. Elena', cedula: 'V-11.222.333', userId: 'user-doctor1' },
    { label: 'Médico Dr. Ricardo', cedula: 'V-10.444.555', userId: 'user-doctor2' }
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<'demo' | 'credentials'>('demo');
    const [cedulaInput, setCedulaInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    // Manejar envío del formulario tradicional
    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!cedulaInput.trim()) {
            setFormError('Por favor ingrese su Cédula o ID de Usuario.');
            return;
        }

        // Buscar coincidencia en credenciales simuladas
        const found = DEMO_CREDENTIALS.find(
            cred => cred.cedula.toLowerCase() === cedulaInput.trim().toLowerCase() ||
                    cred.userId.toLowerCase() === cedulaInput.trim().toLowerCase()
        );

        if (found) {
            onLogin(found.userId);
        } else {
            setFormError('Usuario no registrado para esta demostración. Intente con una cédula válida o use la pestaña "Acceso Rápido".');
        }
    };

    // Auto-completar cédula en el formulario
    const fillCredential = (cedula: string) => {
        setCedulaInput(cedula);
        setPasswordInput('••••••••');
        setActiveTab('credentials');
        setFormError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-salud-primario-claro/30 flex flex-col font-sans">
            {/* Header con identidad visual académica */}
            <header className="w-full bg-white/70 backdrop-blur-md border-b border-gray-100 py-4 sm:py-6 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Logo size="md" className="text-salud-primario" />
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-salud-primario leading-tight">
                                SaludConecta VE
                            </h1>
                            <p className="text-xs text-gray-500 font-medium">
                                San Juan de los Morros, Estado Guárico
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-salud-primario-claro px-4 py-1.5 rounded-full border border-sky-200">
                        <AcademicIcon size="sm" className="text-salud-primario" />
                        <span className="text-xs font-semibold text-salud-primario">
                            Área de Salud UNERG • Cohorte 2026
                        </span>
                    </div>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 my-4">
                <div className="w-full max-w-4xl">
                    {/* Contenedor con efecto de cristal y sombras premium */}
                    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white overflow-hidden animate-fade-in flex flex-col md:flex-row">
                        
                        {/* Panel lateral informativo (Estética UNERG) */}
                        <div className="md:w-5/12 bg-gradient-to-br from-salud-primario to-indigo-700 p-8 sm:p-10 text-white flex flex-col justify-between">
                            <div>
                                <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                                    Mockup Interactivo
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold font-display mt-6 mb-4 leading-tight">
                                    Telemedicina y Citas Médicas
                                </h2>
                                <p className="text-white/80 text-sm leading-relaxed mb-6">
                                    Plataforma unificada para optimizar la atención de salud pública. Diseñado para mitigar el colapso hospitalario y mejorar la experiencia médica en el Estado Guárico.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 bg-white/10 p-3 rounded-2xl border border-white/5">
                                    <InfoIcon size="md" className="mt-0.5 text-salud-accion" />
                                    <p className="text-xs text-white/90 leading-normal">
                                        <strong>Roles Diferenciados:</strong> Explora cómo interactúan Pacientes, Médicos de guardia y los Administradores de salud.
                                    </p>
                                </div>
                                <div className="text-center md:text-left text-xs text-white/50">
                                    UNERG - Dirección de Tecnología Médica
                                </div>
                            </div>
                        </div>

                        {/* Panel de Login Principal */}
                        <div className="md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                            <div>
                                {/* Selector de pestañas */}
                                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
                                    <button
                                        onClick={() => { setActiveTab('demo'); setFormError(null); }}
                                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-smooth ${
                                            activeTab === 'demo'
                                                ? 'bg-white text-salud-primario shadow-sm'
                                                : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        Acceso Rápido (Demo)
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('credentials')}
                                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-smooth ${
                                            activeTab === 'credentials'
                                                ? 'bg-white text-salud-primario shadow-sm'
                                                : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        Formulario de Acceso
                                    </button>
                                </div>

                                {/* Pestaña 1: Acceso Rápido Demo (La mejor experiencia para mostrar) */}
                                {activeTab === 'demo' && (
                                    <div className="space-y-6">
                                        <div className="text-center sm:text-left">
                                            <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center sm:justify-start gap-2">
                                                Seleccione un Rol de Demostración
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Accede directamente con configuraciones de prueba preestablecidas.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {/* SECCIÓN PACIENTES */}
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <UserIcon size="sm" /> 1. Pacientes (Ciudadanos)
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => onLogin('user-maria')}
                                                        className="group p-4 bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-200 rounded-2xl text-left transition-all duration-smooth flex items-start gap-3 shadow-sm hover:shadow-md"
                                                    >
                                                        <ConfirmedIcon className="text-salud-exito mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size="md" />
                                                        <div>
                                                            <span className="block font-bold text-sm text-gray-800">María Fernández</span>
                                                            <span className="block text-xs text-salud-primario font-medium">Caso de Éxito</span>
                                                            <span className="block text-[10px] text-gray-400 mt-1">Cita aprobada de inmediato.</span>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => onLogin('user-pablo')}
                                                        className="group p-4 bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 rounded-2xl text-left transition-all duration-smooth flex items-start gap-3 shadow-sm hover:shadow-md"
                                                    >
                                                        <RejectedIcon className="text-salud-error mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size="md" />
                                                        <div>
                                                            <span className="block font-bold text-sm text-gray-800">Pablo Hernández</span>
                                                            <span className="block text-xs text-amber-600 font-medium">Caso de Colapso</span>
                                                            <span className="block text-[10px] text-gray-400 mt-1">Simula rechazo por saturación.</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* SECCIÓN MÉDICOS */}
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <DoctorIcon size="sm" /> 2. Médicos (Especialistas)
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <button
                                                        onClick={() => onLogin('user-doctor1')}
                                                        className="group p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-2xl text-left transition-all duration-smooth flex items-start gap-3 shadow-sm hover:shadow-md"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                                                            DR
                                                        </div>
                                                        <div>
                                                            <span className="block font-bold text-sm text-gray-800">Dra. Elena Rodríguez</span>
                                                            <span className="block text-xs text-emerald-600 font-medium">Pediatría - IVSS</span>
                                                            <span className="block text-[10px] text-gray-400 mt-1">Gestionar citas asignadas.</span>
                                                        </div>
                                                    </button>

                                                    <button
                                                        onClick={() => onLogin('user-doctor2')}
                                                        className="group p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-2xl text-left transition-all duration-smooth flex items-start gap-3 shadow-sm hover:shadow-md"
                                                    >
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                                                            DR
                                                        </div>
                                                        <div>
                                                            <span className="block font-bold text-sm text-gray-800">Dr. Ricardo Tovar</span>
                                                            <span className="block text-xs text-emerald-600 font-medium">Med. Interna - IVSS</span>
                                                            <span className="block text-[10px] text-gray-400 mt-1">Ver agenda y cambiar estados.</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* SECCIÓN ADMINISTRADOR */}
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    🛡️ 3. Administrador de Salud
                                                </h4>
                                                <button
                                                    onClick={() => onLogin('user-admin')}
                                                    className="w-full group p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-2xl text-left transition-all duration-smooth flex items-center gap-4 shadow-sm hover:shadow-md"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-base font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                                                        ADM
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="block font-bold text-sm text-gray-800">Dr. Francisco Valera</span>
                                                        <span className="block text-xs text-indigo-600 font-medium">Administrador del Sistema</span>
                                                        <span className="block text-[10px] text-gray-400 mt-0.5">Métricas globales, centros y colapsos.</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Pestaña 2: Formulario tradicional con soporte simulado */}
                                {activeTab === 'credentials' && (
                                    <form onSubmit={handleCredentialsSubmit} className="space-y-5 animate-fade-in">
                                        <div className="text-center sm:text-left mb-6">
                                            <h3 className="text-lg font-bold text-gray-800">
                                                Acceso mediante Credenciales
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Introduce tu Cédula de Identidad o ID de Demostración.
                                            </p>
                                        </div>

                                        {formError && (
                                            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs sm:text-sm animate-shake">
                                                <span className="font-bold flex-shrink-0">⚠️</span>
                                                <span>{formError}</span>
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            {/* Input Cédula */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                    <IdCardIcon size="sm" /> Cédula o Usuario
                                                </label>
                                                <input
                                                    type="text"
                                                    value={cedulaInput}
                                                    onChange={(e) => setCedulaInput(e.target.value)}
                                                    placeholder="Ej: V-12.345.678"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-salud-primario/30 focus:border-salud-primario transition-all text-sm font-medium text-gray-800"
                                                />
                                            </div>

                                            {/* Input Contraseña (Simulado) */}
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                    Contraseña (Cualquiera)
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordInput}
                                                    onChange={(e) => setPasswordInput(e.target.value)}
                                                    placeholder="••••••••"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-salud-primario/30 focus:border-salud-primario transition-all text-sm font-medium text-gray-800 animate-fade-in"
                                                />
                                            </div>
                                        </div>

                                        {/* Botón de Acceso */}
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            fullWidth
                                            className="mt-6 font-bold py-3 text-sm flex items-center justify-center gap-2"
                                        >
                                            Entrar al Sistema
                                        </Button>

                                        {/* Sugerencias de simulación rápida en el formulario */}
                                        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                Cédulas de Prueba Disponibles:
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {DEMO_CREDENTIALS.map((cred) => (
                                                    <button
                                                        key={cred.userId}
                                                        type="button"
                                                        onClick={() => fillCredential(cred.cedula)}
                                                        className="text-[10px] bg-white border border-slate-200 hover:border-salud-primario text-gray-600 hover:text-salud-primario px-2.5 py-1.5 rounded-lg transition-colors font-medium"
                                                    >
                                                        {cred.label}: {cred.cedula}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Nota de pie */}
                            <div className="mt-8 pt-4 border-t border-slate-100 text-[11px] text-gray-400 text-center leading-normal">
                                Universidad Rómulo Gallegos (UNERG) • Proyecto Académico 2026. Todos los datos ingresados se simulan de forma local en el navegador y el servidor experimental.
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-100 bg-white/30">
                &copy; 2026 SaludConecta VE - Sistema Experimental de Gestión de Consultas Sanitarias
            </footer>
        </div>
    );
};

export default LoginPage;
