import { create } from "zustand";

const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "dark",

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return { theme: next };
    }),
}));

// apply theme ONCE on load
const initialTheme = useThemeStore.getState().theme;
document.documentElement.classList.toggle("dark", initialTheme === "dark");

export default useThemeStore;
