/**
 * SaludConecta VE - Wizard de Agendamiento de Citas
 * Representa: UC3 - Agendar Cita
 * 
 * Flujo paso a paso:
 * Paso 1: Selección de Fecha ("Hoy", "Mañana", "Elegir día")
 * Paso 2: Selección de Turno ("Mañana" o "Tarde")
 * Paso 3: Confirmación y resultado
 * 
 * Lógica de negocio:
 * - María: Éxito al agendar en Hospital Militar (Cardiología)
 * - Pablo: Rechazo por centros colapsados
 */

import React, { useState } from 'react';
import { Navbar, BackButton } from '../components/layout';
import { Card, Button, Spinner } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useAppointments } from '../contexts/AppointmentContext';
import { Doctor, Shift, AppointmentStatus } from '../types';
import { getSpecialtyById, getHealthCenterById } from '../data/mockData';

type Page = 'home' | 'search' | 'booking' | 'appointments' | 'contact';

interface BookingWizardPageProps {
    doctor: Doctor | null;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
    onComplete: () => void;
}

type WizardStep = 'date' | 'shift' | 'confirm' | 'result';

/**
 * Wizard de agendamiento de citas
 * Implementa el patrón paso a paso para facilitar la experiencia
 */
const BookingWizardPage: React.FC<BookingWizardPageProps> = ({
    doctor,
    onNavigate,
    onLogout,
    onComplete,
}) => {
    const { user } = useAuth();
    const { addAppointment, isLoading } = useAppointments();

    const [step, setStep] = useState<WizardStep>('date');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedDateLabel, setSelectedDateLabel] = useState<string>('');
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [result, setResult] = useState<{
        success: boolean;
        status: AppointmentStatus;
        message: string;
    } | null>(null);

    const specialty = doctor ? getSpecialtyById(doctor.especialidadId) : null;
    const center = doctor ? getHealthCenterById(doctor.centroId) : null;

    // Generar fechas disponibles
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const formatDisplayDate = (date: Date): string => {
        return date.toLocaleDateString('es-VE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    // Manejar selección de fecha
    const handleDateSelect = (dateType: 'today' | 'tomorrow' | 'custom') => {
        let date: Date;
        let label: string;

        switch (dateType) {
            case 'today':
                date = today;
                label = `Hoy, ${formatDisplayDate(today)}`;
                break;
            case 'tomorrow':
                date = tomorrow;
                label = `Mañana, ${formatDisplayDate(tomorrow)}`;
                break;
            default:
                // Para el demo, usamos pasado mañana
                date = new Date(today);
                date.setDate(date.getDate() + 3);
                label = formatDisplayDate(date);
        }

        setSelectedDate(formatDate(date));
        setSelectedDateLabel(label);
        setStep('shift');
    };

    // Manejar selección de turno
    const handleShiftSelect = (shift: Shift) => {
        setSelectedShift(shift);
        setStep('confirm');
    };

    // Confirmar y procesar la cita
    const handleConfirm = async () => {
        if (!doctor || !user || !selectedShift) return;

        setStep('result');

        const appointment = await addAppointment({
            usuarioId: user.id,
            doctorId: doctor.id,
            centroId: doctor.centroId,
            especialidadId: doctor.especialidadId,
            fecha: selectedDate,
            turno: selectedShift,
            estado: AppointmentStatus.PENDIENTE, // Se actualizará en el contexto
        });

        const isSuccess = appointment.estado === AppointmentStatus.RESERVADA;

        setResult({
            success: isSuccess,
            status: appointment.estado,
            message: isSuccess
                ? '¡Su cita ha sido reservada exitosamente!'
                : appointment.motivoRechazo || 'No fue posible reservar la cita',
        });
    };

    // Volver al paso anterior
    const handleBack = () => {
        switch (step) {
            case 'shift':
                setStep('date');
                setSelectedDate('');
                break;
            case 'confirm':
                setStep('shift');
                setSelectedShift(null);
                break;
            default:
                onNavigate('home');
        }
    };

    if (!doctor) {
        return (
            <div className="min-h-screen bg-salud-fondo">
                <Navbar onHomeClick={() => onNavigate('home')} onLogout={onLogout} />
                <main className="max-w-2xl mx-auto px-4 py-6">
                    <Card className="text-center py-12">
                        <div className="text-5xl mb-4">❓</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            No hay doctor seleccionado
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Primero debe buscar y seleccionar un especialista
                        </p>
                        <Button variant="primary" onClick={() => onNavigate('search')}>
                            Buscar Especialista
                        </Button>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-salud-fondo">
            <Navbar onHomeClick={() => onNavigate('home')} onLogout={onLogout} />

            <main className="max-w-2xl mx-auto px-4 py-6">
                {step !== 'result' && (
                    <BackButton onClick={handleBack} className="mb-4" />
                )}

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        📅 Agendar Cita
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Con: <strong>{doctor.nombre}</strong>
                    </p>
                </div>

                {/* Info del doctor seleccionado */}
                <Card className="mb-6 !p-4 bg-salud-primario-claro border-salud-primario">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">
                            {doctor.nombre.includes('Dra.') ? '👩‍⚕️' : '👨‍⚕️'}
                        </div>
                        <div>
                            <p className="font-semibold text-salud-primario">{doctor.nombre}</p>
                            <p className="text-sm text-gray-600">
                                {specialty?.icono} {specialty?.nombre} • {center?.nombre}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Paso 1: Selección de Fecha */}
                {step === 'date' && (
                    <div className="animate-fade-in">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Paso 1: ¿Cuándo desea su cita?
                        </h2>
                        <div className="grid gap-4">
                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                                onClick={() => handleDateSelect('today')}
                                leftIcon={<span className="text-2xl">📆</span>}
                            >
                                <span className="flex-1 text-left ml-2">
                                    <span className="block font-bold">Hoy</span>
                                    <span className="block text-sm opacity-70">
                                        {formatDisplayDate(today)}
                                    </span>
                                </span>
                            </Button>

                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                                onClick={() => handleDateSelect('tomorrow')}
                                leftIcon={<span className="text-2xl">🗓️</span>}
                            >
                                <span className="flex-1 text-left ml-2">
                                    <span className="block font-bold">Mañana</span>
                                    <span className="block text-sm opacity-70">
                                        {formatDisplayDate(tomorrow)}
                                    </span>
                                </span>
                            </Button>

                            <Button
                                variant="secondary"
                                size="lg"
                                fullWidth
                                onClick={() => handleDateSelect('custom')}
                                leftIcon={<span className="text-2xl">📅</span>}
                            >
                                <span className="flex-1 text-left ml-2">
                                    <span className="block font-bold">Elegir otro día</span>
                                    <span className="block text-sm opacity-70">
                                        Ver más opciones disponibles
                                    </span>
                                </span>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Paso 2: Selección de Turno */}
                {step === 'shift' && (
                    <div className="animate-fade-in">
                        <div className="bg-green-50 rounded-xl p-3 mb-4">
                            <p className="text-sm text-green-700">
                                ✓ <strong>Fecha:</strong> {selectedDateLabel}
                            </p>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Paso 2: ¿En qué turno prefiere?
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Card
                                hoverable
                                onClick={() => handleShiftSelect(Shift.MANANA)}
                                className="text-center cursor-pointer"
                            >
                                <div className="text-5xl mb-3">🌅</div>
                                <h3 className="text-xl font-bold text-gray-800">Mañana</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {doctor.horario.manana}
                                </p>
                            </Card>

                            <Card
                                hoverable
                                onClick={() => handleShiftSelect(Shift.TARDE)}
                                className="text-center cursor-pointer"
                            >
                                <div className="text-5xl mb-3">🌆</div>
                                <h3 className="text-xl font-bold text-gray-800">Tarde</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {doctor.horario.tarde}
                                </p>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Paso 3: Confirmación */}
                {step === 'confirm' && (
                    <div className="animate-fade-in">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Paso 3: Confirme su cita
                        </h2>

                        <Card className="mb-6">
                            <h3 className="font-semibold text-gray-700 mb-4">
                                📋 Resumen de la cita
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Especialista</span>
                                    <span className="font-medium text-gray-800">{doctor.nombre}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Especialidad</span>
                                    <span className="font-medium text-gray-800">
                                        {specialty?.icono} {specialty?.nombre}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Centro</span>
                                    <span className="font-medium text-gray-800">{center?.nombre}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Fecha</span>
                                    <span className="font-medium text-gray-800">{selectedDateLabel}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Turno</span>
                                    <span className="font-medium text-gray-800">
                                        {selectedShift === Shift.MANANA ? '🌅 Mañana' : '🌆 Tarde'}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleConfirm}
                            isLoading={isLoading}
                        >
                            ✅ Confirmar y Agendar Cita
                        </Button>
                    </div>
                )}

                {/* Resultado */}
                {step === 'result' && (
                    <div className="animate-fade-in">
                        {isLoading ? (
                            <Card className="py-16 text-center">
                                <Spinner size="lg" text="Procesando su solicitud..." />
                                <p className="text-sm text-gray-400 mt-4">
                                    Conectando con el sistema de citas...
                                </p>
                            </Card>
                        ) : result && (
                            <Card className={`py-10 text-center ${result.success
                                    ? 'bg-gradient-to-b from-green-50 to-white'
                                    : 'bg-gradient-to-b from-red-50 to-white'
                                }`}>
                                <div className="text-6xl mb-4">
                                    {result.success ? '✅' : '❌'}
                                </div>
                                <h2 className={`text-2xl font-bold mb-2 ${result.success ? 'text-green-700' : 'text-red-700'
                                    }`}>
                                    {result.success ? '¡Cita Reservada!' : 'Cita Rechazada'}
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    {result.message}
                                </p>

                                <span className={`inline-block px-4 py-2 rounded-full font-medium ${result.success
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    Estado: {result.status}
                                </span>

                                <div className="mt-8 space-y-3">
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => onNavigate('appointments')}
                                    >
                                        Ver Mis Citas
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        onClick={() => onNavigate('home')}
                                    >
                                        Volver al Inicio
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default BookingWizardPage;
