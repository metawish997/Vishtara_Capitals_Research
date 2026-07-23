import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminChatbar from '../components/AdminChatbar';

const AdminLayout = ({ children }) => {
    useEffect(() => {
        document.body.classList.add('admin-dashboard-active');
        return () => {
            document.body.classList.remove('admin-dashboard-active');
        };
    }, []);

    return (
        <div className="min-h-screen w-full flex font-inter bg-slate-50 text-slate-800">

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

                {/* Top Header */}
                <AdminHeader />

                {/* Scrollable page content */}
                <main className="flex-1 overflow-y-auto bg-slate-50">
                    <div className="w-full">
                        {children || <Outlet />}
                    </div>
                </main>

                {/* Floating Chat Bubble */}
                <AdminChatbar />
            </div>
        </div>
    );
};

export default AdminLayout;