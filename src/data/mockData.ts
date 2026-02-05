/**
 * SaludConecta VE - Datos Precargados (Mock Data)
 * Centros de Salud, Especialidades y Doctores de San Juan de los Morros, Guárico
 * 
 * Estos datos simulan la información que vendría de una base de datos real.
 * Se utilizan para la demostración académica ante la UNERG.
 */

import { HealthCenter, Specialty, Doctor, User } from '../types';

// ===== CENTROS DE SALUD =====
// Representa los 5 centros de salud de San Juan de los Morros
export const healthCenters: HealthCenter[] = [
    {
        id: 'ambulatorio-ivss',
        nombre: 'Ambulatorio San Juan (IVSS)',
        direccion: 'Calle Santa Isabel N° 15, San Juan de los Morros',
        telefono: '+58 246-4311234',
        colapsado: true, // Centro colapsado para simular caso Pablo
    },
    {
        id: 'cdi-bella-vista',
        nombre: 'CDI Bella Vista (Che Guevara)',
        direccion: 'Urb. Bella Vista, San Juan de los Morros',
        telefono: '+58 246-4315678',
        colapsado: true, // Centro colapsado para simular caso Pablo
    },
    {
        id: 'cdi-fatima',
        nombre: 'CDI Calle Fátima (Dr. Tulio Pineda)',
        direccion: 'Sector Central, San Juan de los Morros',
        telefono: '+58 246-4319012',
        colapsado: true, // Centro colapsado para simular caso Pablo
    },
    {
        id: 'hospital-militar',
        nombre: 'Hospital Militar Fuerte Conopoima',
        direccion: 'Sede de la 43 Brigada, San Juan de los Morros',
        telefono: '+58 246-4323456',
        colapsado: false, // ¡DISPONIBLE! - Caso María funciona aquí
    },
    {
        id: 'hospital-ranuarez',
        nombre: 'Hospital Israel Ranuárez Balza',
        direccion: 'Av. Lasso Martí, San Juan de los Morros',
        telefono: '+58 246-4327890',
        colapsado: true, // Centro colapsado para simular caso Pablo
    },
];

// ===== ESPECIALIDADES MÉDICAS =====
export const specialties: Specialty[] = [
    { id: 'pediatria', nombre: 'Pediatría', icono: '👶' },
    { id: 'ginecologia', nombre: 'Ginecología', icono: '🤰' },
    { id: 'medicina-interna', nombre: 'Medicina Interna', icono: '🩺' },
    { id: 'cardiologia', nombre: 'Cardiología', icono: '❤️' },
    { id: 'cirugia-general', nombre: 'Cirugía General', icono: '🏥' },
];

