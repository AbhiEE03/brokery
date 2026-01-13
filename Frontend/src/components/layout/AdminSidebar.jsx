import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";

const MENU = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "fas fa-th-large" },
  { to: "/admin/properties", label: "Properties", icon: "fas fa-building" },
  { to: "/admin/clients", label: "Clients", icon: "fas fa-users" },
  { to: "/admin/brokers", label: "Brokers", icon: "fas fa-user-tie" },
  { to: "/admin/requests", label: "Property Edit Requests", icon: "fas fa-code-branch" },
  { to: "/admin/ClientChangeRequests", label: "Client Edit Requests", icon: "fas fa-code-branch" },
  { to: "/admin/reports", label: "Reports", icon: "fas fa-chart-line" },
];


export default function AdminSidebar({ isOpen, onClose, user }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) { }

    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/70 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
    fixed inset-y-0 left-0 z-50
    w-72 flex flex-col
    h-screen overflow-y-auto
    bg-white
    dark:bg-black dark:text-white
    border-r border-slate-200 dark:border-white/10
    transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
      >
        {/* BRAND */}
        <div className="px-6 py-6 border-b border-slate-200 dark:border-white/10">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-white/50">
            Admin Panel
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-wide">
            Batra Associates
          </h1>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {MENU.map((item) => {
            const active = pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  relative flex items-center gap-4 px-3 py-2 rounded-lg
                  transition-all duration-200
                  ${active
                    ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white"
                  }
                `}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-slate-900 dark:bg-white" />
                )}

                <i className={`fas ${item.icon} text-sm opacity-80`} />
                <span className=" tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* USER CARD */}
        {user && (
          <div className="mx-4 mb-4 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  {user.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LOGOUT */}
        <div className="px-4 py-4 border-t border-slate-200 dark:border-white/10 flex justify-center">
          <button
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className="
      w-10 h-10
      flex items-center justify-center
      rounded-full

      text-slate-600 dark:text-slate-400
      hover:text-red-600 dark:hover:text-red-500

      hover:bg-slate-900/5 dark:hover:bg-white/10
      active:bg-slate-900/10 dark:active:bg-white/20

      transition-all duration-200
    "
          >
            {/* Apple-style logout icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>


      </aside>
    </>
  );
}
