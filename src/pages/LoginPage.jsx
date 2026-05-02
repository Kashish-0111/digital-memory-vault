import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, KeyRound, Mail, LogIn, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { authActions } from '../reducers/authReducer.js';
import { authService } from '../services/auth.js';
import GlassCard from '../components/common/GlassCard.jsx';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase/config.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth: appAuth } = useApp();

  // PIN states
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [currentPin, setCurrentPin] = useState('');

  // Firebase states
  const [mode, setMode] = useState('pin'); // 'pin' | 'firebase'
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firebaseLoading, setFirebaseLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState('');

  useEffect(() => {
    if (appAuth.state.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [appAuth.state.isAuthenticated, navigate]);

  useEffect(() => {
    setIsSetup(!appAuth.state.hasPIN);
    setIsChanging(location.pathname === '/settings');
  }, [appAuth.state.hasPIN, location.pathname]);

  // ── PIN Handlers ──

  const handleSetup = async (e) => {
    e.preventDefault();
    appAuth.dispatch({ type: authActions.SET_LOADING });
    if (pin.length < 4) {
      appAuth.dispatch({ type: authActions.LOGIN, payload: { success: false, error: 'PIN must be at least 4 digits.' } });
      return;
    }
    if (pin !== confirmPin) {
      appAuth.dispatch({ type: authActions.LOGIN, payload: { success: false, error: 'PINs do not match.' } });
      return;
    }
    appAuth.dispatch({ type: authActions.SETUP_PIN, payload: pin });
    navigate('/dashboard', { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    appAuth.dispatch({ type: authActions.SET_LOADING });
    const result = await authService.login(pin);
    appAuth.dispatch({ type: authActions.LOGIN, payload: result });
    if (result.success) navigate('/dashboard', { replace: true });
  };

  const handleChangePIN = async (e) => {
    e.preventDefault();
    appAuth.dispatch({ type: authActions.SET_LOADING });
    if (pin.length < 4) {
      appAuth.dispatch({ type: authActions.LOGIN, payload: { success: false, error: 'New PIN must be at least 4 digits.' } });
      return;
    }
    if (pin !== confirmPin) {
      appAuth.dispatch({ type: authActions.LOGIN, payload: { success: false, error: 'New PINs do not match.' } });
      return;
    }
    const result = await authService.changePIN(currentPin, pin);
    if (result.success) {
      setPin(''); setConfirmPin(''); setCurrentPin('');
      appAuth.dispatch({ type: authActions.LOGIN, payload: { success: true, data: authService.getAuthData() } });
      navigate('/settings', { replace: true });
    } else {
      appAuth.dispatch({ type: authActions.LOGIN, payload: { success: false, error: result.error } });
    }
  };

  const onPinSubmit = isChanging ? handleChangePIN : isSetup ? handleSetup : handleLogin;

  // ── Firebase Handler ──

  const handleFirebaseSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setFirebaseError('Email aur password dono bharo'); return; }
    if (password.length < 6) { setFirebaseError('Password kam se kam 6 characters ka hona chahiye'); return; }

    setFirebaseLoading(true);
    setFirebaseError('');

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      appAuth.dispatch({ type: authActions.LOGIN, payload: { success: true } });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'Account nahi mila, pehle sign up karo',
        'auth/wrong-password': 'Password galat hai',
        'auth/invalid-credential': 'Email ya password galat hai',
        'auth/email-already-in-use': 'Yeh email pehle se registered hai',
        'auth/invalid-email': 'Email sahi nahi hai',
        'auth/weak-password': 'Password zyada strong banana hoga',
      };
      setFirebaseError(messages[err.code] || 'Kuch gadbad hui, dobara try karo');
    } finally {
      setFirebaseLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md animate-slide-up">
        <GlassCard className="p-8 text-center">

          {/* Logo */}
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isChanging ? 'Change PIN' : isSetup ? 'Create Your PIN' : 'Welcome Back'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {isChanging
              ? 'Enter your current PIN and set a new one'
              : isSetup
              ? 'Set up a secure PIN to protect your vault'
              : 'Enter your PIN or login with Email'}
          </p>

          {/* Mode Toggle */}
          {!isChanging && (
            <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 mb-6">
              <button
                onClick={() => { setMode('pin'); setFirebaseError(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  mode === 'pin'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <KeyRound className="w-4 h-4" /> PIN Login
              </button>
              <button
                onClick={() => { setMode('firebase'); appAuth.dispatch({ type: authActions.CLEAR_ERROR }); }}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  mode === 'firebase'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <Mail className="w-4 h-4" /> Email Login
              </button>
            </div>
          )}

          {/* ── PIN FORM ── */}
          {(mode === 'pin' || isChanging) && (
            <>
              {appAuth.state.error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {appAuth.state.error}
                </div>
              )}
              <form onSubmit={onPinSubmit} className="space-y-4">
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
                  disabled={appAuth.state.isLoading}
                  className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {appAuth.state.isLoading
                    ? 'Processing...'
                    : isChanging ? 'Update PIN'
                    : isSetup ? 'Create PIN'
                    : 'Unlock Vault'}
                </button>
              </form>
              {!isSetup && !isChanging && (
                <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
                  Your data is encrypted and stored locally
                </p>
              )}
            </>
          )}

          {/* ── FIREBASE EMAIL FORM ── */}
          {mode === 'firebase' && !isChanging && (
            <>
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 mb-4">
                <button
                  onClick={() => { setIsSignUp(false); setFirebaseError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold transition-all ${
                    !isSignUp ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsSignUp(true); setFirebaseError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold transition-all ${
                    isSignUp ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {firebaseError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                  {firebaseError}
                </div>
              )}

              <form onSubmit={handleFirebaseSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aapka@email.com"
                    className="input-field pl-12"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={firebaseLoading}
                  className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {firebaseLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isSignUp ? (
                    <><UserPlus className="w-5 h-5" /> Account Banao</>
                  ) : (
                    <><LogIn className="w-5 h-5" /> Login Karo</>
                  )}
                </button>
              </form>
              <p className="mt-4 text-sm text-gray-400 dark:text-gray-500">
                Cloud sync enabled with Firebase
              </p>
            </>
          )}

        </GlassCard>
      </div>
    </div>
  );
}