// ===== DOCTORES (25 en total) =====
// Distribuidos equitativamente: 5 doctores por centro, 1 por especialidad
export const doctors: Doctor[] = [
    // === Ambulatorio San Juan (IVSS) ===
    {
        id: 'doc-001',
        nombre: 'Dra. Elena Rodríguez',
        especialidadId: 'pediatria',
        centroId: 'ambulatorio-ivss',
        horario: { manana: '7:00 AM - 12:00 PM', tarde: '2:00 PM - 5:00 PM' },
        credenciales: 'Especialista en Pediatría - UCV. 15 años de experiencia.',
    },
    {
        id: 'doc-002',
        nombre: 'Dra. Carmen Alvarado',
        especialidadId: 'ginecologia',
        centroId: 'ambulatorio-ivss',
        horario: { manana: '8:00 AM - 12:00 PM', tarde: '1:00 PM - 4:00 PM' },
        credenciales: 'Ginecóloga Obstetra - UNERG. 12 años de experiencia.',
    },
    {
        id: 'doc-003',
        nombre: 'Dr. Ricardo Tovar',
        especialidadId: 'medicina-interna',
        centroId: 'ambulatorio-ivss',
        horario: { manana: '7:30 AM - 11:30 AM', tarde: '2:30 PM - 6:00 PM' },
        credenciales: 'Internista - ULA. 20 años de experiencia.',
    },
    {
        id: 'doc-004',
        nombre: 'Dr. Luis Manuel Carrillo',
        especialidadId: 'cardiologia',
        centroId: 'ambulatorio-ivss',
        horario: { manana: '8:00 AM - 12:00 PM', tarde: '2:00 PM - 5:00 PM' },
        credenciales: 'Cardiólogo - UCV. 18 años de experiencia.',
    },
    {
        id: 'doc-005',
        nombre: 'Dr. Pedro Infante',
        especialidadId: 'cirugia-general',
        centroId: 'ambulatorio-ivss',
        horario: { manana: '6:00 AM - 12:00 PM', tarde: 'Solo emergencias' },
        credenciales: 'Cirujano General - LUZ. 22 años de experiencia.',
    },

    // === CDI Bella Vista (Che Guevara) ===
    {
        id: 'doc-006',
        nombre: 'Dr. José Gregorio Hernández',
        especialidadId: 'pediatria',
        centroId: 'cdi-bella-vista',
        horario: { manana: '7:00 AM - 12:00 PM', tarde: '2:00 PM - 5:00 PM' },
        credenciales: 'Pediatra - Homenaje al Venerable. Atención integral.',
    },
    {
        id: 'doc-007',
        nombre: 'Dra. Mariela Machado',
        especialidadId: 'ginecologia',
        centroId: 'cdi-bella-vista',
        horario: { manana: '8:00 AM - 1:00 PM', tarde: '3:00 PM - 6:00 PM' },
        credenciales: 'Ginecóloga - UNERG. Control prenatal especializado.',
    },
    {
        id: 'doc-008',
        nombre: 'Dr. Francisco Loreto',
        especialidadId: 'medicina-interna',
        centroId: 'cdi-bella-vista',
        horario: { manana: '7:00 AM - 11:00 AM', tarde: '1:00 PM - 5:00 PM' },
        credenciales: 'Internista - UC. Manejo de enfermedades crónicas.',
    },
    {
        id: 'doc-009',
        nombre: 'Dra. Ana Julia Pérez',
        especialidadId: 'cardiologia',
        centroId: 'cdi-bella-vista',
        horario: { manana: '8:00 AM - 12:00 PM', tarde: '2:00 PM - 4:00 PM' },
        credenciales: 'Cardióloga - UCV. Electrocardiografía avanzada.',
    },
    {
        id: 'doc-010',
        nombre: 'Dra. Beatriz Peña',
        especialidadId: 'cirugia-general',
        centroId: 'cdi-bella-vista',
        horario: { manana: '6:30 AM - 12:00 PM', tarde: 'Consultas programadas' },
        credenciales: 'Cirujana - UNERG. Cirugía mínimamente invasiva.',
    },

    // === CDI Calle Fátima (Dr. Tulio Pineda) ===
    {
        id: 'doc-011',
        nombre: 'Dra. Sofía Guárico',
        especialidadId: 'pediatria',
        centroId: 'cdi-fatima',
        horario: { manana: '7:30 AM - 12:30 PM', tarde: '2:00 PM - 5:30 PM' },
        credenciales: 'Pediatra - UDO. Vacunación y crecimiento infantil.',
    },
    {
        id: 'doc-012',
        nombre: 'Dr. Carlos Eduardo Ríos',
        especialidadId: 'ginecologia',
        centroId: 'cdi-fatima',
        horario: { manana: '8:00 AM - 12:00 PM', tarde: '2:00 PM - 5:00 PM' },
        credenciales: 'Ginecólogo - ULA. Salud reproductiva integral.',
    },
    {
        id: 'doc-013',
        nombre: 'Dra. Valentina Ortiz',
        especialidadId: 'medicina-interna',
        centroId: 'cdi-fatima',
        horario: { manana: '7:00 AM - 11:00 AM', tarde: '1:00 PM - 4:00 PM' },
        credenciales: 'Internista - UNERG. Diabetes e hipertensión.',
    },
    {
        id: 'doc-014',
        nombre: 'Dr. Roberto Sanz',
        especialidadId: 'cardiologia',
        centroId: 'cdi-fatima',
        horario: { manana: '8:30 AM - 12:30 PM', tarde: '3:00 PM - 6:00 PM' },
        credenciales: 'Cardiólogo - UCV. Ecocardiografía.',
    },
    {
        id: 'doc-015',
        nombre: 'Dr. Miguel Hidalgo',
        especialidadId: 'cirugia-general',
        centroId: 'cdi-fatima',
        horario: { manana: '6:00 AM - 11:00 AM', tarde: 'Solo emergencias' },
        credenciales: 'Cirujano - UC. Cirugía ambulatoria.',
    },

    // === Hospital Militar Fuerte Conopoima === (Centro DISPONIBLE para María)
    {
        id: 'doc-016',
        nombre: 'Dr. Rafael Urdaneta',
        especialidadId: 'pediatria',
        centroId: 'hospital-militar',
        horario: { manana: '7:00 AM - 12:00 PM', tarde: '2:00 PM - 5:00 PM' },
        credenciales: 'Pediatra Militar - UNEFA. Atención integral pediátrica.',
    },
    {
        id: 'doc-017',
        nombre: 'Dra. Rosa Inés Castro',
        especialidadId: 'ginecologia',
        centroId: 'hospital-militar',
        horario: { manana: '8:00 AM - 1:00 PM', tarde: '2:00 PM - 5:00 PM' },
        credenciales: 'Ginecóloga - UCV. Alto riesgo obstétrico.',
    },
    {
        id: 'doc-018',
        nombre: 'Dr. Antonio José Armas',
        especialidadId: 'medicina-interna',
        centroId: 'hospital-militar',
        horario: { manana: '7:30 AM - 12:00 PM', tarde: '1:30 PM - 5:30 PM' },
        credenciales: 'Internista - ULA. Medicina preventiva.',
    },
    {
        // DOCTORA CLAVE PARA EL CASO DE PRUEBA DE MARÍA
        id: 'doc-019',
        nombre: 'Dra. María García',
        especialidadId: 'cardiologia',
        centroId: 'hospital-militar',
        horario: { manana: '8:00 AM - 12:00 PM', tarde: '2:00 PM - 6:00 PM' },
        credenciales: 'Cardióloga - UCV. Especialista en arritmias cardíacas.',
    },
    {
        id: 'doc-020',
        nombre: 'Dr. Javier Solórzano',
        especialidadId: 'cirugia-general',
        centroId: 'hospital-militar',
        horario: { manana: '6:00 AM - 12:00 PM', tarde: '2:00 PM - 4:00 PM' },
        credenciales: 'Cirujano General - UNERG. Cirugía laparoscópica.',
    },

    // === Hospital Israel Ranuárez Balza ===
    {
        id: 'doc-021',
        nombre: 'Dra. Lucía Mendoza',
        especialidadId: 'pediatria',
        centroId: 'hospital-ranuarez',
        horario: { manana: '7:00 AM - 12:00 PM', tarde: '1:00 PM - 5:00 PM' },
        credenciales: 'Pediatra - UDO. Neonatología.',
    },
    {
        id: 'doc-022',
        nombre: 'Dra. Patricia Colmenares',
        especialidadId: 'ginecologia',
        centroId: 'hospital-ranuarez',
        horario: { manana: '8:00 AM - 12:00 PM', tarde: '2:00 PM - 5:00 PM' },
        credenciales: 'Ginecóloga - UC. Control prenatal y posparto.',
    },
    {
        id: 'doc-023',
        nombre: 'Dr. Diego Arreaza',
        especialidadId: 'medicina-interna',
        centroId: 'hospital-ranuarez',
        horario: { manana: '7:00 AM - 11:00 AM', tarde: '1:00 PM - 4:00 PM' },
        credenciales: 'Internista - UNERG. Enfermedades infecciosas.',
    },
    {
        id: 'doc-024',
        nombre: 'Dr. Fernando Landaeta',
        especialidadId: 'cardiologia',
        centroId: 'hospital-ranuarez',
        horario: { manana: '8:00 AM - 12:00 PM', tarde: '3:00 PM - 6:00 PM' },
        credenciales: 'Cardiólogo - UCV. Rehabilitación cardíaca.',
    },
    {
        id: 'doc-025',
        nombre: 'Dra. Gabriela Isler',
        especialidadId: 'cirugia-general',
        centroId: 'hospital-ranuarez',
        horario: { manana: '6:00 AM - 12:00 PM', tarde: 'Programación quirúrgica' },
        credenciales: 'Cirujana - LUZ. Trauma y emergencias.',
    },
];

