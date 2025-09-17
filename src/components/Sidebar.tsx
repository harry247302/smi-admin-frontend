import React from 'react';
import { 
  BookOpen, 
  Settings, 
  Users, 
  Search,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const menuItems = [
    { id: 'blogs', label: 'Blog Management', icon: BookOpen },
    { id: 'services', label: 'Service Management', icon: Settings },
    { id: 'leads', label: 'Lead Management', icon: Users },
    { id: 'seo', label: 'SEO Management', icon: Search },
  ];

  // 🔑 Logout API Call
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8003/admin/logout", {
        method: "POST",
        credentials: "include", // include cookies
      });

      const data = await res.json();
      if (data.success) {
        alert("Logged out successfully");
        // Redirect to login page (adjust your route accordingly)
        window.location.href = "/login";
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong during logout");
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-blue-700 p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-6 py-3 text-left transition-colors duration-200
                  ${activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}

          {/* 🔴 Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-left transition-colors duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
