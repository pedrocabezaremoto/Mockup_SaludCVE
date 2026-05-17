/**
 * SaludConecta VE - Contexto de Autenticación
 * Representa: Módulo de Acceso (Modo Demo)
 * 
 * Maneja la autenticación simulada para los usuarios de prueba:
 * - María (caso de éxito)
 * - Pablo (caso de rechazo)
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, User } from '../types';
import { demoUsers } from '../data/mockData';
import { loginUser } from '../services/api';

// Crear el contexto con valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación
 * Envuelve la aplicación para proveer estado de autenticación global
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * Simula el login de un usuario demo
     * @param userId - ID del usuario ('user-maria' o 'user-pablo')
     */
    const login = async (userId: string): Promise<User | null> => {
        try {
            const apiUser = await loginUser(userId);
            setUser(apiUser);
            setIsAuthenticated(true);
            return apiUser;
        } catch {
            const foundUser = demoUsers.find(u => u.id === userId);
            if (foundUser) {
                setUser(foundUser);
                setIsAuthenticated(true);
                return foundUser;
            }
        }

        setUser(null);
        setIsAuthenticated(false);
        return null;
    };

    /**
     * Cierra la sesión del usuario actual
     */
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @throws Error si se usa fuera del AuthProvider
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
