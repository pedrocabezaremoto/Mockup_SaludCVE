/**
 * SaludConecta VE - Panel de Control del Médico
 * Representa: Gestión de Agenda Médica (Modo Demo)
 * 
 * Permite a los doctores de guardia ver su agenda de citas, 
 * filtrar pacientes y actualizar el estado de las consultas.
 */

import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/layout';
import { Card, Button, Spinner } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import { useCatalog } from '../contexts/CatalogContext';
import { AppointmentStatus, Shift } from '../types';
import { 
    DoctorIcon, 
    CalendarIcon, 
    MorningIcon, 
    AfternoonIcon, 
    ConfirmedIcon,
    PendingIcon, 
    RejectedIcon, 
    CompletedIcon, 
    CancelledIcon, 
    ClipboardIcon,
    InfoIcon
} from '../components/icons';

interface DoctorDashboardProps {
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

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout }) => {
    const { user } = useAuth();
    const { appointments, updateAppointmentStatus, refreshAppointments, isLoading } = useAppointments();
    const { getDoctorById, getHealthCenterById, getSpecialtyById } = useCatalog();
    const [statusFilter, setStatusFilter] = useState<string>('todos');
    const [actioningId, setActioningId] = useState<string | null>(null);

    // Obtener perfil del médico asignado al usuario
    const doctorProfile = user?.doctorId ? getDoctorById(user.doctorId) : null;
    const centerProfile = doctorProfile ? getHealthCenterById(doctorProfile.centroId) : null;
    const specialtyProfile = doctorProfile ? getSpecialtyById(doctorProfile.especialidadId) : null;

    // Sincronizar citas con la base de datos al montar la página
    useEffect(() => {
        void refreshAppointments();
    }, []);

    // Filtrar citas correspondientes a ESTE médico
    const myAppointments = appointments.filter(
        apt => apt.doctorId === user?.doctorId
    );

    // Aplicar filtro de estado
    const filteredAppointments = myAppointments.filter(apt => {
        if (statusFilter === 'todos') return true;
        return apt.estado === statusFilter;
    });

    // Mapeo local de datos de pacientes (simulación de registro de Cédulas y Nombres)
    const getPatientName = (userId: string) => {
        if (userId === 'user-maria') return 'María Fernández';
        if (userId === 'user-pablo') return 'Pablo Hernández';
        return 'Paciente Externo';
    };

    const getPatientCedula = (userId: string) => {
        if (userId === 'user-maria') return 'V-12.345.678';
        if (userId === 'user-pablo') return 'V-23.456.789';
        return 'V-99.999.999';
    };

    const getPatientPhone = (userId: string) => {
        if (userId === 'user-maria') return '+58 424-1234567';
        if (userId === 'user-pablo') return '+58 412-9876543';
        return '+58 412-0000000';
    };

    // Cambiar estado de una cita médica
    const handleStatusUpdate = async (appointmentId: string, newStatus: AppointmentStatus, reason?: string) => {
        setActioningId(appointmentId);
        try {
            await updateAppointmentStatus(appointmentId, newStatus, reason);
        } catch (error) {
            console.error('Error al actualizar el estado de la cita:', error);
        } finally {
            setActioningId(null);
        }
    };

    return (
        <div className="min-h-screen bg-salud-fondo font-sans">
            <Navbar showLogout={true} onLogout={onLogout} />

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Hero del Médico (Glassmorphism/Gradient) */}
                <div className="bg-gradient-to-r from-salud-primario to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-3xl">
                            🩺
                        </div>
                        <div>
                            <span className="bg-white/20 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                                Médico Especialista
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-bold font-display mt-2">
                                {doctorProfile?.nombre || 'Médico de Guardia'}
                            </h1>
                            <p className="text-white/80 text-sm sm:text-base font-medium mt-1">
                                {specialtyProfile?.nombre} • {centerProfile?.nombre}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-full md:w-auto grid grid-cols-2 gap-4">
                        <div className="text-center md:text-left">
                            <span className="block text-xs text-white/60 uppercase font-bold">Consultas Hoy</span>
                            <span className="text-2xl font-bold">{myAppointments.filter(a => a.estado === AppointmentStatus.RESERVADA).length}</span>
                        </div>
                        <div className="text-center md:text-left">
                            <span className="block text-xs text-white/60 uppercase font-bold">Atendidos</span>
                            <span className="text-2xl font-bold">{myAppointments.filter(a => a.estado === AppointmentStatus.COMPLETADA).length}</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Panel lateral: Información y Filtros */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Tarjeta de información del médico */}
                        <Card className="shadow-sm">
                            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                <DoctorIcon size="md" className="text-salud-primario" /> Mi Ficha Médica
                            </h3>
                            <div className="space-y-3.5 text-sm text-gray-600">
                                <div>
                                    <strong className="block text-gray-500 text-xs uppercase">Especialidad</strong>
                                    <span>{specialtyProfile?.nombre}</span>
                                </div>
                                <div>
                                    <strong className="block text-gray-500 text-xs uppercase">Centro Adscrito</strong>
                                    <span>{centerProfile?.nombre}</span>
                                </div>
                                <div>
                                    <strong className="block text-gray-500 text-xs uppercase">Credenciales</strong>
                                    <span className="text-xs leading-normal">{doctorProfile?.credenciales}</span>
                                </div>
                                <div>
                                    <strong className="block text-gray-500 text-xs uppercase">Horario de Atención</strong>
                                    <div className="flex flex-col gap-1 mt-1">
                                        <span className="flex items-center gap-1 text-xs">
                                            <MorningIcon size="sm" /> {doctorProfile?.horario.manana}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs">
                                            <AfternoonIcon size="sm" /> {doctorProfile?.horario.tarde}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Filtros de estado */}
                        <Card className="shadow-sm">
                            <h3 className="font-bold text-gray-800 text-base mb-4">
                                Filtrar Agenda
                            </h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    { id: 'todos', label: `Todos (${myAppointments.length})` },
                                    { id: AppointmentStatus.RESERVADA, label: `Reservadas (${myAppointments.filter(a => a.estado === AppointmentStatus.RESERVADA).length})` },
                                    { id: AppointmentStatus.COMPLETADA, label: `Completadas (${myAppointments.filter(a => a.estado === AppointmentStatus.COMPLETADA).length})` },
                                    { id: AppointmentStatus.CANCELADA, label: `Canceladas (${myAppointments.filter(a => a.estado === AppointmentStatus.CANCELADA).length})` },
                                ].map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setStatusFilter(filter.id)}
                                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                            statusFilter === filter.id
                                                ? 'bg-salud-primario-claro text-salud-primario font-bold'
                                                : 'text-gray-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Tabla de Citas e Interacciones */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <ClipboardIcon size="lg" className="text-salud-primario" /> Consultas Programadas
                            </h2>
                            <button
                                onClick={() => void refreshAppointments()}
                                className="text-xs font-semibold text-salud-primario bg-salud-primario-claro hover:bg-sky-200 px-3.5 py-2 rounded-xl border border-sky-200 transition-colors"
                            >
                                Refrescar
                            </button>
                        </div>

                        {isLoading && !actioningId ? (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <Spinner size="lg" />
                                <span className="text-sm text-gray-500 mt-4">Actualizando agenda médica...</span>
                            </div>
                        ) : filteredAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {filteredAppointments.map((appointment) => {
                                    const config = statusConfig[appointment.estado];
                                    const isActioning = actioningId === appointment.id;

                                    return (
                                        <Card key={appointment.id} className="!p-0 overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                            {/* Header de la cita */}
                                            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${config.color} flex items-center gap-1.5`}>
                                                        {config.icon} {appointment.estado}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        ID: {appointment.id}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                                                    <CalendarIcon size="sm" /> Agendado para: {appointment.fecha}
                                                </span>
                                            </div>

                                            {/* Datos del Paciente */}
                                            <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-salud-primario-claro text-salud-primario flex items-center justify-center font-bold text-lg">
                                                        {getPatientName(appointment.usuarioId).charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-base">
                                                            {getPatientName(appointment.usuarioId)}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                                            <span><strong>Cédula:</strong> {getPatientCedula(appointment.usuarioId)}</span>
                                                            <span><strong>Tlf:</strong> {getPatientPhone(appointment.usuarioId)}</span>
                                                            <span className="flex items-center gap-0.5">
                                                                {appointment.turno === Shift.MANANA ? <MorningIcon size="sm" /> : <AfternoonIcon size="sm" />} 
                                                                <strong>Turno:</strong> {appointment.turno}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Acciones de gestión para el Médico */}
                                                <div className="w-full sm:w-auto flex flex-wrap gap-2 justify-end">
                                                    {isActioning ? (
                                                        <div className="px-4 py-2 text-xs text-salud-primario font-semibold flex items-center gap-2">
                                                            <Spinner size="sm" /> Procesando...
                                                        </div>
                                                    ) : appointment.estado === AppointmentStatus.RESERVADA ? (
                                                        <>
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => handleStatusUpdate(appointment.id, AppointmentStatus.COMPLETADA)}
                                                                className="text-xs font-bold bg-salud-primario hover:bg-sky-700"
                                                            >
                                                                Completar Cita
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleStatusUpdate(appointment.id, AppointmentStatus.CANCELADA)}
                                                                className="text-xs font-bold border-red-200 text-red-600 hover:bg-red-50"
                                                            >
                                                                Cancelar
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 font-semibold italic flex items-center gap-1">
                                                            <InfoIcon size="sm" /> Consulta finalizada
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Motivo de rechazo/cancelación */}
                                            {appointment.motivoRechazo && (
                                                <div className="px-5 pb-4">
                                                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-gray-500">
                                                        <strong>Nota de Cita:</strong> {appointment.motivoRechazo}
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <Card className="text-center py-16 border border-dashed border-gray-200">
                                <ClipboardIcon size="xl" className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-bold text-gray-700">
                                    No hay citas encontradas
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    No hay consultas programadas para este filtro o médico.
                                </p>
                            </Card>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
