"use client"
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ActiveView } from '@/components/layout/Sidebar'; // Import ActiveView
import Weather from '@/components/weather/Weather'; // Adjust path if needed
import News from '@/components/News/News';         // Adjust path if needed
// Import Finance component when ready
// import Finance from '@/components/Finance/Finance';
import React, { useState } from 'react';

// Placeholder components for views not yet implemented
const DashboardOverviewContent = () => (
  <div className="p-6 bg-base-100 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
    <p>Welcome to your analytics dashboard. Here you'll find a summary of key metrics.</p>
    {/* Add more overview widgets here */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-primary text-primary-content">
            <div className="card-body">
                <h2 className="card-title">Active Users</h2>
                <p className="text-4xl font-bold">1,234</p>
            </div>
        </div>
        <div className="card bg-secondary text-secondary-content">
            <div className="card-body">
                <h2 className="card-title">Total Sales</h2>
                <p className="text-4xl font-bold">$56,789</p>
            </div>
        </div>
    </div>
  </div>
);

const FinanceContent = () => (
  <div className="p-6 bg-base-100 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-6">Finance</h1>
    <p>Financial data and charts will be displayed here. (Coming Soon)</p>
  </div>
);
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
  const [activeView, setActiveView] = useState<ActiveView>('weather');

  const renderContent = (activeView: ActiveView) => {
    switch (activeView) {
      case 'dashboard_overview':
        return <DashboardOverviewContent />;
      case 'weather':
        return <Weather />;
      case 'news':
        return <News />;
      case 'finance':
        return <FinanceContent />;
      case 'profile':
        return <ProfileContent />;
      case 'preferences':
        return <PreferencesContent />;
      default: // Default to weather as a fallback if something unexpected happens
        return <Weather />;
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {/* The individual components (Weather, News) should manage their own main titles */}
      {renderContent(activeView)}
    </DashboardLayout>
  );
}