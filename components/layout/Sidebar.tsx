'use client';

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-base-200">
      <div className="p-4">
        <h2 className="text-xl font-bold">Analytics Dashboard</h2>
      </div>
      <nav className="flex-1 px-2">
        <ul className="menu p-2 bg-base-200 rounded-box">
          <li className="menu-title">Dashboard</li>
          
          
          <li className="menu-title">Data Sources</li>
          <li><a>Weather</a></li>
          <li><a>News</a></li>
          <li><a>Finance</a></li>
          
          <li className="menu-title">Settings</li>
          <li><a>Profile</a></li>
          <li><a>Preferences</a></li>
        </ul>
      </nav>
    </aside>
  );
}