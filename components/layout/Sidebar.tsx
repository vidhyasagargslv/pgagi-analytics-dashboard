// src/components/layout/Sidebar.tsx
'use client';

// Define ActiveView type here or import from a types file
export type ActiveView = 'dashboard_overview' | 'weather' | 'news' | 'finance' | 'profile' | 'preferences';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const linkClasses = (view: ActiveView) =>
    `w-full text-left ${activeView === view ? 'active font-semibold' : ''}`; // DaisyUI 'active' class for menu items

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-base-200 text-base-content">
      <div className="p-4">
        <h2 className="text-xl font-bold">Analytics Dashboard</h2>
      </div>
      <nav className="flex-1">
        <ul className="menu p-2 py-4 space-y-1"> {/* Adjusted padding and spacing */}
          <li className="menu-title px-4"><span>Dashboard</span></li>
          <li>
            <button onClick={() => setActiveView('dashboard_overview')} className={linkClasses('dashboard_overview')}>
              Overview
            </button>
          </li>

          <li className="menu-title px-4"><span>Data Sources</span></li>
          <li>
            <button onClick={() => setActiveView('weather')} className={linkClasses('weather')}>
              Weather
            </button>
          </li>
          <li>
            <button onClick={() => setActiveView('news')} className={linkClasses('news')}>
              News
            </button>
          </li>
          <li>
            <button onClick={() => setActiveView('finance')} className={linkClasses('finance')}>
              Finance
            </button>
          </li>

          <li className="menu-title px-4"><span>Settings</span></li>
          <li>
            <button onClick={() => setActiveView('profile')} className={linkClasses('profile')}>
              Profile
            </button>
          </li>
          <li>
            <button onClick={() => setActiveView('preferences')} className={linkClasses('preferences')}>
              Preferences
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}