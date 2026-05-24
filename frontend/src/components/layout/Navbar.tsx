import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Bell, Menu, X, HardHat, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNotificationStore } from '@store/notificationStore';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink = user?.role === 'ADMIN' ? '/admin' : user?.role === 'WORKER' ? '/worker' : '/client';

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <HardHat className="w-7 h-7" />
            <span>BuildHub</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Loyihalar
            </Link>
            <Link to="/workers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Ustalar
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={`${dashboardLink}/notifications`} className="relative p-2 rounded-full hover:bg-muted transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium">{user?.firstName}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border shadow-lg py-1 z-50">
                      <Link
                        to={dashboardLink}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 w-full text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Chiqish
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login" className="btn-outline text-sm px-4 py-2">
                  Kirish
                </Link>
                <Link to="/auth/register" className="btn-primary text-sm px-4 py-2">
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link to="/projects" className="block px-4 py-2 text-sm hover:bg-muted rounded-lg">Loyihalar</Link>
            <Link to="/workers" className="block px-4 py-2 text-sm hover:bg-muted rounded-lg">Ustalar</Link>
            {isAuthenticated && (
              <Link to={dashboardLink} className="block px-4 py-2 text-sm hover:bg-muted rounded-lg">Dashboard</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
