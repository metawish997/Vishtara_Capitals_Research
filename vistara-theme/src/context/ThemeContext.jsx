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
        // Default to 'black-green' (dark mode) if not explicitly set to 'light'
        return savedTheme === 'light' ? 'light' : 'black-green';
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

    // Synchronize global theme classes and styles
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'black-green') {
            root.classList.add('theme-black-green');
            root.setAttribute('data-theme', 'dark');
            document.body.classList.add('high-contrast');
            
            if (!document.getElementById("high-contrast-styles")) {
                const style = document.createElement("style");
                style.id = "high-contrast-styles";
                style.innerHTML = `
                  body.high-contrast:not(.admin-dashboard-active) {
                    background-color: #121A24 !important;
                    color: #E2E8F0 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) p:not(.tp-fi-hero-content p):not(.tp-cn-success-item p), 
                  body.high-contrast:not(.admin-dashboard-active) span:not(.tp-fi-hero-content span):not(.tp-cn-success-item span),
                  body.high-contrast:not(.admin-dashboard-active) h1,
                  body.high-contrast:not(.admin-dashboard-active) h2,
                  body.high-contrast:not(.admin-dashboard-active) h3:not(.tp-fi-hero-content h3):not(.tp-cn-success-item h3),
                  body.high-contrast:not(.admin-dashboard-active) h4,
                  body.high-contrast:not(.admin-dashboard-active) h5,
                  body.high-contrast:not(.admin-dashboard-active) h6,
                  body.high-contrast:not(.admin-dashboard-active) li,
                  body.high-contrast:not(.admin-dashboard-active) td,
                  body.high-contrast:not(.admin-dashboard-active) th,
                  body.high-contrast:not(.admin-dashboard-active) strong,
                  body.high-contrast:not(.admin-dashboard-active) b,
                  body.high-contrast:not(.admin-dashboard-active) a:not(.tp-btn-event) {
                    color: #F8FAFC !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-btn-border,
                  body.high-contrast:not(.admin-dashboard-active) .tp-btn-border .button-text {
                    color: #F8FAFC !important;
                    border-color: #F8FAFC !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-btn-border img {
                    filter: brightness(0) invert(1);
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-footer-area,
                  body.high-contrast:not(.admin-dashboard-active) .tp-header-area,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-about-ptb,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-testimonial-ptb,
                  body.high-contrast:not(.admin-dashboard-active) .tp-about-vision-ptb {
                    background-color: #0A0F15 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-service-item,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-stories-item,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-value-graph,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-about-thumb-shape,
                  body.high-contrast:not(.admin-dashboard-active) .tp-header-lan-content,
                  body.high-contrast:not(.admin-dashboard-active) .tp-about-vision-item,
                  body.high-contrast:not(.admin-dashboard-active) .tp-cn-blog-item,
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card {
                    background-color: #1E293B !important;
                    border-color: #334155 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-contact-city-item {
                    background-color: #1E293B !important;
                    border-color: #334155 !important;
                    border: 1px solid #334155 !important;
                    padding: 40px 30px !important;
                    border-radius: 12px !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-contact-city-item-dvdr {
                    border-color: #334155 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) input,
                  body.high-contrast:not(.admin-dashboard-active) textarea {
                    background-color: #0F172A !important;
                    border-color: #334155 !important;
                    color: #F8FAFC !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) {
                    --policy-sidebar-text: #F8FAFC;
                  }
                  body.high-contrast:not(.admin-dashboard-active) input::placeholder,
                  body.high-contrast:not(.admin-dashboard-active) textarea::placeholder {
                    color: #94A3B8 !important;
                    opacity: 1 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card table,
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card table tbody,
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card table thead,
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card table tr,
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card table td,
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card table th {
                    background-color: transparent !important;
                    border-color: #334155 !important;
                    color: #E2E8F0 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card table thead tr th {
                     background-color: #334155 !important;
                     color: #F8FAFC !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .payments-page-card table tbody tr:nth-child(even) td {
                     background-color: rgba(255, 255, 255, 0.05) !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .bank-item {
                    border-color: #334155 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .bank-item-val {
                    color: #E2E8F0 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .payment-note,
                  body.high-contrast:not(.admin-dashboard-active) .payment-upi-id,
                  body.high-contrast:not(.admin-dashboard-active) .qr-container {
                    background-color: #0F172A !important;
                    border-color: #334155 !important;
                    color: #E2E8F0 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .payment-note strong,
                  body.high-contrast:not(.admin-dashboard-active) .payment-note a,
                  body.high-contrast:not(.admin-dashboard-active) .payment-upi-id span,
                  body.high-contrast:not(.admin-dashboard-active) .payment-upi-id strong {
                    color: #E2E8F0 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-cn-blog-item:hover {
                    background-color: #0F172A !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-cn-blog-item .tp-btn {
                    background-color: #334155 !important;
                    color: #F8FAFC !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-banner-content {
                    background-color: transparent !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-about-content {
                    background-color: #1E293B !important;
                    border-color: #334155 !important;
                    padding: 40px !important;
                    border-radius: 12px !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-stories-item {
                     height: 420px !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-faq-wrap .accordion-items,
                  body.high-contrast:not(.admin-dashboard-active) .tp-faq-wrap .accordion-buttons {
                    background-color: transparent !important;
                    color: #F8FAFC !important;
                    border-color: #334155 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-faq-wrap .accordion-body p {
                    color: #F8FAFC !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-faq-icon::before,
                  body.high-contrast:not(.admin-dashboard-active) .tp-faq-icon::after {
                    background-color: #F8FAFC !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-faq-support,
                  body.high-contrast:not(.admin-dashboard-active) .postbox-details-quote,
                  body.high-contrast:not(.admin-dashboard-active) .tp-blog-details-info {
                     background-color: #0A0F15 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-stories-item-content span,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-value-graph-date,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-service-item p {
                     color: #94A3B8 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-service-item-icon svg path,
                  body.high-contrast:not(.admin-dashboard-active) svg path:not(.tp-cn-success-item svg path):not(.tp-cn-success-item-wrap svg path):not(.tp-cn-success-item-icon svg path) {
                    fill: #E2E8F0;
                    stroke: #E2E8F0;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-hero-content h3,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-hero-content p,
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-hero-content span {
                     color: #222F30 !important;
                  }
                  body.high-contrast:not(.admin-dashboard-active) .tp-fi-brand-slider-item {
                     color: #F8FAFC !important;
                  }
                `;
                document.head.appendChild(style);
            }
        } else {
            root.classList.remove('theme-black-green');
            root.setAttribute('data-theme', 'light');
            document.body.classList.remove('high-contrast');
            const style = document.getElementById("high-contrast-styles");
            if (style) style.remove();
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

