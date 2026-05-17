/**
 * SaludConecta VE - Pantalla de Mis Citas
 * Representa: UC5 - Ver Estado de Citas
 * 
 * Dashboard donde el paciente ve todas sus citas con sus estados
 */

import React from 'react';
import { Navbar, BackButton } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import { useCatalog } from '../contexts/CatalogContext';
import { AppointmentStatus } from '../types';
import { 
    ClipboardIcon,
    ConfirmedIcon,
    PendingIcon,
    RejectedIcon,
    CompletedIcon,
    CancelledIcon,
    DoctorIcon,
    HospitalIcon,
    CalendarIcon,
    MorningIcon,
    AfternoonIcon,
    WarningIcon,
    SearchIcon,
    PediatricsIcon,
    GynecologyIcon,
    InternalMedicineIcon,
    CardiologyIcon,
    SurgeryIcon
} from '../components/icons';

type Page = 'home' | 'search' | 'booking' | 'appointments' | 'contact';

// Mapeo de especialidades a iconos SVG
const specialtyIcons: { [key: string]: React.ReactElement } = {
    'pediatria': <PediatricsIcon size="sm" className="text-sky-500" />,
    'ginecologia': <GynecologyIcon size="sm" className="text-pink-500" />,
    'medicina-interna': <InternalMedicineIcon size="sm" className="text-blue-500" />,
    'cardiologia': <CardiologyIcon size="sm" className="text-red-500" />,
    'cirugia-general': <SurgeryIcon size="sm" className="text-purple-500" />
};

interface MyAppointmentsPageProps {
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

const statusConfig = {
    [AppointmentStatus.RESERVADA]: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <ConfirmedIcon size="sm" />,
        description: 'Su cita ha sido confirmada',
    },
    [AppointmentStatus.PENDIENTE]: {
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: <PendingIcon size="sm" />,
        description: 'En espera de confirmación',
    },
    [AppointmentStatus.RECHAZADA]: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <RejectedIcon size="sm" />,
        description: 'No fue posible agendar esta cita',
    },
    [AppointmentStatus.COMPLETADA]: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CompletedIcon size="sm" />,
        description: 'Cita atendida',
    },
    [AppointmentStatus.CANCELADA]: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <CancelledIcon size="sm" />,
        description: 'Cita cancelada',
    },
};

/**
 * Pantalla de listado de citas del usuario
 * Muestra historial con estados visuales claros
 */
const MyAppointmentsPage: React.FC<MyAppointmentsPageProps> = ({
    onNavigate,
    onLogout,
}) => {
    const { user } = useAuth();
    const { getAppointmentsByUser } = useAppointments();
    const { getDoctorById, getSpecialtyById, getHealthCenterById } = useCatalog();

    const appointments = user ? getAppointmentsByUser(user.id) : [];

    return (
        <div className="min-h-screen bg-salud-fondo">
            <Navbar onHomeClick={() => onNavigate('home')} onLogout={onLogout} />

            <main className="max-w-2xl mx-auto px-4 py-6">
                <BackButton onClick={() => onNavigate('home')} className="mb-4" />

                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <ClipboardIcon size="lg" className="text-salud-accion" /> Mis Citas
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Historial y estado de sus citas médicas
                    </p>
                </div>

                {appointments.length > 0 ? (
                    <div className="space-y-4 animate-fade-in">
                        {appointments.map((appointment) => {
                            const doctor = getDoctorById(appointment.doctorId);
                            const specialty = getSpecialtyById(appointment.especialidadId);
                            const center = getHealthCenterById(appointment.centroId);
                            const config = statusConfig[appointment.estado];

                            return (
                                <Card key={appointment.id} className="!p-0 overflow-hidden">
                                    {/* Badge de estado */}
                                    <div className={`px-4 py-2 border-b ${config.color}`}>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold flex items-center gap-2">
                                                {config.icon} Estado: {appointment.estado}
                                            </span>
                                            <span className="text-xs opacity-70">
                                                {new Date(appointment.createdAt).toLocaleDateString('es-VE')}
                                            </span>
                                        </div>
                                        <p className="text-sm opacity-80">{config.description}</p>
                                    </div>

                                    {/* Detalles de la cita */}
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">
                                                <DoctorIcon size="lg" className="text-salud-primario" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-gray-800">
                                                    {doctor?.nombre}
                                                </h3>
                                                <p className="text-sm text-salud-primario flex items-center gap-1">
                                                    {specialty && specialtyIcons[specialty.id]} {specialty?.nombre}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                    <HospitalIcon size="sm" /> {center?.nombre}
                                                </p>
                                                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <CalendarIcon size="sm" /> {appointment.fecha}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        {appointment.turno === 'Mañana' ? 
                                                            <MorningIcon size="sm" /> : 
                                                            <AfternoonIcon size="sm" />
                                                        } {appointment.turno}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Motivo de rechazo si aplica */}
                                        {appointment.motivoRechazo && (
                                            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                                <p className="text-sm text-red-700 flex items-start gap-2">
                                                    <WarningIcon size="sm" className="flex-shrink-0 mt-0.5" />
                                                    <span><strong>Motivo:</strong> {appointment.motivoRechazo}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="text-center py-16 animate-fade-in">
                        <ClipboardIcon size="xl" className="mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            No tiene citas registradas
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Agende su primera cita médica para verla aquí
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => onNavigate('search')}
                            leftIcon={<SearchIcon />}
                        >
                            Buscar Especialista
                        </Button>
                    </Card>
                )}

                {/* Resumen de estados */}
                {appointments.length > 0 && (
                    <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                            Resumen
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(statusConfig).map(([status, config]) => {
                                const count = appointments.filter(a => a.estado === status).length;
                                if (count === 0) return null;
                                return (
                                    <span
                                        key={status}
                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}
                                    >
                                        {config.icon} {status}: {count}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyAppointmentsPage;