// ===== USUARIOS DE PRUEBA (DEMO) =====
// Estos usuarios se usan para simular los escenarios de prueba
export const demoUsers: User[] = [
    {
        id: 'user-maria',
        nombre: 'María Fernández',
        cedula: 'V-12.345.678',
        telefono: '+58 424-1234567',
        tipo: 'maria', // Caso de ÉXITO
    },
    {
        id: 'user-pablo',
        nombre: 'Pablo Hernández',
        cedula: 'V-23.456.789',
        telefono: '+58 412-9876543',
        tipo: 'pablo', // Caso de RECHAZO
    },
];

// ===== FUNCIONES HELPER =====

/** Obtiene un centro de salud por su ID */
export const getHealthCenterById = (id: string): HealthCenter | undefined => {
    return healthCenters.find(center => center.id === id);
};

/** Obtiene una especialidad por su ID */
export const getSpecialtyById = (id: string): Specialty | undefined => {
    return specialties.find(specialty => specialty.id === id);
};

/** Obtiene un doctor por su ID */
export const getDoctorById = (id: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === id);
};

/** Obtiene doctores por centro de salud */
export const getDoctorsByCenter = (centerId: string): Doctor[] => {
    return doctors.filter(doctor => doctor.centroId === centerId);
};

/** Obtiene doctores por especialidad */
export const getDoctorsBySpecialty = (specialtyId: string): Doctor[] => {
    return doctors.filter(doctor => doctor.especialidadId === specialtyId);
};

/** Obtiene doctores por centro y especialidad */
export const getDoctorsByCenterAndSpecialty = (centerId: string, specialtyId: string): Doctor[] => {
    return doctors.filter(
        doctor => doctor.centroId === centerId && doctor.especialidadId === specialtyId
    );
};

/** Obtiene un usuario demo por tipo */
export const getDemoUserByType = (tipo: 'maria' | 'pablo'): User | undefined => {
    return demoUsers.find(user => user.tipo === tipo);
};

/** Verifica si un centro está disponible (no colapsado) */
export const isCenterAvailable = (centerId: string): boolean => {
    const center = getHealthCenterById(centerId);
    return center ? !center.colapsado : false;
};
