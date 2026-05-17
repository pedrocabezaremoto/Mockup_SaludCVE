import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Doctor, HealthCenter, Specialty } from '../types';
import {
    doctors as fallbackDoctors,
    healthCenters as fallbackHealthCenters,
    specialties as fallbackSpecialties,
} from '../data/mockData';
import { fetchDoctors, fetchHealthCenters, fetchSpecialties } from '../services/api';

interface CatalogContextType {
    healthCenters: HealthCenter[];
    specialties: Specialty[];
    doctors: Doctor[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    getHealthCenterById: (id: string) => HealthCenter | undefined;
    getSpecialtyById: (id: string) => Specialty | undefined;
    getDoctorById: (id: string) => Doctor | undefined;
    getDoctorsByCenterAndSpecialty: (centerId: string, specialtyId: string) => Doctor[];
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [healthCenters, setHealthCenters] = useState<HealthCenter[]>(fallbackHealthCenters);
    const [specialties, setSpecialties] = useState<Specialty[]>(fallbackSpecialties);
    const [doctors, setDoctors] = useState<Doctor[]>(fallbackDoctors);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        setIsLoading(true);
        try {
            const [centers, specialtiesData, doctorsData] = await Promise.all([
                fetchHealthCenters(),
                fetchSpecialties(),
                fetchDoctors(),
            ]);
            setHealthCenters(centers);
            setSpecialties(specialtiesData);
            setDoctors(doctorsData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar el catálogo');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void refresh();
    }, []);

    const value = useMemo(
        () => ({
            healthCenters,
            specialties,
            doctors,
            isLoading,
            error,
            refresh,
            getHealthCenterById: (id: string) =>
                healthCenters.find((center) => center.id === id),
            getSpecialtyById: (id: string) =>
                specialties.find((specialty) => specialty.id === id),
            getDoctorById: (id: string) => doctors.find((doctor) => doctor.id === id),
            getDoctorsByCenterAndSpecialty: (centerId: string, specialtyId: string) =>
                doctors.filter(
                    (doctor) =>
                        doctor.centroId === centerId && doctor.especialidadId === specialtyId
                ),
        }),
        [healthCenters, specialties, doctors, isLoading, error]
    );

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = (): CatalogContextType => {
    const context = useContext(CatalogContext);
    if (!context) {
        throw new Error('useCatalog debe ser usado dentro de un CatalogProvider');
    }
    return context;
};
