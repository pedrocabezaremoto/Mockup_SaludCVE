/**
 * SaludConecta VE - Tipos e Interfaces
 * Definición de tipos para el sistema de citas médicas
 */

// ===== ENUMS =====

/** Estados posibles de una cita médica */
export enum AppointmentStatus {
    RESERVADA = 'Reservada',
    PENDIENTE = 'Pendiente',
    RECHAZADA = 'Rechazada',
    COMPLETADA = 'Completada',
    CANCELADA = 'Cancelada'
}

/** Turnos de atención disponibles */
export enum Shift {
    MANANA = 'Mañana',
    TARDE = 'Tarde'
}

// ===== INTERFACES =====

/** Representa un centro de salud */
export interface HealthCenter {
    id: string;
    nombre: string;
    direccion: string;
    telefono: string;
    /** Indica si el centro está "colapsado" para simular rechazo de citas */
    colapsado: boolean;
}

/** Representa una especialidad médica */
export interface Specialty {
    id: string;
    nombre: string;
    icono: string;  // Emoji o código de icono
}

/** Representa un médico */
export interface Doctor {
    id: string;
    nombre: string;
    especialidadId: string;
    centroId: string;
    /** Horario de atención */
    horario: {
        manana: string;
        tarde: string;
    };
    /** Información adicional del perfil */
    credenciales: string;
}

/** Representa un usuario del sistema */
export interface User {
    id: string;
    nombre: string;
    cedula: string;
    telefono: string;
    /** Tipo de usuario para lógica de demo */
    tipo: 'maria' | 'pablo' | 'admin' | 'doctor';
    rol: 'admin' | 'doctor' | 'paciente';
    doctorId?: string;
}

/** Representa una cita médica */
export interface Appointment {
    id: string;
    usuarioId: string;
    doctorId: string;
    centroId: string;
    especialidadId: string;
    fecha: string;
    turno: Shift;
    estado: AppointmentStatus;
    /** Razón del rechazo si aplica */
    motivoRechazo?: string;
    /** Fecha y hora de creación */
    createdAt: Date;
}

/** Datos del wizard de agendamiento */
export interface BookingWizardData {
    step: number;
    centroId?: string;
    especialidadId?: string;
    doctorId?: string;
    fecha?: string;
    turno?: Shift;
}

// ===== TIPOS DE CONTEXTO =====

/** Estado de autenticación */
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

/** Acciones del contexto de autenticación */
export interface AuthContextType extends AuthState {
    login: (userId: string) => Promise<User | null>;
    logout: () => void;
}

/** Estado de citas */
export interface AppointmentState {
    appointments: Appointment[];
    isLoading: boolean;
}

/** Acciones del contexto de citas */
export interface AppointmentContextType extends AppointmentState {
    addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Promise<Appointment>;
    getAppointmentsByUser: (userId: string) => Appointment[];
    updateAppointmentStatus: (id: string, estado: AppointmentStatus, motivoRechazo?: string) => Promise<Appointment>;
    refreshAppointments: () => Promise<void>;
}
