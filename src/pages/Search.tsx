/**
 * SaludConecta VE - Pantalla de Búsqueda de Especialistas
 * Representa: UC1 - Buscar Especialista
 * 
 * Buscador interactivo por pasos:
 * Paso 1: Seleccionar Centro de Salud
 * Paso 2: Seleccionar Especialidad
 * Resultado: Lista de doctores disponibles
 */

import React, { useState } from 'react';
import { Navbar, BackButton } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useCatalog } from '../contexts/CatalogContext';
import { HealthCenter, Specialty, Doctor } from '../types';
import { 
    SearchIcon, 
    WarningIcon, 
    HospitalIcon, 
    LocationIcon, 
    PhoneIcon,
    DoctorIcon,
    MorningIcon,
    AfternoonIcon,
    SadIcon,
    PediatricsIcon,
    GynecologyIcon,
    InternalMedicineIcon,
    CardiologyIcon,
    SurgeryIcon
} from '../components/icons';

type Page = 'home' | 'search' | 'booking' | 'appointments' | 'contact';

interface SearchPageProps {
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    onSelectDoctor: (doctor: Doctor) => void;
}

type SearchStep = 'center' | 'specialty' | 'results';

// Mapeo de especialidades a iconos SVG
const specialtyIcons: { [key: string]: React.ReactElement } = {
    'pediatria': <PediatricsIcon size="xl" className="text-sky-500" />,
    'ginecologia': <GynecologyIcon size="xl" className="text-pink-500" />,
    'medicina-interna': <InternalMedicineIcon size="xl" className="text-blue-500" />,
    'cardiologia': <CardiologyIcon size="xl" className="text-red-500" />,
    'cirugia-general': <SurgeryIcon size="xl" className="text-purple-500" />
};

/**
 * Pantalla de búsqueda de especialistas
 * Implementa el patrón "Wizard" para guiar al usuario
 */
