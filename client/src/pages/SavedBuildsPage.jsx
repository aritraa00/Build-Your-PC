import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatCurrency } from "../utils/builder";

export const SavedBuildsPage = () => {
  const { token, isAuthenticated } = useAuth();
  const [builds, setBuilds] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const loadBuilds = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getSavedBuilds(token);
        setBuilds(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadBuilds();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="glass-panel p-8">
        <h1 className="text-3xl font-semibold text-white">Saved Builds</h1>
        <p className="mt-3 text-slate-300">Login to save builds and view your library.</p>
        <Link
          to="/auth"
          className="mt-5 inline-flex rounded-2xl bg-sky-400 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-sky-300"
        >
          Go to login
        </Link>
      </div>
    );
  }

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");

    try {
      await api.deleteBuild(id, token);
      setBuilds((prev) => prev.filter((build) => build._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Library</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Saved builds</h1>
      </div>

      {error ? <p className="rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-200">{error}</p> : null}

      {loading ? (
        <div className="glass-panel p-8 text-slate-300">Loading saved builds...</div>
      ) : builds.length === 0 ? (
        <div className="glass-panel p-8 text-slate-300">No builds saved yet.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {builds.map((build) => (
            <article key={build._id} className="glass-panel p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{build.title}</h2>
                  <p className="mt-2 text-sm text-slate-400">Performance: {build.performanceLabel}</p>
                </div>
                <span className="text-xl font-semibold text-white">{formatCurrency(build.totalPrice)}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {Object.values(build.parts).map((part) => (
                  <span key={part._id || part.name} className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    {part.name}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  to={`/build/${build.shareId}`}
                  className="rounded-2xl bg-sky-400 px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-sky-300"
                >
                  Open shared view
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(build._id)}
                  disabled={deletingId === build._id}
                  className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200 transition hover:bg-orange-500/20 disabled:opacity-50"
                >
                  {deletingId === build._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
