import { Sun, Moon } from "lucide-react";
import useThemeStore from "../../store/themeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2 rounded-lg
        bg-slate-200 hover:bg-slate-300
        dark:bg-card dark:hover:bg-border
        transition
      "
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-slate-700" />
      )}
    </button>
  );
}
