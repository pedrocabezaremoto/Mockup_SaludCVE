/**
 * SaludConecta VE - Contexto de Citas Médicas
 * Representa: UC3 (Agendar Cita), UC5 (Ver Estado)
 * 
 * Maneja la lógica de negocio simulada para:
 * - Caso María: Éxito al agendar en Hospital Militar (Cardiología)
 * - Caso Pablo: Rechazo por centros colapsados
 * 
 * RF-3: Incluye simulación de carga para feedback visual
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppointmentContextType, Appointment, AppointmentStatus } from '../types';
import { canAppointmentBeApproved, validateSpecialtyAvailability } from '../data/mockData';
import { createAppointment as createAppointmentApi, fetchAppointments } from '../services/api';

// Crear el contexto
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

interface AppointmentProviderProps {
    children: ReactNode;
}

/**
 * Proveedor del contexto de citas
 * Maneja el estado global de las citas médicas
 */
export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const normalizeAppointment = (appointment: Appointment): Appointment => ({
        ...appointment,
        createdAt: new Date(appointment.createdAt),
    });

    const loadAppointments = async () => {
        try {
            const apiAppointments = await fetchAppointments();
            setAppointments(apiAppointments.map(normalizeAppointment));
        } catch {
            // Mantener datos locales si el backend no está disponible
        }
    };

    useEffect(() => {
        void loadAppointments();
    }, []);

    /**
     * Agrega una nueva cita al sistema
     * Validaciones aplicadas:
     * 1. Usuario no puede tener múltiples citas pendientes en la misma especialidad
     * 2. Lógica de escenarios (María exitosa, Pablo rechazada)
     * 
     * @param appointmentData - Datos de la cita sin ID ni fecha de creación
     * @returns Promise con la cita creada (incluye resultado de éxito o rechazo)
     */
    const addAppointment = async (
        appointmentData: Omit<Appointment, 'id' | 'createdAt'>
    ): Promise<Appointment> => {
        setIsLoading(true);

        // RF-3: Simular tiempo de carga de red (1.5 - 2.5 segundos)
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        try {
            const created = await createAppointmentApi(appointmentData);
            const normalized = normalizeAppointment(created);
            setAppointments(prev => [...prev, normalized]);
            setIsLoading(false);
            return normalized;
        } catch {
            // Fallback a lógica local si el backend no está disponible
        }

        // VALIDACIÓN 1: Verificar si ya tiene cita pendiente en esta especialidad
        const specialtyValidation = validateSpecialtyAvailability(
            appointmentData.usuarioId,
            appointmentData.especialidadId,
            appointments
        );

        if (!specialtyValidation.isValid) {
            const rejectedAppointment: Appointment = {
                ...appointmentData,
                id: `apt-${Date.now()}`,
                createdAt: new Date(),
                estado: AppointmentStatus.RECHAZADA,
            motivoRechazo: specialtyValidation.message,
        };

        setAppointments(prev => [...prev, rejectedAppointment]);
        setIsLoading(false);

            return rejectedAppointment;
        }

        // VALIDACIÓN 2: Determinar el estado según el usuario y escenario de prueba
        const appointmentApproved = canAppointmentBeApproved(appointmentData.usuarioId);

        const newAppointment: Appointment = {
            ...appointmentData,
            id: `apt-${Date.now()}`,
            createdAt: new Date(),
            estado: appointmentApproved
                ? AppointmentStatus.RESERVADA
                : AppointmentStatus.RECHAZADA,
            motivoRechazo: appointmentApproved
                ? undefined
                : 'Sin disponibilidad - Centro de salud temporalmente sin capacidad de atención',
        };

        setAppointments(prev => [...prev, newAppointment]);
        setIsLoading(false);

        return newAppointment;
    };

    /**
     * Obtiene todas las citas de un usuario específico
     * @param userId - ID del usuario
     * @returns Array de citas del usuario
     */
    const getAppointmentsByUser = (userId: string): Appointment[] => {
        return appointments.filter(apt => apt.usuarioId === userId);
    };

    return (
        <AppointmentContext.Provider
            value={{ appointments, isLoading, addAppointment, getAppointmentsByUser }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto de citas
 * @throws Error si se usa fuera del AppointmentProvider
 */
export const useAppointments = (): AppointmentContextType => {
    const context = useContext(AppointmentContext);
    if (context === undefined) {
        throw new Error('useAppointments debe ser usado dentro de un AppointmentProvider');
    }
    return context;
};
