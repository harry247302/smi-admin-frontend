import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen, activeTab }) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'blogs': return 'Blog Management';
      case 'services': return 'Service Management';
      case 'leads': return 'Lead Management';
      case 'seo': return 'SEO Management';
      default: return 'Admin Panel';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-semibold text-gray-800 ml-4 lg:ml-0">
            {getTitle()}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="flex items-center space-x-2 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="w-5 h-5" />
            <span className="hidden sm:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;