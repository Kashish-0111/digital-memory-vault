import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Brain,
  Bell,
  Tags,
  Lock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  FileText,
  Star,
  Zap,
  Sun,Moon
} from 'lucide-react';
 import { useApp } from '../context/AppContext.jsx';

function Particle({ style }) {
  return (
    <div
      className="absolute rounded-full bg-primary-400/20 dark:bg-primary-500/10 animate-pulse-slow pointer-events-none"
      style={style}
    />
  );
}

const features = [
  {
    icon: FileText,
    title: 'Smart Notes',
    desc: 'Rich text notes with categories, tags, and instant search. Organize everything the way you think.',
    color: 'from-blue-500 to-cyan-400',
    shadow: 'shadow-blue-500/20',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    desc: 'Never miss birthdays, bills, or important dates. Intelligent notifications keep you ahead.',
    color: 'from-violet-500 to-purple-400',
    shadow: 'shadow-violet-500/20',
  },
  {
    icon: Tags,
    title: 'Categories',
    desc: 'Build your own organizational system with custom categories and color coding.',
    color: 'from-emerald-500 to-teal-400',
    shadow: 'shadow-emerald-500/20',
  },
  {
    icon: Lock,
    title: 'PIN Protected',
    desc: 'Your memories stay private with local PIN encryption. No cloud, no tracking, no worries.',
    color: 'from-orange-500 to-amber-400',
    shadow: 'shadow-orange-500/20',
  },
  {
    icon: Brain,
    title: 'Local First',
    desc: 'All data lives on your device. Works offline, loads instantly, completely yours.',
    color: 'from-pink-500 to-rose-400',
    shadow: 'shadow-pink-500/20',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'No servers, no latency. Instant search, instant saves, instant everything.',
    color: 'from-yellow-500 to-orange-400',
    shadow: 'shadow-yellow-500/20',
  },
];

const steps = [
  { num: '01', title: 'Set Your PIN', desc: 'Create a secure PIN to protect your vault. Simple, fast, private.' },
  { num: '02', title: 'Add Your Notes', desc: 'Start writing notes, set reminders, and build your categories.' },
  { num: '03', title: 'Stay Organised', desc: 'Access your entire digital memory from one secure dashboard.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  // const { auth } = useApp();
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // useEffect(() => {
  //   if (auth.state.isAuthenticated) {
  //     navigate('/dashboard', { replace: true });
  //   }
  // }, [auth.state.isAuthenticated, navigate]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const particles = [
    { width: 80, height: 80, top: '10%', left: '5%', animationDelay: '0s' },
    { width: 50, height: 50, top: '20%', right: '8%', animationDelay: '1s' },
    { width: 120, height: 120, bottom: '30%', left: '3%', animationDelay: '2s' },
    { width: 60, height: 60, top: '60%', right: '5%', animationDelay: '0.5s' },
    { width: 40, height: 40, top: '45%', left: '15%', animationDelay: '1.5s' },
  ];

  const { settings } = useApp();
  const isDark = settings.state.theme === 'dark';

const toggleTheme = () => {
  settings.dispatch({
    type: 'SET_SETTINGS',
    payload: { ...settings.state, theme: isDark ? 'light' : 'dark' }
  });
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 overflow-x-hidden">

      {/* NAVBAR */}
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10 dark:border-slate-800/50">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
        <Shield className="w-5 h-5 text-white" />
      </div>
      <span className="font-bold text-gray-900 dark:text-white text-lg">Memory Vault</span>
    </div>

    {/* Right side buttons */}
    <div className="flex items-center gap-3">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Get Started */}
      <button
        onClick={handleGetStarted}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        Get Started
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
</nav>

      {/* HERO */}
      <section
  ref={heroRef}
  className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center pt-20 pb-12 px-6 overflow-hidden"
>
        <div
          className="absolute top-1/4 left-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
            transform: `translate(-50%, calc(-50% + ${scrollY * 0.3}px))`,
          }}
        />
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        {particles.map((p, i) => (
          <Particle key={i} style={p} />
        ))}

        <div className="relative z-10 text-center max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary-200 dark:border-primary-800/50 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              Your private digital memory — 100% local
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-6">
            Remember{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-primary-600 to-violet-500 bg-clip-text text-transparent">
                everything
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-600 to-violet-500 rounded-full opacity-40" />
            </span>
            <br />
            worry about nothing
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A secure, offline-first vault for your notes, reminders, and important dates.
            No accounts, no subscriptions, no cloud — just your memories, safe on your device.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-base font-semibold rounded-2xl shadow-xl shadow-primary-600/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto"
            >
              <Shield className="w-5 h-5" />
              Open My Vault
              <ArrowRight className="w-5 h-5" />
            </button>
            
           <a
  href="#features"
  className="flex items-center gap-2 px-8 py-4 glass-card border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-base font-semibold rounded-2xl hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 w-full sm:w-auto justify-center"
>
  See Features
  <ChevronDown className="w-4 h-4" />
</a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-500">
            {['No account needed', '100% offline', 'PIN encrypted', 'Free forever'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-primary-500 fill-primary-500" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
              Everything you need
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              Built for your memory
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Powerful features wrapped in simplicity. No bloat, no distractions — just tools that actually help.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-card rounded-2xl p-6 border border-white/60 dark:border-slate-700/50 hover:border-primary-200 dark:hover:border-primary-800/60 transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg ${f.shadow} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white/50 dark:bg-slate-900/50 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-3">
              Simple as 1, 2, 3
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Get started in seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 dark:from-primary-900 dark:via-primary-600 dark:to-primary-900" />
            {steps.map((step) => (
              <div key={step.num} className="relative text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-600/30 mb-5 relative z-10">
                  <span className="text-white font-black text-lg">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative glass-strong rounded-3xl border border-primary-100 dark:border-primary-900/50 p-12 text-center overflow-hidden shadow-2xl shadow-primary-600/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-violet-50/50 dark:from-primary-950/50 dark:to-violet-950/30 pointer-events-none rounded-3xl" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary-200/30 dark:bg-primary-800/10 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-600/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                Your memories deserve better
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
                Start organising your life with Digital Memory Vault. No sign-up, no cloud, just you and your data.
              </p>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-3 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-bold rounded-2xl shadow-xl shadow-primary-600/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Lock className="w-5 h-5" />
                Open My Vault
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 dark:border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Memory Vault</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            v1.0.0 · Your data stays local · Made with ❤️
          </p>
        </div>
      </footer>

    </div>
  );
}