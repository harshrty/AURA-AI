import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
   
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar needs to be handled carefully in your Sidebar component (hidden on mobile or a hamburger menu) */}
      <Sidebar />
      
      {/* 1. flex-1 allows the main area to take up remaining space
          2. p-4 on mobile (smaller) and p-8 on desktop (md:)
          3. h-full and overflow-y-auto ensures only the chat/content area scrolls
      */}
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-8">
        
        {/* max-w-6xl is great for desktop, but w-full ensures it fits the phone screen */}
        <div className="max-w-6xl mx-auto w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;