export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-white/10 rounded-2xl shadow-lg ${
        hover ? 'hover:shadow-xl transition-all duration-300 hover:scale-[1.01]' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

