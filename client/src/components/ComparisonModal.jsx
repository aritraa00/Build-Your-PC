import { Fragment } from "react";
import { formatCurrency, getEffectivePrice } from "../utils/builder";

const renderSpecValue = (specs, key) => (specs?.[key] !== undefined ? String(specs[key]) : "N/A");

export const ComparisonModal = ({ items, stepLabel, onClose }) => {
  if (items.length < 2) {
    return null;
  }

  const specKeys = Array.from(new Set(items.flatMap((item) => Object.keys(item.specs || {}))));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="glass-panel max-h-[90vh] w-full max-w-5xl overflow-auto p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Comparison Mode</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Compare {stepLabel}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div key={item._id} className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-sky-300">{item.brand}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{item.name}</h3>
              <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(getEffectivePrice(item))}</p>
              <p className="mt-2 text-sm text-slate-400">{item.insight?.useCase}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/60 p-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-slate-500">Spec</div>
            {items.map((item) => (
              <div key={item._id} className="font-medium text-white">
                {item.name}
              </div>
            ))}
            {specKeys.map((key) => (
              <Fragment key={key}>
                <div key={`${key}-label`} className="text-slate-400">
                  {key}
                </div>
                {items.map((item) => (
                  <div key={`${item._id}-${key}`} className="text-slate-200">
                    {renderSpecValue(item.specs, key)}
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
