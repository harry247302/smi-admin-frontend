import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BlogManagement from './pages/BlogManagement';
import ServiceManagement from './pages/ServiceManagement';
import LeadManagement from './pages/LeadManagement';
import SEOManagement from './pages/SEOManagement';

function App() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'blogs':
        return <BlogManagement />;
      case 'services':
        return <ServiceManagement />;
      case 'leads':
        return <LeadManagement />;
      case 'seo':
        return <SEOManagement />;
      default:
        return <BlogManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header 
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;