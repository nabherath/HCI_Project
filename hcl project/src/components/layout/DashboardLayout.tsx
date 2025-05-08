import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Sofa,
  Save,
  FolderOpen,
  LogOut,
  User,
  Box
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Room Designer', href: '/room-designer', icon: Sofa },
    { name: '3D Viewer', href: '/3d-viewer', icon: Box },
    { name: 'Saved Layouts', href: '/saved-layouts', icon: FolderOpen },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-amber-100 border-r border-amber-300">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-amber-300">
            <h1 className="text-lg font-medium text-amber-900">Room Designer</h1>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-amber-900 text-white'
                      : 'text-amber-800 hover:bg-amber-200 hover:text-amber-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-white' : 'text-amber-800'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-amber-300 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 rounded-full text-amber-800 bg-amber-200 p-1" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-900">{user?.name || 'User'}</p>
                <Button 
                  variant="ghost" 
                  className="text-xs text-amber-700 hover:text-amber-900 flex items-center"
                  size="sm"
                  onClick={logout}
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden bg-amber-100 border-b border-amber-300 flex items-center justify-between p-4 w-full fixed top-0 z-10">
        <h1 className="text-lg font-medium text-amber-900">Room Designer</h1>
        <div className="flex space-x-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`p-2 rounded-md ${
                isActive(item.href) ? 'bg-amber-900 text-white' : 'text-amber-800'
              }`}
              title={item.name}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-amber-800 hover:text-amber-900"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none md:p-6 p-4 md:pt-6 pt-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;