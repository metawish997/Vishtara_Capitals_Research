import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Initial theme from localStorage or default 'light'
    const [theme, setThemeState] = useState(() => {
        const savedTheme = localStorage.getItem('bsmr_theme');
        return savedTheme === 'black-green' ? 'black-green' : 'light';
    });

    const setTheme = (newTheme) => {
        if (newTheme === 'black-green' || newTheme === 'light') {
            setThemeState(newTheme);
            localStorage.setItem('bsmr_theme', newTheme);
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'black-green' ? 'light' : 'black-green');
    };

    // Optional: Synchronize root class name and data-theme attribute for global styling hooks
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'black-green') {
            root.classList.add('theme-black-green');
            root.setAttribute('data-theme', 'dark');
        } else {
            root.classList.remove('theme-black-green');
            root.setAttribute('data-theme', 'light');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
