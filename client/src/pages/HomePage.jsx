import { Link } from "react-router-dom";
import { getRecommendedBuilds } from "../utils/builder";

export const HomePage = () => {
  const recommendations = getRecommendedBuilds();

  return (
    <div className="space-y-10">
      <section className="glass-panel overflow-hidden bg-hero-grid p-8 md:p-12">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-sky-300">
            Full-Stack PC Builder MVP
          </span>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            Build your next PC with live compatibility, pricing, and performance insights.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Pick parts step by step, spot mismatches instantly, estimate gaming performance, and save builds with shareable links.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/builder"
              className="rounded-full bg-sky-400 px-6 py-3 font-medium text-slate-950 transition hover:bg-sky-300"
            >
              Launch Builder
            </Link>
            <Link
              to="/saved-builds"
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              View Saved Builds
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Compatibility checks", value: "Socket, RAM, PSU, case" },
          { label: "Builder workflow", value: "7-step guided selection" },
          { label: "Saved builds", value: "Shareable links + compare mode" }
        ].map((item) => (
          <div key={item.label} className="glass-panel p-5">
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Recommended PCs</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Pre-built starting points</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {recommendations.map((item) => (
            <article key={item.title} className="glass-panel p-6">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-slate-300">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.parts.map((part) => (
                  <span key={part} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    {part}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
