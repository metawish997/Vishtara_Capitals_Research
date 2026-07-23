import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { isAdminUser } from '../utils/rbac';
import { MessageSquare } from 'lucide-react';

const AdminChatbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = isAdminUser(user);

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => navigate('/admin/support-chat')}
        title="Support Chat"
        className="
          h-12 w-12 rounded-xl bg-[#011d52] text-white
          shadow-lg hover:shadow-xl hover:-translate-y-0.5
          flex items-center justify-center
          transition-all duration-200
          border border-[#011d52]/20
        "
      >
        <MessageSquare className="w-5 h-5" fill="currentColor" />
      </button>
    </div>
  );
};

export default AdminChatbar;
