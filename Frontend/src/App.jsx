import AppRoutes from "./routes";
import useThemeStore from "./store/themeStore";







import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div
      className="
        min-h-screen
        bg-slate-50 text-slate-900
        dark:bg-bg dark:text-white
        transition-colors duration-300
      "
    >
      <Outlet />
      <AppRoutes />

    </div>
  );
}
