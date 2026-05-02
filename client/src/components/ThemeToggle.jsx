import { useTheme } from "../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(event) => setTheme(event.target.value)}
      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
      aria-label="Theme toggle"
    >
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};

