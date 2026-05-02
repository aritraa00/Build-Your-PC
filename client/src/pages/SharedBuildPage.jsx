import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import { formatCurrency } from "../utils/builder";

export const SharedBuildPage = () => {
  const { id } = useParams();
  const [build, setBuild] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBuild = async () => {
      try {
        const data = await api.getBuild(id);
        setBuild(data);
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    loadBuild();
  }, [id]);

  if (error) {
    return <div className="glass-panel p-8 text-orange-200">{error}</div>;
  }

  if (!build) {
    return <div className="glass-panel p-8 text-slate-300">Loading build...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Shared Build</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{build.title}</h1>
        <p className="mt-2 text-slate-300">Created by {build.user?.name || "Anonymous builder"}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold text-white">Component breakdown</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Object.entries(build.parts).map(([type, part]) => (
              <div key={type} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{type}</p>
                <p className="mt-2 text-lg text-white">{part.name}</p>
                <p className="mt-2 text-sm text-slate-400">{formatCurrency(part.priceInfo?.bestPrice || part.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="glass-panel p-6">
          <h2 className="text-xl font-semibold text-white">Summary</h2>
          <div className="mt-4 space-y-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Total price</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(build.totalPrice)}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Estimated power</p>
              <p className="mt-2 text-2xl font-semibold text-white">{build.estimatedPower}W</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-slate-400">Performance</p>
              <p className="mt-2 text-2xl font-semibold text-white">{build.performanceLabel}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {build.warnings.length === 0 ? (
              <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-200">
                Compatibility check passed for this saved build.
              </div>
            ) : (
              build.warnings.map((warning) => (
                <div key={warning} className="rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-200">
                  {warning}
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
