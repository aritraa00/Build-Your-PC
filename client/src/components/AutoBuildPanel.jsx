export const AutoBuildPanel = ({
  budget,
  onBudgetChange,
  purpose,
  onPurposeChange,
  game,
  onGameChange,
  onAutoBuild,
  onGameOptimize,
  loading
}) => (
  <div className="glass-panel mb-6 grid gap-4 p-5 lg:grid-cols-[1fr_180px_180px_auto_auto]">
    <label className="text-sm text-slate-300">
      Budget
      <input
        type="number"
        min="10000"
        step="1000"
        value={budget}
        onChange={(event) => onBudgetChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
        placeholder="Enter budget in INR"
      />
    </label>

    <label className="text-sm text-slate-300">
      Purpose
      <select
        value={purpose}
        onChange={(event) => onPurposeChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
      >
        <option value="gaming">Gaming</option>
        <option value="editing">Editing</option>
        <option value="balanced">Balanced</option>
      </select>
    </label>

    <label className="text-sm text-slate-300">
      Game focus
      <select
        value={game}
        onChange={(event) => onGameChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
      >
        <option value="valorant">Valorant</option>
        <option value="gtaV">GTA V</option>
        <option value="fortnite">Fortnite</option>
      </select>
    </label>

    <button
      type="button"
      onClick={onAutoBuild}
      disabled={loading}
      className="mt-6 rounded-2xl bg-sky-400 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-sky-300 disabled:opacity-50"
    >
      {loading ? "Building..." : "Auto Build"}
    </button>

    <button
      type="button"
      onClick={onGameOptimize}
      disabled={loading}
      className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-50"
    >
      Optimize for Game
    </button>
  </div>
);
