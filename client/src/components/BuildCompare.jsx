import { calculateTotalPrice, estimatePerformanceLabel, formatCurrency } from "../utils/builder";

export const BuildCompare = ({ currentParts, buildToCompare }) => {
  if (!buildToCompare) {
    return null;
  }

  const currentPrice = calculateTotalPrice(currentParts);
  const comparePrice = buildToCompare.totalPrice || 0;

  return (
    <section className="glass-panel mt-8 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Compare Builds</p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            Current build vs {buildToCompare.title}
          </h3>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-300">
          {estimatePerformanceLabel(currentParts)} vs {buildToCompare.performanceLabel}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-400">Current build</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(currentPrice)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-400">{buildToCompare.title}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(comparePrice)}</p>
        </div>
      </div>
    </section>
  );
};
