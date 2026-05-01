import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { authActions } from '../reducers/authReducer.js';
import { authService } from '../services/auth.js';
import GlassCard from '../components/common/GlassCard.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useApp();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [currentPin, setCurrentPin] = useState('');

  useEffect(() => {
    if (auth.state.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [auth.state.isAuthenticated, navigate]);

  useEffect(() => {
    setIsSetup(!auth.state.hasPIN);
    setIsChanging(location.pathname === '/settings');
  }, [auth.state.hasPIN, location.pathname]);

  const handleSetup = async (e) => {
    e.preventDefault();
    auth.dispatch({ type: authActions.SET_LOADING });

    if (pin.length < 4) {
      auth.dispatch({
        type: authActions.LOGIN,
        payload: { success: false, error: 'PIN must be at least 4 digits.' },
      });
      return;
    }

    if (pin !== confirmPin) {
      auth.dispatch({
        type: authActions.LOGIN,
        payload: { success: false, error: 'PINs do not match.' },
      });
      return;
    }

    auth.dispatch({ type: authActions.SETUP_PIN, payload: pin });
    navigate('/dashboard', { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    auth.dispatch({ type: authActions.SET_LOADING });

    const result = await authService.login(pin);
    auth.dispatch({ type: authActions.LOGIN, payload: result });

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleChangePIN = async (e) => {
    e.preventDefault();
    auth.dispatch({ type: authActions.SET_LOADING });

    if (pin.length < 4) {
      auth.dispatch({
        type: authActions.LOGIN,
        payload: { success: false, error: 'New PIN must be at least 4 digits.' },
      });
      return;
    }

    if (pin !== confirmPin) {
      auth.dispatch({
        type: authActions.LOGIN,
        payload: { success: false, error: 'New PINs do not match.' },
      });
      return;
    }

    const result = await authService.changePIN(currentPin, pin);
    if (result.success) {
      setPin('');
      setConfirmPin('');
      setCurrentPin('');
      auth.dispatch({
        type: authActions.LOGIN,
        payload: { success: true, data: authService.getAuthData() },
      });
      navigate('/settings', { replace: true });
    } else {
      auth.dispatch({
        type: authActions.LOGIN,
        payload: { success: false, error: result.error },
      });
    }
  };

  const onSubmit = isChanging ? handleChangePIN : isSetup ? handleSetup : handleLogin;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <GlassCard className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isChanging ? 'Change PIN' : isSetup ? 'Create Your PIN' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {isChanging
              ? 'Enter your current PIN and set a new one'
              : isSetup
              ? 'Set up a secure PIN to protect your vault'
              : 'Enter your PIN to unlock your vault'}
          </p>

          {auth.state.error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {auth.state.error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {isChanging && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Current PIN"
                  className="input-field pl-12 pr-12"
                  maxLength={8}
                />
              </div>
            )}

            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder={isSetup || isChanging ? 'New PIN' : 'Enter PIN'}
                className="input-field pl-12 pr-12"
                maxLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {(isSetup || isChanging) && (
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm PIN"
                  className="input-field pl-12"
                  maxLength={8}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={auth.state.isLoading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {auth.state.isLoading
                ? 'Processing...'
                : isChanging
                ? 'Update PIN'
                : isSetup
                ? 'Create PIN'
                : 'Unlock Vault'}
            </button>
          </form>

          {!isSetup && !isChanging && (
            <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
              Your data is encrypted and stored locally
            </p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

