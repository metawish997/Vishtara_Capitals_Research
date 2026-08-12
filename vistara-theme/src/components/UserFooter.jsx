import React, { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import footerService from '../services/footerService';
import headerService from '../services/headerService';

const UserFooter = memo(({ brand: propBrand, settings: propSettings, socials: propSocials = [], columns: propColumns = [] }) => {
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);

    const [brand, setBrand] = useState(propBrand || null);
    const [settings, setSettings] = useState(propSettings || null);
    const [socials, setSocials] = useState(propSocials && propSocials.length > 0 ? propSocials : null);
    const [columns, setColumns] = useState(propColumns && propColumns.length > 0 ? propColumns : null);
    const [headerSettings, setHeaderSettings] = useState(null);

    const isExternalLink = (url) => {
        return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'));
    };

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const res = await footerService.getFullData();
                const data = res?.data?.data;
                if (data) {
                    if (data.brand) setBrand(data.brand);
                    if (data.settings) setSettings(data.settings);
                    if (data.socials) setSocials(data.socials);
                    if (data.columns) setColumns(data.columns);
                }
            } catch (err) {
                console.error('Error fetching dynamic footer data:', err);
            }
        };

        if (!propBrand || !propSettings || !propSocials || propSocials.length === 0 || !propColumns || propColumns.length === 0) {
            fetchFooterData();
        }

        headerService.getSettings().then(res => setHeaderSettings(res.data?.data)).catch(() => { });
    }, [propBrand, propSettings, propSocials, propColumns]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    const websiteName = settings?.website_name || 'The Rapid Investors';

    const renderSocialLinks = (justify = 'flex-start') => {
        const inst = socials?.find(s => s.icon?.toLowerCase().includes('instagram'));
        const fb = socials?.find(s => s.icon?.toLowerCase().includes('facebook'));
        const items = [
            { name: 'Instagram', url: inst ? inst.url : 'https://instagram.com/therapidinvestors' },
            { name: 'Facebook', url: fb ? fb.url : 'https://facebook.com/therapidinvestors' }
        ];
        return (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '16px 24px', justifyContent: justify }}>
                {items.map((social, idx) => (
                    <li key={idx}>
                        <a href={social.url} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s ease' }} className="hover:text-[var(--accent-soft)]">
                            {social.name} <span className="text-[10px]">↗</span>
                        </a>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <footer
            id="footer"
            ref={footerRef}
            style={{ padding: '64px 0 40px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'var(--primary-dark)' }}
            className="relative font-sans"
        >
            {/* Inline CSS overrides to match the premium theme layout on all screen sizes */}
            <style>{`
                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 60px;
                    margin-bottom: 40px;
                }
                .sebi-details-grid {
                    display: grid;
                    grid-template-columns: 4fr 6fr;
                    gap: 64px;
                }
                .regulatory-links-grid {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 12px 24px !important;
                }
                @media (max-width: 768px) {
                    .footer-grid {
                        display: flex !important;
                        flex-direction: column !important;
                        gap: 40px !important;
                        text-align: center !important;
                        margin-bottom: 40px !important;
                    }
                    .footer-logo-col div {
                        justify-content: flex-start !important;
                    }
                    .footer-logo-col p {
                        margin: 0 !important;
                    }
                    .footer-links-grid {
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                        gap: 30px !important;
                        text-align: left !important;
                    }
                    .sebi-details-grid {
                        grid-template-columns: 1fr !important;
                        gap: 32px !important;
                    }
                    .regulatory-links-grid {
                        grid-template-columns: 1fr !important;
                        gap: 12px !important;
                    }
                    .social-desktop-only {
                        display: none !important;
                    }
                    .social-mobile-only {
                        display: block !important;
                        margin-top: 16px;
                    }
                }
                @media (min-width: 769px) {
                    .social-mobile-only {
                        display: none !important;
                    }
                }
                @media (max-width: 480px) {
                    .footer-links-grid {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 16px !important;
                    }
                    .social-media-col {
                        grid-column: span 2;
                    }
                    .footer-logo-col {
                        text-align: center !important;
                    }
                    .footer-logo-col div {
                        justify-content: center !important;
                    }
                    .footer-logo-img {
                        height: 38px !important;
                    }
                    .footer-logo-img > svg {
                        height: 38px !important;
                    }
                }
            `}</style>

            {/* CONTAINER */}
            <div
                className={`mx-auto max-w-[1280px] px-6 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                {/* TOP GRID */}
                <div className="footer-grid">
                    {/* Column 1: Logo & Desc */}
                    <div className="footer-logo-col">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                            {brand?.icon_svg ? (
                                <div
                                    className="h-14 w-auto text-[var(--accent-soft)] flex items-center justify-center [&>svg]:h-14 [&>svg]:w-auto [&>svg]:object-contain [&>svg_path]:fill-[var(--accent-soft)] [&>svg_circle]:fill-[var(--accent-soft)] footer-logo-img"
                                    dangerouslySetInnerHTML={{ __html: brand.icon_svg }}
                                />
                            ) : brand?.image ? (
                                <img
                                    src={`/uploads/footer/${brand.image}`}
                                    alt={`${websiteName} Footer Logo`}
                                    className="h-14 w-auto object-contain rounded-xl footer-logo-img"
                                />
                            ) : headerSettings?.logo_svg ? (
                                <div
                                    className="h-14 w-auto flex items-center justify-center [&>svg]:h-14 [&>svg]:w-auto [&>svg]:object-contain footer-logo-img"
                                    dangerouslySetInnerHTML={{ __html: headerSettings.logo_svg }}
                                />
                            ) : (
                                <span className="text-2xl font-black tracking-tighter text-[var(--accent-soft)] footer-logo-img">Logo</span>
                            )}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: '1.7', maxWidth: '320px' }}>
                            {settings?.footer_tagline || 'Premium corporate finance & equity research. Trusted, compliant, and data-driven insights for serious investors.'}
                        </p>
                        <div className="social-mobile-only">
                            {renderSocialLinks('center')}
                        </div>
                    </div>

                    <div className="footer-links-grid" style={{ display: 'contents' }}>
                        {/* Column 2: Quick Links */}
                        <div>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '24px', color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    { text: 'Home', url: '/' },
                                    { text: 'About Us', url: '/about' },
                                    { text: 'Services', url: '/services' },
                                    { text: 'Blogs', url: '/blogs' },
                                    { text: 'Certificates', url: '/certificates' },
                                    { text: 'Contact Us', url: '/contact' }
                                ].map((link, idx) => (
                                    <li key={idx}>
                                        <Link to={link.url} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} className="hover:text-[var(--accent-soft)]">
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Legal */}
                        <div>
                            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '24px', color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {[
                                    { text: 'Privacy Policy', url: '/privacy-policy' },
                                    { text: 'Terms & Conditions', url: '/terms-and-conditions' },
                                    { text: 'Refund & Cancellation', url: '/refund-policy' },
                                    { text: 'Compliance', url: '/compliance' },
                                    { text: 'Registration & Grievance', url: '/registration-grievance' },
                                    { text: 'Disclaimer & Disclosure', url: '/disclaimer-disclosure' },
                                    { text: 'MITC & Scam Awareness', url: '/mitc-scam-awareness' },
                                    { text: 'Investor Charter', url: '/investor-charter' }
                                ].map((link, idx) => (
                                    <li key={idx}>
                                        <Link to={link.url} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.3s ease' }} className="hover:text-[var(--accent-soft)]">
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Social Media */}
                        <div className="social-desktop-only">
                            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '24px', color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Social Media</h4>
                            {renderSocialLinks('flex-start')}
                        </div>
                    </div>
                </div>

                {/* SEBI Compliance & Disclaimers Section */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '40px', paddingBottom: '40px', textAlign: 'left' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', opacity: 0.9, fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
                        For any grievances/support, contact our support team at <a href="mailto:support@therapidinvestors.com" style={{ color: 'var(--accent-soft)', textDecoration: 'none' }}>support@therapidinvestors.com</a> or call us at <a href="tel:+918269981108" style={{ color: 'var(--accent-soft)', textDecoration: 'none' }}>+91 8269981108</a>
                    </p>

                    <div className="sebi-details-grid" style={{ fontSize: '13px', lineHeight: '1.8', color: 'rgba(255,255,255,0.5)', opacity: 0.85 }}>
                        <div>
                            <h5 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEBI Registered Research Analyst Details</h5>
                            <p><strong>Registered Name:</strong> The Rapid Investors</p>
                            <p><strong>Type of registration:</strong> Individual</p>
                            <p><strong>Registration No.:</strong> INH000018559</p>
                            <p><strong>Validity:</strong> Perpetual</p>
                            <p><strong>BSE Enlistment No.:</strong> 6404</p>

                            <h5 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700', marginTop: '20px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Address</h5>
                            <p>OFFICE NO. 108 1ST FLOOR PRINCESS BUSINESS SKY PARK BLOCK NO. 22 SCH NO. 54 PU 3 VIJAY NAGAR INDORE Dist.-INDORE</p>
                        </div>

                        <div>
                            <p style={{ marginBottom: '16px' }}>
                                <strong>PRINCIPAL OFFICER:</strong> Subham Sharma | <strong>EMAIL:</strong> <a href="mailto:support@therapidinvestors.com" style={{ color: '#FFFFFF', textDecoration: 'none' }}>support@therapidinvestors.com</a> | <strong>CONTACT NO.:</strong> +91 8269981108 | <strong>SEBI LO.:</strong> Address: 104-105, Satguru Parinay, Opposite C-21 Mall, A.B. Road, Indore, Madhya Pradesh - 452010
                            </p>

                            <h5 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disclaimers</h5>
                            <ol style={{ paddingLeft: '16px', margin: 0 }} className="list-decimal">
                                <li>Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.</li>
                                <li>The securities quoted, if any are for illustration only and are not recommendatory.</li>
                                <li>Investments in securities market are subject to market risks. Read all the related documents carefully before investing.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Advisory & Accessibility Blocks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '12px', marginBottom: '40px', textAlign: 'left' }}>
                    {/* Advisory - Regulatory Links */}
                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '24px',
                    }}>
                        <h6 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Advisory – Regulatory Links</h6>
                        <p style={{ color: 'rgba(255,255,255,0.6)', opacity: 0.9, fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>
                            The links labelled <strong>SEBI Check</strong>, <strong>SEBI RA Check</strong>, <strong>SEBI Scores</strong>, and <strong>Smart ODR</strong> in our navigation direct you to official SEBI regulatory portals:
                        </p>
                        <ul className="regulatory-links-grid" style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', opacity: 0.85 }}>
                            <li><strong>SEBI Check</strong> – <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-soft)', textDecoration: 'underline' }}>Verify SEBI Registered Intermediaries</a></li>
                            <li><strong>SEBI RA Check</strong> – <a href="https://www.sebi.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-soft)', textDecoration: 'underline' }}>Check SEBI Research Analyst Registration</a></li>
                            <li><strong>SEBI Scores</strong> – <a href="https://scores.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-soft)', textDecoration: 'underline' }}>SEBI SCORES – Investor Grievance Redressal Portal</a></li>
                            <li><strong>Smart ODR</strong> – <a href="https://smartodr.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-soft)', textDecoration: 'underline' }}>Smart ODR – Online Dispute Resolution Platform</a></li>
                        </ul>
                    </div>

                    {/* Accessibility Statement */}
                    <div style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '16px',
                        padding: '24px',
                    }}>
                        <h6 style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Accessibility Statement</h6>
                        <p style={{ color: 'rgba(255,255,255,0.6)', opacity: 0.9, fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                            The Rapid Investors is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards. This website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. If you experience any accessibility barriers, please contact us at <a href="mailto:support@therapidinvestors.com" style={{ color: 'var(--accent-soft)', textDecoration: 'none' }}>support@therapidinvestors.com</a> or call <a href="tel:+918269981108" style={{ color: 'var(--accent-soft)', textDecoration: 'none' }}>+91 8269981108</a>. We welcome your feedback.
                        </p>
                    </div>
                </div>

                {/* Bottom Row */}
                <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', opacity: 0.8, fontSize: '14px' }}>
                        © 2026 THE RAPID INVESTORS. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', opacity: 0.8, fontSize: '14px' }}>Build by</span>
                        <a href="https://www.metawish.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '14px', textDecoration: 'none', transition: 'opacity 0.3s' }} className="hover:opacity-80">
                            MetaWish AI
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    );
});

UserFooter.displayName = 'UserFooter';

export default UserFooter;