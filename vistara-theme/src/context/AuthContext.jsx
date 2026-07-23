import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        const token = authService.getToken();
        if (token) {
            try {
                const data = await authService.getMe();
                if (data.data) {
                    setUser(data.data);
                    localStorage.setItem('bsmr_user', JSON.stringify(data.data));
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                authService.logout();
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateProfile = async (userData) => {
        try {
            const data = await authService.updateProfile(userData);
            if (data.data) {
                setUser(data.data);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const sendUpdateOtp = async (data) => {
        try {
            return await authService.sendUpdateOtp(data);
        } catch (error) {
            throw error;
        }
    };

    const verifyUpdateContact = async (data) => {
        try {
            const res = await authService.verifyUpdateContact(data);
            if (res.user) {
                setUser(res.user);
            }
            return res;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            if (data.user) {
                setUser(data.user);
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const forgotPassword = async (data) => {
        try {
            return await authService.forgotPassword(data);
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (data) => {
        try {
            return await authService.resetPassword(data);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile, sendUpdateOtp, verifyUpdateContact, checkAuth, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};
