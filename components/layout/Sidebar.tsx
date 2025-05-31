'use client';

// Define ActiveView type here or import from a types file
export type ActiveView = 'DashboardOverviewContent' | 'weather' | 'news' | 'finance' | 'profile' | 'preferences';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({ activeView, setActiveView, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const linkClasses = (view: ActiveView) =>
    `w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 hover:bg-base-300 ${
      activeView === view 
        ? 'bg-primary text-primary-content font-semibold shadow-lg' 
        : 'text-base-content hover:scale-105'
    }`;

  const iconClasses = "w-5 h-5 flex-shrink-0";

  const handleMenuItemClick = (view: ActiveView) => {
    setActiveView(view);
    // Close mobile menu when an item is selected
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile overlay backdrop
  const mobileOverlay = isMobileMenuOpen && (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      onClick={() => setIsMobileMenuOpen?.(false)}
    />
  );

  return (
    <>
      {mobileOverlay}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        flex flex-col w-72 h-screen bg-gradient-to-b from-base-200 to-base-300 
        text-base-content shadow-xl border-r border-base-300
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>      <div className="p-6 border-b border-base-300 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Analytics Dashboard
            </h2>
            <p className="text-xs text-base-content/70">Data Insights Platform</p>
          </div>
          {/* Mobile close button */}
          <button 
            className="md:hidden btn btn-sm btn-ghost btn-circle"
            onClick={() => setIsMobileMenuOpen?.(false)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div><nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Dashboard Section */}
          <div>
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3 px-2">
              Dashboard
            </h3>
            <div className="space-y-2">
              <button onClick={() => handleMenuItemClick('DashboardOverviewContent')} className={linkClasses('DashboardOverviewContent')}>
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>Overview</span>
                {activeView === 'DashboardOverviewContent' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {/* Data Sources Section */}
          <div>
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3 px-2">
              Data Sources
            </h3>
            <div className="space-y-2">              <button onClick={() => handleMenuItemClick('weather')} className={linkClasses('weather')}>
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span>Weather</span>
                {activeView === 'weather' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button onClick={() => handleMenuItemClick('news')} className={linkClasses('news')}>
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
                <span>News</span>
                {activeView === 'news' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button onClick={() => handleMenuItemClick('finance')} className={linkClasses('finance')}>
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Finance</span>
                {activeView === 'finance' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div>
            <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3 px-2">
              Settings
            </h3>
            <div className="space-y-2">              <button onClick={() => handleMenuItemClick('profile')} className={linkClasses('profile')}>
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
                {activeView === 'profile' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button onClick={() => handleMenuItemClick('preferences')} className={linkClasses('preferences')}>
                <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Preferences</span>
                {activeView === 'preferences' && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-base-300 bg-base-300/50">
        <div className="flex items-center gap-3 text-xs text-base-content/70">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Build by Vidhya Sagar</span>
          <div className="ml-auto">
            v1.0.0
          </div>        </div>
      </div>
    </aside>
    </>
  );
}