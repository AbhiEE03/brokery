import { useState } from "react";
import { Menu } from "lucide-react";
import BrokerSidebar from "../../app/Broker/components/Sidebar";
import ThemeToggle from "./ThemeToggle";

export default function BrokerLayout({ children, user }) {
  const [open, setOpen] = useState(false);

  return (
    <div className=" flex min-h-screen">

      {/* SIDEBAR */}
      <BrokerSidebar
        isOpen={open}
        onClose={() => setOpen(false)}
        user={user}
      />

      {/* MAIN */}
      <div className="md:ml-72 flex-1 flex flex-col">

        {/* TOP BAR */}
        <header
          className="
            h-16 px-6 flex items-center justify-between
            bg-white border-b border-slate-200
            dark:bg-black/85 dark:border-border
            sticky top-0 z-20
          "
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="
                md:hidden p-2 rounded-lg
                hover:bg-slate-200
                dark:hover:bg-card
              "
            >
              <Menu size={20} />
            </button>

            <span className="font-semibold tracking-wide">
              Broker Panel
            </span>
          </div>

          <ThemeToggle />
        </header>

        {/* CONTENT */}
        <main className="dark:bg-black flex-1 p-6">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
