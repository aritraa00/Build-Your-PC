import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AuthPage = ({ initialMode = "login" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError("");
    setMessage("");
  }, [initialMode]);

  const title = useMemo(() => {
    if (mode === "register") return "Create your account";
    if (mode === "forgot") return "Forgot password";
    return "Welcome back";
  }, [mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (!emailRegex.test(form.email)) {
        throw new Error("Please enter a valid email address.");
      }

      if (mode === "register" && form.name.trim().length < 2) {
        throw new Error("Name must be at least 2 characters long.");
      }

      if (mode !== "forgot" && form.password.length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }

      if (mode === "forgot") {
        const response = await api.forgotPassword({ email: form.email });
        setMessage(response.message);
        return;
      }

      const payload =
        mode === "register"
          ? await api.register(form)
          : await api.login({
              email: form.email,
              password: form.password
            });

      login(payload);
      navigate("/builder");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass-panel p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-3 text-sm text-slate-400">
          {mode === "forgot"
            ? "We’ll simulate a reset flow and show a success message."
            : "Use your account to save, compare, and share builds."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" ? (
            <label className="block text-sm text-slate-300">
              Name
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                maxLength={60}
                required
              />
            </label>
          ) : null}

          <label className="block text-sm text-slate-300">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              maxLength={120}
              required
            />
          </label>

          {mode !== "forgot" ? (
            <label className="block text-sm text-slate-300">
              Password
              <div className="mt-2 flex rounded-2xl border border-white/10 bg-slate-900">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
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
          ) : null}

          {error ? <p className="rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-200">{error}</p> : null}
          {message ? <p className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-sky-300 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "register"
                ? "Register"
                : mode === "forgot"
                  ? "Send reset link"
                  : "Login"}
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          {mode !== "login" ? (
            <Link to="/auth" className="text-slate-400 transition hover:text-white">
              Back to login
            </Link>
          ) : (
            <>
              <Link to="/register" className="text-slate-400 transition hover:text-white">
                Need an account? Register here
              </Link>
              <Link to="/forgot-password" className="text-slate-400 transition hover:text-white">
                Forgot password?
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
