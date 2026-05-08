import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Contacts from './components/Contacts';
import SalesPipeline from './components/SalesPipeline';
import Settings from './components/Settings';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5fccb1]"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'leads' && <Dashboard />} {/* For now, same as dashboard */}
        {activeTab === 'contacts' && <Contacts />}
        {activeTab === 'pipeline' && <SalesPipeline />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
