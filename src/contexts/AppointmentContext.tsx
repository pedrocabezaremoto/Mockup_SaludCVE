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

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppointmentContextType, Appointment, AppointmentStatus } from '../types';
import { isCenterAvailable } from '../data/mockData';

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

    /**
     * Agrega una nueva cita al sistema
     * Simula la lógica de negocio según el usuario y centro seleccionado
     * 
     * LÓGICA DE ESCENARIOS:
     * - Si el centro está disponible (Hospital Militar): Estado = RESERVADA
     * - Si el centro está colapsado: Estado = RECHAZADA
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

        // Determinar el estado según disponibilidad del centro
        const centerAvailable = isCenterAvailable(appointmentData.centroId);

        const newAppointment: Appointment = {
            ...appointmentData,
            id: `apt-${Date.now()}`,
            createdAt: new Date(),
            estado: centerAvailable
                ? AppointmentStatus.RESERVADA
                : AppointmentStatus.RECHAZADA,
            motivoRechazo: centerAvailable
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
