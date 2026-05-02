const badgeStyles = {
  Low: "bg-slate-700 text-slate-200",
  Medium: "bg-amber-500/20 text-amber-200",
  High: "bg-sky-500/20 text-sky-200",
  Ultra: "bg-emerald-500/20 text-emerald-200"
};

const componentVisuals = {
  cpu: "from-sky-500/30 via-cyan-400/20 to-transparent",
  motherboard: "from-emerald-500/30 via-teal-400/20 to-transparent",
  ram: "from-violet-500/30 via-fuchsia-400/20 to-transparent",
  gpu: "from-orange-500/30 via-amber-400/20 to-transparent",
  storage: "from-blue-500/30 via-indigo-400/20 to-transparent",
  psu: "from-rose-500/30 via-orange-400/20 to-transparent",
  case: "from-slate-500/30 via-zinc-400/20 to-transparent"
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);

export const ComponentCard = ({ item, selected, onSelect, onCompareToggle, isCompared }) => {
  const trend = (((item.price % 17) / 17) * 8 + 1).toFixed(1);
  const perfRank = item.specs?.performanceRank || 0;
  const perfLabel = perfRank >= 9 ? "Ultra" : perfRank >= 7 ? "High" : perfRank >= 5 ? "Medium" : "Low";
  const bestPrice = item.priceInfo?.bestPrice || item.price;
  const bestVendor = item.priceInfo?.bestVendor;
  const itemType = item.type || "component";
  const visualClass = componentVisuals[item.type] || componentVisuals.case;

  return (
    <article
      className={`glass-panel overflow-hidden transition ${
        selected ? "ring-2 ring-sky-400 shadow-glow" : "hover:-translate-y-1 hover:bg-white/10"
      }`}
    >
      <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${visualClass}`}>
        <div className="absolute inset-0 opacity-70">
          <div className="absolute -left-10 top-8 h-28 w-28 rounded-full border border-white/20" />
          <div className="absolute right-8 top-10 h-12 w-24 rounded-full border border-white/10" />
          <div className="absolute bottom-6 left-8 h-2 w-28 rounded-full bg-white/15" />
          <div className="absolute bottom-10 left-8 h-2 w-40 rounded-full bg-white/10" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-200">{itemType}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{item.brand}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white">
            {itemType.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sky-300">{item.brand}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{item.name}</h3>
          </div>
          <span className="text-lg font-semibold text-white">{formatCurrency(bestPrice)}</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full px-3 py-1 ${badgeStyles[perfLabel]}`}>{perfLabel}</span>
          {item.specs?.socket ? <span className="rounded-full bg-white/10 px-3 py-1">Socket {item.specs.socket}</span> : null}
          {item.specs?.ramType ? <span className="rounded-full bg-white/10 px-3 py-1">{item.specs.ramType}</span> : null}
          {item.specs?.wattage ? (
            <span className="rounded-full bg-white/10 px-3 py-1">{item.specs.wattage}W</span>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-300">
          <p>
            Best price available: <span className="font-medium text-white">{formatCurrency(bestPrice)}</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {bestVendor} • Updated {new Date(item.priceInfo?.lastUpdated || Date.now()).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="mt-2 text-xs text-orange-300">Mock fluctuation: {trend}% in 30 days</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
          <p className="text-slate-200">{item.insight?.useCase}</p>
          <p className="mt-2 text-slate-400">{item.insight?.pairing}</p>
          {item.insight?.warnings?.map((warning) => (
            <p key={warning} className="mt-2 text-xs text-orange-300">
              {warning}
            </p>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onSelect(item)}
            className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
              selected ? "bg-emerald-500 text-white" : "bg-sky-500 text-slate-950 hover:bg-sky-400"
            }`}
          >
            {selected ? "Selected" : "Choose component"}
          </button>
          <button
            type="button"
            onClick={() => onCompareToggle?.(item)}
            className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              isCompared
                ? "border-amber-300/30 bg-amber-500/10 text-amber-200"
                : "border-white/10 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {isCompared ? "Added to compare" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
};
