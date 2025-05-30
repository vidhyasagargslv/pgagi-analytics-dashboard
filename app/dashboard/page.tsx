"use client"
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ActiveView } from '@/components/layout/Sidebar';
import Weather from '@/components/weather/Weather';
import News from '@/components/News/News';
import React, { useState } from 'react';
import FinanceDashboard from '@/components/Finance/FinanceDashboard';
import DashboardOverviewContent from './DashboardOverviewContent';
const ProfileContent = () => (
  <div className="p-6 bg-base-100 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-6">User Profile</h1>
    <p>User profile settings and information. (Coming Soon)</p>
  </div>
);
const PreferencesContent = () => (
  <div className="p-6 bg-base-100 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-6">Preferences</h1>
    <p>Application preferences and customization. (Coming Soon)</p>
  </div>
);


export default function DashboardPage() {
  const [activeView, setActiveView] = useState<ActiveView>('DashboardOverviewContent');

  const renderContent = (activeView: ActiveView) => {
    switch (activeView) {
      case 'DashboardOverviewContent':
        return <DashboardOverviewContent />;
      case 'weather':
        return <Weather />;
      case 'news':
        return <News />;
      case 'finance':
        return <FinanceDashboard />;
      case 'profile':
        return <ProfileContent />;
      case 'preferences':
        return <PreferencesContent />;
      default: 
        return <DashboardOverviewContent />;
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderContent(activeView)}
    </DashboardLayout>
  );
}