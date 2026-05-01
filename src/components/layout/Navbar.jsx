import { Bell, Moon, Sun, LogOut, User } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { authActions } from '../../reducers/authReducer.js';
import { settingsActions } from '../../reducers/settingsReducer.js';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { auth, settings } = useApp();
  const navigate = useNavigate();

  const handleToggleTheme = () => {
    settings.dispatch({ type: settingsActions.TOGGLE_THEME });
  };

  const handleLogout = () => {
    auth.dispatch({ type: authActions.LOGOUT });
    navigate('/login');
  };

  return (
    <nav className="glass-strong sticky top-0 z-40 border-b border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
              Memory Vault
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 transition-colors"
              title="Toggle theme"
            >
              {settings.state.theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
