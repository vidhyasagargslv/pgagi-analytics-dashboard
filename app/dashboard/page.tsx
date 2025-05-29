import { DashboardLayout } from '@/components/layout/DashboardLayout';
import  WeatherWidget  from '@/components/layout/WeatherWidget'
import  NewsWidget  from '@/components/layout/NewsWidget';
import  FinanceWidget  from '@/components/layout/FinanceWidget';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
        </div>
        
        {/* Weather Widget */}
        <div className="col-span-1">
          <WeatherWidget />
        </div>

        {/* News Widget */}
        <div className="col-span-1">
          <NewsWidget />
        </div>

        {/* Finance Widget */}
        <div className="col-span-1">
          <FinanceWidget />
        </div>
      </div>
    </DashboardLayout>
  );
}