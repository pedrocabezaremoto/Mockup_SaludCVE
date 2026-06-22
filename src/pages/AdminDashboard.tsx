/**
 * SaludConecta VE - Panel de Administración General
 * Representa: Consola del Administrador de Salud Pública (UNERG)
 * 
 * Permite monitorear estadísticas globales, gestionar el estado de 
 * colapso de clínicas/centros en tiempo real, y auditar todas las citas.
 */

import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout';
import { Card, Spinner } from '../components/ui';
import { useAppointments } from '../contexts/AppointmentContext';
import { useCatalog } from '../contexts/CatalogContext';
import { toggleHealthCenterCollapse as toggleHealthCenterCollapseApi } from '../services/api';
import { AppointmentStatus } from '../types';
import { 
    ClipboardIcon,
    ConfirmedIcon,
    PendingIcon,
    RejectedIcon,
    CompletedIcon,
    CancelledIcon,
    HospitalIcon,
    DoctorIcon,
    WarningIcon
} from '../components/icons';

interface AdminDashboardProps {
    /** Callback para navegar a otras páginas */
    onNavigate: (page: any) => void;
    /** Callback al cerrar sesión */
    onLogout: () => void;
}

const statusConfig = {
    [AppointmentStatus.RESERVADA]: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <ConfirmedIcon size="sm" />,
    },
    [AppointmentStatus.PENDIENTE]: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <PendingIcon size="sm" />,
    },
    [AppointmentStatus.RECHAZADA]: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <RejectedIcon size="sm" />,
    },
    [AppointmentStatus.COMPLETADA]: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CompletedIcon size="sm" />,
    },
    [AppointmentStatus.CANCELADA]: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <CancelledIcon size="sm" />,
    },
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const { appointments, refreshAppointments, isLoading } = useAppointments();
    const { healthCenters, doctors, refresh: refreshCatalog, getDoctorById, getSpecialtyById, getHealthCenterById } = useCatalog();
    
    const [actioningCenterId, setActioningCenterId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'centers' | 'appointments'>('centers');

    // Sincronizar todos los datos al montar la página
    useEffect(() => {
        void refreshAppointments();
        void refreshCatalog();
    }, []);

    // Alternar colapso de un centro de salud
    const handleToggleCollapse = async (centerId: string) => {
        setActioningCenterId(centerId);
        try {
            await toggleHealthCenterCollapseApi(centerId);
            // Refrescar catálogo para actualizar el estado del centro en el frontend
            await refreshCatalog();
        } catch (error) {
            console.error('Error al cambiar el estado del centro:', error);
        } finally {
            setActioningCenterId(null);
        }
    };

    // Mapeos rápidos para audit de pacientes
    const getPatientName = (userId: string) => {
        if (userId === 'user-maria') return 'María Fernández';
        if (userId === 'user-pablo') return 'Pablo Hernández';
        return 'Paciente';
    };

    const getPatientCedula = (userId: string) => {
        if (userId === 'user-maria') return 'V-12.345.678';
        if (userId === 'user-pablo') return 'V-23.456.789';
        return 'V-99.999.999';
    };

    // Calcular estadísticas globales
    const stats = {
        totalAppointments: appointments.length,
        approved: appointments.filter(a => a.estado === AppointmentStatus.RESERVADA).length,
        completed: appointments.filter(a => a.estado === AppointmentStatus.COMPLETADA).length,
        rejected: appointments.filter(a => a.estado === AppointmentStatus.RECHAZADA).length,
        cancelled: appointments.filter(a => a.estado === AppointmentStatus.CANCELADA).length,
        collapsedCenters: healthCenters.filter(c => c.colapsado).length,
        activeDoctors: doctors.length,
    };

    return (
        <div className="min-h-screen bg-salud-fondo font-sans">
            <Navbar showLogout={true} onLogout={onLogout} />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Dashboard Admin */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <span className="bg-white/10 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-white/10 text-sky-400">
                            Consola del Administrador
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold font-display mt-2">
                            Dr. Francisco Valera
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Ministerio de Salud Pública y Tecnología UNERG
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={async () => {
                                void refreshAppointments();
                                void refreshCatalog();
                            }}
                            className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-sm px-4 py-2 rounded-2xl transition-colors"
                        >
                            Sincronizar Todo
                        </button>
                    </div>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    <Card className="!p-4 sm:!p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Citas Totales</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-gray-800 mt-2">{stats.totalAppointments}</h3>
                        <span className="text-[10px] text-gray-400 mt-1">Registradas en el sistema</span>
                    </Card>

                    <Card className="!p-4 sm:!p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-salud-exito uppercase tracking-wider">Aprobadas</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-salud-exito mt-2">{stats.approved}</h3>
                        <span className="text-[10px] text-gray-400 mt-1">Citas agendadas activas</span>
                    </Card>

                    <Card className="!p-4 sm:!p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-salud-error uppercase tracking-wider">Rechazadas</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-salud-error mt-2">{stats.rejected}</h3>
                        <span className="text-[10px] text-gray-400 mt-1">Por saturación de centros</span>
                    </Card>

                    <Card className="!p-4 sm:!p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Hospitales Colapsados</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-amber-500 mt-2">
                            {stats.collapsedCenters} <span className="text-sm font-normal text-gray-400">/ {healthCenters.length}</span>
                        </h3>
                        <span className="text-[10px] text-gray-400 mt-1">Requieren descongestión</span>
                    </Card>
                </div>

                {/* Contenedor principal del Dashboard */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                    {/* Tabs del Administrador */}
                    <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-2">
                        <button
                            onClick={() => setActiveTab('centers')}
                            className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                activeTab === 'centers'
                                    ? 'bg-white text-salud-primario shadow-sm font-bold'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <HospitalIcon size="sm" /> 1. Gestión de Centros de Salud ({healthCenters.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center gap-2 ${
                                activeTab === 'appointments'
                                    ? 'bg-white text-salud-primario shadow-sm font-bold'
                                    : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            <ClipboardIcon size="sm" /> 2. Auditoría General de Citas ({appointments.length})
                        </button>
                    </div>

                    {/* Tab 1: Gestión de Centros (Mitigación del Colapso Hospitalario) */}
                    {activeTab === 'centers' && (
                        <div className="p-6 space-y-6">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800 text-sm flex gap-3">
                                <WarningIcon className="mt-0.5 flex-shrink-0" size="md" />
                                <div>
                                    <strong className="block font-bold">Simulador de colapso en tiempo real:</strong>
                                    <span>
                                        Al activar el botón <strong>"Colapsado (Sí)"</strong>, el centro médico bloqueará de inmediato cualquier solicitud de nueva cita, simulando el rechazo dinámico para descongestión. Desactiva el colapso para permitir que los pacientes agenden exitosamente de inmediato.
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {healthCenters.map((center) => {
                                    const isActioning = actioningCenterId === center.id;
                                    return (
                                        <div
                                            key={center.id}
                                            className={`p-5 rounded-2xl border transition-all duration-smooth flex flex-col justify-between gap-4 ${
                                                center.colapsado
                                                    ? 'border-amber-200 bg-amber-50/20 shadow-sm'
                                                    : 'border-slate-100 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                                                        center.colapsado ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                                                    }`}>
                                                        🏥
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                                                            {center.nombre}
                                                        </h3>
                                                        <span className="block text-xs text-gray-400 font-medium leading-normal mt-0.5">
                                                            {center.direccion}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                                                <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                                                    Estado: {center.colapsado ? (
                                                        <span className="text-amber-600 font-black flex items-center gap-1">🔴 COLAPSADO</span>
                                                    ) : (
                                                        <span className="text-green-600 font-black flex items-center gap-1">🟢 DISPONIBLE</span>
                                                    )}
                                                </span>

                                                {isActioning ? (
                                                    <div className="text-xs text-gray-500 flex items-center gap-1.5 font-semibold">
                                                        <Spinner size="sm" /> Guardando...
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleToggleCollapse(center.id)}
                                                        className={`text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm ${
                                                            center.colapsado
                                                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                                                        }`}
                                                    >
                                                        {center.colapsado ? 'Desbloquear Centro' : 'Forzar Colapso'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Auditoría General de Citas */}
                    {activeTab === 'appointments' && (
                        <div className="p-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Spinner size="lg" />
                                    <span className="text-sm text-gray-500 mt-4">Cargando bitácora general de citas...</span>
                                </div>
                            ) : appointments.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                <th className="py-4 px-4">Paciente</th>
                                                <th className="py-4 px-4">Especialista</th>
                                                <th className="py-4 px-4">Centro Médico</th>
                                                <th className="py-4 px-4 text-center">Fecha y Turno</th>
                                                <th className="py-4 px-4 text-right">Estado del Sistema</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 text-sm">
                                            {appointments.map((appointment) => {
                                                const doctor = getDoctorById(appointment.doctorId);
                                                const center = getHealthCenterById(appointment.centroId);
                                                const specialty = getSpecialtyById(appointment.especialidadId);
                                                const config = statusConfig[appointment.estado];

                                                return (
                                                    <tr key={appointment.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-4 px-4">
                                                            <strong className="block text-gray-800">{getPatientName(appointment.usuarioId)}</strong>
                                                            <span className="text-xs text-gray-400 font-medium">{getPatientCedula(appointment.usuarioId)}</span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-1">
                                                                <DoctorIcon size="sm" className="text-slate-400" />
                                                                <span className="font-semibold text-gray-700">{doctor?.nombre}</span>
                                                            </div>
                                                            <span className="text-xs text-salud-primario font-medium ml-5">{specialty?.nombre}</span>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="font-medium text-gray-700">{center?.nombre}</span>
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <span className="block font-semibold text-gray-700">{appointment.fecha}</span>
                                                            <span className="text-xs text-gray-400 font-medium">{appointment.turno}</span>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <div className="flex flex-col items-end gap-1">
                                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.color} flex items-center gap-1`}>
                                                                    {config.icon} {appointment.estado}
                                                                </span>
                                                                {appointment.motivoRechazo && (
                                                                    <span className="text-[10px] text-red-600 max-w-[200px] text-right truncate" title={appointment.motivoRechazo}>
                                                                        {appointment.motivoRechazo}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-20 border border-dashed border-gray-100 rounded-3xl">
                                    <ClipboardIcon size="xl" className="mx-auto mb-4 text-gray-300" />
                                    <h4 className="font-bold text-gray-700">Sin historial de citas</h4>
                                    <p className="text-sm text-gray-500 mt-1">Aún no se han agendado citas en el sistema experimental.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
