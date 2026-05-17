/**
 * SaludConecta VE - Pantalla de Perfil del Doctor
 * Representa: UC2 - Ver Perfil
 * 
 * Tarjeta con credenciales y horarios del médico seleccionado
 */

import React from 'react';
import { Navbar, BackButton } from '../components/layout';
import { Card, Button } from '../components/ui';
import { Doctor, Specialty, HealthCenter } from '../types';
import { useCatalog } from '../contexts/CatalogContext';
import { 
    DoctorIcon, 
    HospitalIcon, 
    LocationIcon, 
    WarningIcon,
    MorningIcon,
    AfternoonIcon,
    CalendarIcon,
    PediatricsIcon,
    GynecologyIcon,
    InternalMedicineIcon,
    CardiologyIcon,
    SurgeryIcon
} from '../components/icons';

type Page = 'home' | 'search' | 'booking' | 'appointments' | 'contact';

// Mapeo de especialidades a iconos SVG
const specialtyIcons: { [key: string]: React.ReactElement } = {
    'pediatria': <PediatricsIcon size="md" className="text-sky-500" />,
    'ginecologia': <GynecologyIcon size="md" className="text-pink-500" />,
    'medicina-interna': <InternalMedicineIcon size="md" className="text-blue-500" />,
    'cardiologia': <CardiologyIcon size="md" className="text-red-500" />,
    'cirugia-general': <SurgeryIcon size="md" className="text-purple-500" />
};

interface DoctorProfilePageProps {
    doctor: Doctor;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    onBookAppointment: (doctor: Doctor) => void;
}

/**
 * Pantalla de perfil de doctor
 * Muestra información detallada del especialista
 */
const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({
    doctor,
    onNavigate,
    onLogout,
    onBookAppointment,
}) => {
    const { getSpecialtyById, getHealthCenterById } = useCatalog();
    const specialty: Specialty | undefined = getSpecialtyById(doctor.especialidadId);
    const center: HealthCenter | undefined = getHealthCenterById(doctor.centroId);

    return (
        <div className="min-h-screen bg-salud-fondo">
            <Navbar onHomeClick={() => onNavigate('home')} onLogout={onLogout} />

            <main className="max-w-2xl mx-auto px-4 py-6">
                <BackButton onClick={() => onNavigate('search')} className="mb-4" />

                {/* Tarjeta principal del doctor */}
                <Card className="animate-fade-in">
                    {/* Header con foto */}
                    <div className="text-center pb-6 border-b border-gray-100">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-salud-primario to-sky-400
                            flex items-center justify-center text-white shadow-lg">
                            <DoctorIcon size="xl" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {doctor.nombre}
                        </h1>
                        <p className="text-salud-primario font-medium mt-1 flex items-center justify-center gap-1">
                            {specialty && specialtyIcons[specialty.id]} {specialty?.nombre}
                        </p>
                    </div>

                    {/* Información del doctor */}
                    <div className="py-6 space-y-4">
                        {/* Credenciales */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Credenciales
                            </h3>
                            <p className="text-gray-700">
                                {doctor.credenciales}
                            </p>
                        </div>

                        {/* Centro de salud */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Centro de Salud
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="font-medium text-gray-800 flex items-center gap-2">
                                    <HospitalIcon size="md" className="text-salud-primario" /> {center?.nombre}
                                </p>
                                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                                    <LocationIcon size="sm" /> {center?.direccion}
                                </p>
                                {center?.colapsado && (
                                    <span className="inline-flex items-center gap-1 mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                        <WarningIcon size="sm" /> Alta demanda actualmente
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Horarios */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Horarios de Atención
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-amber-50 rounded-xl p-4">
                                    <MorningIcon size="lg" className="text-amber-600 mb-1" />
                                    <p className="font-medium text-gray-800">Mañana</p>
                                    <p className="text-sm text-gray-600">{doctor.horario.manana}</p>
                                </div>
                                <div className="bg-violet-50 rounded-xl p-4">
                                    <AfternoonIcon size="lg" className="text-violet-600 mb-1" />
                                    <p className="font-medium text-gray-800">Tarde</p>
                                    <p className="text-sm text-gray-600">{doctor.horario.tarde}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="pt-6 border-t border-gray-100 space-y-3">
                        <Button
                            variant="primary"
                            fullWidth
                            size="lg"
                            onClick={() => onBookAppointment(doctor)}
                            leftIcon={<CalendarIcon />}
                        >
                            Agendar Cita con este Especialista
                        </Button>

                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => onNavigate('search')}
                        >
                            Buscar otro especialista
                        </Button>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default DoctorProfilePage;
