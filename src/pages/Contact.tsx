/**
 * SaludConecta VE - Pantalla de Contacto
 * Representa: UC6 - Contacto
 * 
 * Botones de redirección a WhatsApp de cada centro de salud
 * Permite comunicación alterna a los usuarios con el centro de salud
 * (Simulado para presentación académica)
 */

import React from 'react';
import { Navbar, BackButton } from '../components/layout';
import { Card, Button } from '../components/ui';
import { useCatalog } from '../contexts/CatalogContext';
import { 
    ChatIcon, 
    InfoIcon, 
    HospitalIcon, 
    LocationIcon, 
    PhoneIcon, 
    WarningIcon,
    DocumentIcon
} from '../components/icons';

type Page = 'home' | 'search' | 'booking' | 'appointments' | 'contact';

interface ContactPageProps {
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

/**
 * URL de WhatsApp Business para testing
 */
const WA_BUSINESS_URL = 'https://wa.me/message/SLKHQMQLGM3AI1';

/**
 * Pantalla de contacto con los centros de salud
 * Muestra lista de centros con botones de WhatsApp
 */
const ContactPage: React.FC<ContactPageProps> = ({
    onNavigate,
    onLogout,
}) => {
    const { healthCenters } = useCatalog();
    // Redirigir a WhatsApp Business
    const handleWhatsAppClick = () => {
        window.open(WA_BUSINESS_URL, '_blank');
    };

    return (
        <div className="min-h-screen bg-salud-fondo">
            <Navbar onHomeClick={() => onNavigate('home')} onLogout={onLogout} />

            <main className="max-w-2xl mx-auto px-4 py-6">
                <BackButton onClick={() => onNavigate('home')} className="mb-4" />

                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <ChatIcon size="lg" className="text-salud-accion" /> Contacto
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Comuníquese directamente con los centros de salud vía WhatsApp
                    </p>
                </div>

                {/* Nota informativa */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <InfoIcon size="lg" className="text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-green-800">
                                Comunicación directa
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                                Use WhatsApp para consultas sobre disponibilidad, emergencias
                                o cualquier información adicional sobre los servicios médicos.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de centros con botón de WhatsApp */}
                <div className="space-y-4">
                    {healthCenters.map((center, index) => (
                        <Card
                            key={center.id}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                {/* Info del centro */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <HospitalIcon size="lg" className="text-salud-primario" />
                                        <h3 className="font-bold text-lg text-gray-800">
                                            {center.nombre}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                        <LocationIcon size="sm" /> {center.direccion}
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <PhoneIcon size="sm" /> {center.telefono}
                                    </p>
                                    {center.colapsado && (
                                        <span className="inline-flex items-center gap-1 mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                            <WarningIcon size="sm" /> Alta demanda
                                        </span>
                                    )}
                                </div>

                                {/* Botón de WhatsApp */}
                                <div className="flex-shrink-0">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleWhatsAppClick()}
                                        leftIcon={
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg>
                                        }
                                        className="!bg-green-500 hover:!bg-green-600"
                                    >
                                        WhatsApp
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Nota de demo */}
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 flex items-start gap-2">
                        <DocumentIcon size="sm" className="flex-shrink-0 mt-0.5" />
                        <span>
                            <strong>Nota de prueba:</strong> Los botones de WhatsApp ahora
                            redirijen a tu WhatsApp Business para testing. En producción, se
                            conectarían a los números de teléfono específicos de cada centro.
                        </span>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ContactPage;
