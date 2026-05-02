import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);

    try {
      const response = await api.resetPassword(token, { password });
      setMessage(response.message);
      setTimeout(() => navigate("/auth"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass-panel p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Reset password</h1>
        <p className="mt-3 text-sm text-slate-400">
          Enter your new password below. You'll be redirected to login after reset.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-slate-300">
            New Password
            <div className="mt-2 flex rounded-2xl border border-white/10 bg-slate-900">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-l-2xl bg-transparent px-4 py-3 text-white outline-none"
                minLength={6}
                maxLength={128}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="rounded-r-2xl px-4 text-sm text-slate-300"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="block text-sm text-slate-300">
            Confirm Password
            <div className="mt-2 flex rounded-2xl border border-white/10 bg-slate-900">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-l-2xl bg-transparent px-4 py-3 text-white outline-none"
                minLength={6}
                maxLength={128}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="rounded-r-2xl px-4 text-sm text-slate-300"
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error ? (
            <p className="rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-200">{error}</p>
          ) : null}

          {message ? (
            <p className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-200">
              {message} Redirecting to login...
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || !!message}
            className="w-full rounded-2xl bg-sky-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-sky-300 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-5 text-sm">
          <Link to="/auth" className="text-slate-400 transition hover:text-white">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};