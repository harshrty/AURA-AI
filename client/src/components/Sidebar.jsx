import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { MessageSquare, LayoutDashboard, Brain, LogOut, Heart } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Aura Chat', icon: MessageSquare, path: '/chat' },
    { name: 'Mood Tracker', icon: Heart, path: '/mood' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-indigo-600 p-2 rounded-xl">
          <Brain className="text-white size-6" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
          Aura 3.0
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="block">
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 rounded-xl transition-all ${
                  isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600"
                }`}
              >
                <item.icon className="size-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-200 pt-4">
        <div className="px-3 mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
          {/* Changed to username to match your backend/context */}
          <p className="text-sm font-medium text-slate-700 truncate">{user?.username || "User"}</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={logout}
          className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
        >
          <LogOut className="size-5" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;