const SearchPage: React.FC<SearchPageProps> = ({
    onNavigate,
    onLogout,
    onSelectDoctor
}) => {
    const { healthCenters, specialties, getDoctorsByCenterAndSpecialty } = useCatalog();
    const [step, setStep] = useState<SearchStep>('center');
    const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);
    const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    // Manejar selección de centro
    const handleCenterSelect = (center: HealthCenter) => {
        setSelectedCenter(center);
        setStep('specialty');
    };

    // Manejar selección de especialidad
    const handleSpecialtySelect = (specialty: Specialty) => {
        if (selectedCenter) {
            setSelectedSpecialty(specialty);
            const foundDoctors = getDoctorsByCenterAndSpecialty(selectedCenter.id, specialty.id);
            setDoctors(foundDoctors);
            setStep('results');
        }
    };

    // Volver al paso anterior
    const handleBack = () => {
        if (step === 'specialty') {
            setStep('center');
            setSelectedCenter(null);
        } else if (step === 'results') {
            setStep('specialty');
            setSelectedSpecialty(null);
            setDoctors([]);
        } else {
            onNavigate('home');
        }
    };

    return (
        <div className="min-h-screen bg-salud-fondo">
            <Navbar onHomeClick={() => onNavigate('home')} onLogout={onLogout} />

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Navegación */}
                <BackButton onClick={handleBack} className="mb-4" />

                {/* Encabezado */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <SearchIcon size="lg" className="text-salud-accion" /> Buscar Especialista
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {step === 'center' && 'Paso 1: Seleccione un centro de salud'}
                        {step === 'specialty' && 'Paso 2: Seleccione una especialidad'}
                        {step === 'results' && 'Resultados de la búsqueda'}
                    </p>
                </div>

                {/* Indicador de progreso */}
                <div className="flex items-center gap-2 mb-8">
                    {['Centro', 'Especialidad', 'Resultados'].map((label, index) => {
                        const stepIndex = ['center', 'specialty', 'results'].indexOf(step);
                        const isActive = index <= stepIndex;
                        return (
                            <React.Fragment key={label}>
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                    ${isActive
                                            ? 'bg-salud-accion text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                <span className={`text-sm ${isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                                    {label}
                                </span>
                                {index < 2 && (
                                    <div className={`flex-1 h-1 rounded ${isActive ? 'bg-salud-accion' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* Paso 1: Selección de Centro */}
                {step === 'center' && (
                    <div className="grid gap-4 animate-fade-in">
                        {healthCenters.map((center) => (
                            <Card
                                key={center.id}
                                hoverable
                                onClick={() => handleCenterSelect(center)}
                                className="cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">
                                        {center.colapsado ? 
                                            <WarningIcon size="lg" className="text-amber-500" /> : 
                                            <HospitalIcon size="lg" className="text-salud-primario" />
                                        }
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-800">
                                            {center.nombre}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                                            <LocationIcon size="sm" /> {center.direccion}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                            <PhoneIcon size="sm" /> {center.telefono}
                                        </p>
                                        {center.colapsado && (
                                            <span className="inline-flex items-center gap-1 mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                                <WarningIcon size="sm" /> Alta demanda
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Paso 2: Selección de Especialidad */}
                {step === 'specialty' && (
                    <div className="animate-fade-in">
                        <div className="bg-salud-primario-claro rounded-xl p-4 mb-6">
                            <p className="text-sm text-salud-primario">
                                <strong>Centro seleccionado:</strong> {selectedCenter?.nombre}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {specialties.map((specialty) => (
                                <Card
                                    key={specialty.id}
                                    hoverable
                                    onClick={() => handleSpecialtySelect(specialty)}
                                    className="cursor-pointer text-center"
                                >
                                    <div className="mb-2">{specialtyIcons[specialty.id]}</div>
                                    <h3 className="font-semibold text-gray-800">{specialty.nombre}</h3>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resultados */}
                {step === 'results' && (
                    <div className="animate-fade-in">
                        <div className="bg-salud-primario-claro rounded-xl p-4 mb-6">
                            <p className="text-sm text-salud-primario">
                                <strong>Buscando en:</strong> {selectedCenter?.nombre} → {selectedSpecialty?.nombre}
                            </p>
                        </div>

                        {doctors.length > 0 ? (
                            <div className="grid gap-4">
                                {doctors.map((doctor) => (
                                    <Card key={doctor.id} className="!p-0 overflow-hidden">
                                        <div className="flex flex-col sm:flex-row">
                                            {/* Info del doctor */}
                                            <div className="flex-1 p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-12 h-12 rounded-full bg-salud-primario-claro 
                                          flex items-center justify-center text-xl">
                                                        <DoctorIcon className="text-salud-primario" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-800">
                                                            {doctor.nombre}
                                                        </h3>
                                                        <p className="text-sm text-salud-primario flex items-center gap-1">
                                                            {selectedSpecialty && specialtyIcons[selectedSpecialty.id] && (
                                                                React.cloneElement(specialtyIcons[selectedSpecialty.id], { size: 'sm' as any })
                                                            )} {selectedSpecialty?.nombre}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {doctor.credenciales}
                                                </p>
                                                <div className="text-sm text-gray-500">
                                                    <p className="flex items-center gap-2">
                                                        <MorningIcon size="sm" /> Mañana: {doctor.horario.manana}
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <AfternoonIcon size="sm" /> Tarde: {doctor.horario.tarde}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Acción */}
                                            <div className="p-4 bg-gray-50 flex items-center justify-center sm:w-48">
                                                <Button
                                                    variant="primary"
                                                    onClick={() => onSelectDoctor(doctor)}
                                                >
                                                    Ver Perfil
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="text-center py-12">
                                <SadIcon size="xl" className="mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-bold text-gray-700 mb-2">
                                    No se encontraron especialistas
                                </h3>
                                <p className="text-gray-500">
                                    Intente con otro centro o especialidad
                                </p>
                            </Card>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SearchPage;
