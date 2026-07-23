import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserDashboardSidebar from '../components/UserDashboardSidebar';
import UserDashboardHeader from '../components/UserDashboardHeader';
import FloatingSupportButton from '../components/FloatingSupportButton';

const UserDashboardLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const location = useLocation();
    const isFullBleed = location.pathname.includes('/option-chain') || location.pathname.includes('/watchlist');

    return (
        <div className="user-theme flex w-full h-screen overflow-hidden font-inter transition-colors duration-300" style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
            {/* Sidebar (Responsive: Bottom nav on mobile, Side nav on desktop) */}
            <UserDashboardSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full mb-16 md:mb-0">
                {/* Header */}
                <header className="flex-shrink-0">
                    <UserDashboardHeader />
                </header>

                {/* Dynamic Content */}
                <main className={`flex-1 overflow-y-auto ${isFullBleed ? 'p-0' : 'p-4 md:p-6 pb-20 md:pb-6'}`}>
                    {children || <Outlet />}
                </main>

                <FloatingSupportButton />
            </div>
        </div>
    );
};

export default UserDashboardLayout;