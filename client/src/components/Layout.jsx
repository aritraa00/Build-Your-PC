import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm transition ${
    isActive ? "bg-sky-400/20 text-sky-300" : "text-slate-300 hover:bg-white/10 hover:text-white"
  }`;

export const Layout = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Link to="/" className="text-lg font-semibold tracking-wide text-white">
            Build Your PC
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/builder" className={navLinkClass}>
              Builder
            </NavLink>
            <NavLink to="/saved-builds" className={navLinkClass}>
              Saved Builds
            </NavLink>
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 md:inline-flex">
                  {user?.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/auth" className={navLinkClass}>
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
};
