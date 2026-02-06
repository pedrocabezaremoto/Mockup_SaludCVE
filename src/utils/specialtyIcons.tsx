/**
 * SaludConecta VE - Helper de Iconos de Especialidades
 * Mapea los IDs de especialidades a sus respectivos iconos SVG
 */

import React from 'react';
import {
    PediatricsIcon,
    GynecologyIcon,
    InternalMedicineIcon,
    CardiologyIcon,
    SurgeryIcon
} from '../components/icons';

interface IconMapType {
    [key: string]: React.ReactElement;
}

// Mapeo de especialidades a componentes SVG
export const specialtyIconMap: IconMapType = {
    'pediatria': <PediatricsIcon size="md" />,
    'ginecologia': <GynecologyIcon size="md" />,
    'medicina-interna': <InternalMedicineIcon size="md" />,
    'cardiologia': <CardiologyIcon size="md" />,
    'cirugia-general': <SurgeryIcon size="md" />
};

/**
 * Obtiene el icono SVG correspondiente a una especialidad
 * @param specialtyId - ID de la especialidad
 * @returns Componente SVG del icono
 */
export const getSpecialtyIcon = (specialtyId: string): React.ReactElement | null => {
    return specialtyIconMap[specialtyId] || null;
};
