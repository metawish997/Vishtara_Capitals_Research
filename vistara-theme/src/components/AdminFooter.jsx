import React from 'react';

const AdminFooter = () => {
    return (
        <div className="bg-[var(--bg)] border-t border-[var(--border)] py-3 px-6">
            <div className="text-[11px] font-bold text-[var(--text-secondary)] text-center tracking-tight">
                © {new Date().getFullYear()} Metawish.ai - All rights reserved
            </div>
        </div>
    );
};

export default AdminFooter;