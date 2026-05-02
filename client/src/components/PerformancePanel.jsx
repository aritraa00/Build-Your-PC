export const PerformancePanel = ({ performanceData }) => {
  if (!performanceData) return null;

  return (
    <section className="glass-panel mt-8 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Performance Estimation</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Expected FPS</h3>
        </div>
        <span className="rounded-full bg-sky-400/15 px-3 py-1 text-sm text-sky-200">{performanceData.label}</span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {performanceData.fps?.map((entry) => (
          <div key={entry.game} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-400">{entry.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{entry.fps}</p>
            <p className="mt-2 text-xs text-slate-500">{entry.quality}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
