import { Appointment, Doctor, HealthCenter, Specialty, User } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        let message = 'Error en la solicitud al backend';
        try {
            const payload = await response.json();
            if (payload?.message) {
                message = payload.message;
            }
        } catch {
            // ignore parsing errors
        }
        throw new Error(message);
    }

    return response.json() as Promise<T>;
};

export const fetchHealthCenters = (): Promise<HealthCenter[]> => {
    return request<HealthCenter[]>('/api/health-centers');
};

export const fetchSpecialties = (): Promise<Specialty[]> => {
    return request<Specialty[]>('/api/specialties');
};

export const fetchDoctors = (centerId?: string, specialtyId?: string): Promise<Doctor[]> => {
    const params = new URLSearchParams();
    if (centerId) params.append('centerId', centerId);
    if (specialtyId) params.append('specialtyId', specialtyId);
    const query = params.toString();
    return request<Doctor[]>(`/api/doctors${query ? `?${query}` : ''}`);
};

export const fetchAppointments = (userId?: string, doctorId?: string): Promise<Appointment[]> => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (doctorId) params.append('doctorId', doctorId);
    const query = params.toString();
    return request<Appointment[]>(`/api/appointments${query ? `?${query}` : ''}`);
};

export const updateAppointmentStatus = (
    id: string,
    estado: string,
    motivoRechazo?: string
): Promise<Appointment> => {
    return request<Appointment>(`/api/appointments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ estado, motivoRechazo }),
    });
};

export const toggleHealthCenterCollapse = (id: string): Promise<HealthCenter> => {
    return request<HealthCenter>(`/api/health-centers/${id}/toggle-collapse`, {
        method: 'PUT',
    });
};

export const createAppointment = (
    appointment: Omit<Appointment, 'id' | 'createdAt'>
): Promise<Appointment> => {
    return request<Appointment>('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(appointment),
    });
};

export const loginUser = (userId: string): Promise<User> => {
    return request<User>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });
};
