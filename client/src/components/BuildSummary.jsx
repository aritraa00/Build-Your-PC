import {
  BUILD_STEPS,
  calculateTotalPrice,
  estimatePower,
  formatCurrency,
  getCompatibilityTone,
  getCompatibilityWarnings
} from "../utils/builder";

const toneStyles = {
  ready: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  warning: "border-amber-400/20 bg-amber-500/10 text-amber-200",
  critical: "border-orange-400/20 bg-orange-500/10 text-orange-200"
};

export const BuildSummary = ({
  parts,
  onSave,
  isSaving,
  shareUrl,
  saveDisabled,
  budget,
  performanceData
}) => {
  const warnings = getCompatibilityWarnings(parts);
  const totalPrice = calculateTotalPrice(parts);
  const totalPower = estimatePower(parts);
  const selectedParts = BUILD_STEPS.filter((step) => parts[step.key]);
  const remaining = budget ? budget - totalPrice : null;
  const compatibilityTone = getCompatibilityTone(warnings);

  return (
    <aside className="glass-panel h-fit p-5 xl:sticky xl:top-24">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Live Build Summary</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Your Rig</h2>
        </div>
        <span className="rounded-full bg-sky-400/20 px-3 py-1 text-sm text-sky-200">
          {performanceData?.label || "Calculating"}
        </span>
      </div>

      <div className="space-y-3">
        {BUILD_STEPS.map((step) => (
          <div key={step.key} className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{step.label}</p>
            <p className="mt-2 text-sm text-white">{parts[step.key]?.name || "Not selected yet"}</p>
            {parts[step.key] ? (
              <p className="mt-1 text-xs text-slate-400">{formatCurrency(parts[step.key].priceInfo?.bestPrice || parts[step.key].price)}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-sky-400/20 bg-sky-400/10 p-4">
        <p className="text-sm text-slate-300">Estimated power</p>
        <p className="text-xl font-semibold text-white">{totalPower}W</p>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <p className="text-sm text-slate-300">Total price</p>
        <p className="text-2xl font-semibold text-white">{formatCurrency(totalPrice)}</p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-300">Budget</p>
          <p className="mt-2 text-xl font-semibold text-white">{budget ? formatCurrency(budget) : "Not set"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-300">Remaining</p>
          <p className={`mt-2 text-xl font-semibold ${remaining !== null && remaining < 0 ? "text-orange-300" : "text-white"}`}>
            {remaining !== null ? formatCurrency(remaining) : "Set budget"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <p className="text-sm text-slate-300">Price breakdown</p>
        <div className="mt-3 space-y-2">
          {selectedParts.length === 0 ? (
            <p className="text-sm text-slate-400">No components selected yet.</p>
          ) : (
            selectedParts.map((step) => (
              <div key={step.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-400">{step.label}</span>
                <span className="text-white">{formatCurrency(parts[step.key].priceInfo?.bestPrice || parts[step.key].price)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <p className="text-sm text-slate-300">Performance score</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Gaming</p>
            <p className="mt-1 text-xl font-semibold text-white">{performanceData?.gamingScore || "-"}/10</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Productivity</p>
            <p className="mt-1 text-xl font-semibold text-white">{performanceData?.productivityScore || "-"}/10</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className={`rounded-2xl border p-4 text-sm ${toneStyles[compatibilityTone]}`}>
          Compatibility status: {warnings.length === 0 ? "Ready to build" : `${warnings.length} issue${warnings.length > 1 ? "s" : ""} detected`}
        </div>
        {warnings.map((warning) => (
          <div key={warning} className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4 text-sm text-orange-200">
            {warning}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saveDisabled || isSaving}
        className="mt-5 w-full rounded-2xl bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save & Share Build"}
      </button>

      {shareUrl ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-sky-200"
          >
            Open shared build
          </a>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(shareUrl)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
          >
            Copy link
          </button>
        </div>
      ) : null}
    </aside>
  );
};
