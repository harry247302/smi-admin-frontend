import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BlogManagement from './pages/BlogManagement';
import ServiceManagement from './pages/ServiceManagement';
import LeadManagement from './pages/LeadManagement';
import SEOManagement from './pages/SEOManagement';
import ProtectedRoute from './protected/page';
import Login from './components/Login';


function App() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute >
              <div className="flex h-screen bg-gray-50">
                <Sidebar 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header 
                    setSidebarOpen={setSidebarOpen}
                    activeTab={activeTab}
                  />
                  <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                      {activeTab === 'blogs' && <BlogManagement />}
                      {activeTab === 'services' && <ServiceManagement />}
                      {activeTab === 'leads' && <LeadManagement />}
                      {activeTab === 'seo' && <SEOManagement />}
                    </div>
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
