import React, { useState } from 'react';
import Logo from '../components/Logo';
import { Button } from '../components/ui';
import {
    AcademicIcon,
    UserIcon,
    DoctorIcon,
    IdCardIcon,
    ConfirmedIcon,
    RejectedIcon
} from '../components/icons';

interface LoginPageProps {
    onLogin: (userId: string) => void;
}

const DEMO_CREDENTIALS = [
    { label: 'Paciente (Éxito)', cedula: 'V-12.345.678', userId: 'user-maria' },
    { label: 'Paciente (Rechazo)', cedula: 'V-23.456.789', userId: 'user-pablo' },
    { label: 'Administrador', cedula: 'V-9.876.543', userId: 'user-admin' },
    { label: 'Médico Dra. Elena', cedula: 'V-11.222.333', userId: 'user-doctor1' },
    { label: 'Médico Dr. Ricardo', cedula: 'V-10.444.555', userId: 'user-doctor2' }
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [cedulaInput, setCedulaInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [showQuickAccess, setShowQuickAccess] = useState(false);

    const handleCredentialsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!cedulaInput.trim()) {
            setFormError('Por favor ingrese su Cédula de Identidad o usuario.');
            return;
        }

        const found = DEMO_CREDENTIALS.find(
            cred => cred.cedula.toLowerCase() === cedulaInput.trim().toLowerCase() ||
                cred.userId.toLowerCase() === cedulaInput.trim().toLowerCase()
        );

        if (found) {
            onLogin(found.userId);
        } else {
            setFormError('Credenciales no reconocidas. Verifique su cédula e intente nuevamente.');
        }
    };

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-salud-primario-claro/30 flex flex-col font-sans">
        {/* Header institucional */}
        <header className="w-full bg-white/70 backdrop-blur-md border-b border-gray-100 py-4 sm:py-5 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Logo size="md" className="text-salud-primario" />
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-salud-primario leading-tight">
                            SaludConecta VE
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-salud-primario-claro px-4 py-1.5 rounded-full border border-sky-200">
                    <AcademicIcon size="sm" className="text-salud-primario" />
                    <span className="text-xs font-semibold text-salud-primario">
                        UNERG · AIS · 2026
                    </span>
                </div>
            </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 my-4">
            <div className="w-full max-w-4xl">
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white overflow-hidden animate-fade-in flex flex-col md:flex-row">

                    {/* Panel lateral */}
                    <div className="md:w-5/12 bg-gradient-to-br from-salud-primario to-indigo-700 p-8 sm:p-10 text-white flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold font-display mb-4 leading-tight">
                                Sistema de Gestión de Salud Pública
                            </h2>
                            <p className="text-white/75 text-sm leading-relaxed mb-8">
                                Plataforma integrada para la coordinación de citas médicas, telemedicina y administración de centros de salud en el Estado Guárico.
                            </p>

                            <div className="space-y-3">
                                {[
                                    { icon: <UserIcon size="sm" />, text: 'Solicitud y seguimiento de citas' },
                                    { icon: <DoctorIcon size="sm" />, text: 'Gestión de agenda médica' },
                                    { icon: <AcademicIcon size="sm" />, text: 'Supervisión administrativa' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-white/80 text-sm">
                                        <span className="text-white/50">{item.icon}</span>
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="text-xs text-white/40 mt-8">
                            Universidad Nacional Experimental Rómulo Gallegos<br />
                            Área de Ingeniería en Sistemas
                        </div>
                    </div>

                    {/* Panel de login */}
                    <div className="md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                        <div>
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Iniciar Sesión
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Ingrese su cédula de identidad y contraseña para acceder.
                                </p>
                            </div>

                            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                                {formError && (
                                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-sm">
                                        <span className="flex-shrink-0 mt-0.5">⚠</span>
                                        <span>{formError}</span>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <IdCardIcon size="sm" /> Cédula de Identidad
                                        </label>
                                        <input
                                            type="text"
                                            value={cedulaInput}
                                            onChange={(e) => setCedulaInput(e.target.value)}
                                            placeholder="Ej: V-12.345.678"
                                            autoComplete="username"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-salud-primario/30 focus:border-salud-primario transition-all text-sm font-medium text-gray-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            placeholder="••••••••"
                                            autoComplete="current-password"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-salud-primario/30 focus:border-salud-primario transition-all text-sm font-medium text-gray-800"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    className="mt-6 font-bold py-3 text-sm"
                                >
                                    Entrar al Sistema
                                </Button>
                            </form>

                            {/* Acceso de demostración colapsado */}
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowQuickAccess(v => !v)}
                                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-salud-primario transition-colors font-medium mx-auto"
                                >
                                    <span>{showQuickAccess ? '▲' : '▼'}</span>
                                    Acceso de demostración
                                </button>

                                {showQuickAccess && (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in space-y-4">
                                        {/* Pacientes */}
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <UserIcon size="sm" /> Pacientes
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onLogin('user-maria')}
                                                    className="group p-3 bg-white hover:bg-sky-50 border border-slate-100 hover:border-sky-200 rounded-xl text-left transition-all flex items-start gap-2.5 shadow-sm"
                                                >
                                                    <ConfirmedIcon className="text-salud-exito mt-0.5 flex-shrink-0" size="sm" />
                                                    <div>
                                                        <span className="block font-semibold text-xs text-gray-800">María Fernández</span>
                                                        <span className="block text-[10px] text-gray-400">Cita disponible</span>
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onLogin('user-pablo')}
                                                    className="group p-3 bg-white hover:bg-amber-50 border border-slate-100 hover:border-amber-200 rounded-xl text-left transition-all flex items-start gap-2.5 shadow-sm"
                                                >
                                                    <RejectedIcon className="text-salud-error mt-0.5 flex-shrink-0" size="sm" />
                                                    <div>
                                                        <span className="block font-semibold text-xs text-gray-800">Pablo Hernández</span>
                                                        <span className="block text-[10px] text-gray-400">Sin disponibilidad</span>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Médicos */}
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <DoctorIcon size="sm" /> Médicos
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {[
                                                    { id: 'user-doctor1', name: 'Dra. Elena Rodríguez', spec: 'Pediatría' },
                                                    { id: 'user-doctor2', name: 'Dr. Ricardo Tovar', spec: 'Medicina Interna' },
                                                ].map(doc => (
                                                    <button
                                                        key={doc.id}
                                                        type="button"
                                                        onClick={() => onLogin(doc.id)}
                                                        className="p-3 bg-white hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 rounded-xl text-left transition-all flex items-center gap-2.5 shadow-sm"
                                                    >
                                                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold flex-shrink-0">
                                                            DR
                                                        </div>
                                                        <div>
                                                            <span className="block font-semibold text-xs text-gray-800">{doc.name}</span>
                                                            <span className="block text-[10px] text-gray-400">{doc.spec}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Administrador */}
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                Administrador
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => onLogin('user-admin')}
                                                className="w-full p-3 bg-white hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 rounded-xl text-left transition-all flex items-center gap-2.5 shadow-sm"
                                            >
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-bold flex-shrink-0">
                                                    ADM
                                                </div>
                                                <div>
                                                    <span className="block font-semibold text-xs text-gray-800">Dr. Francisco Valera</span>
                                                    <span className="block text-[10px] text-gray-400">Administrador del Sistema</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>

        <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-100 bg-white/30">
            &copy; 2026 SaludConecta VE — Sistema de Gestión de Consultas Sanitarias
        </footer>
    </div>
);
};

export default LoginPage;
