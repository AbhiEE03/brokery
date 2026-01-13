import { useState } from "react";
import { login } from "../../services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login({ email, password });
      console.log("data", data)

      if (!data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // SAVE TOKEN
      localStorage.setItem("token", data.token);

      // REDIRECT BY ROLE
      if (data.user.role === "admin") {
        window.location.replace("/admin/dashboard");
      } else {
        window.location.replace("/broker/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-zinc-900 to-black">
      {/* CARD */}
      <div className="
        w-full max-w-md
        rounded-3xl
        bg-white/5 backdrop-blur-2xl
        shadow-[0_20px_60px_rgba(0,0,0,0.6)]
        border border-white/10
        p-6 sm:p-8
        animate-[fadeUp_0.4s_ease-out]
      ">

        {/* LOGO */}
        <div className="text-center mb-8">
          <img
            src="/batra-logo.jpeg"
            alt="Batra Associates"
            className="h-14 mx-auto mb-4 rounded-xl shadow-md"
          />
          <p className="text-xs tracking-wide text-white/50">
            Internal Management Portal
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="
            mb-4 rounded-xl
            bg-red-500/10 border border-red-500/20
            text-red-400 text-sm text-center
            px-4 py-3
          ">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="block text-xs text-white/50 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@batraassociates.com"
              className="
                w-full px-4 py-3 rounded-xl
                bg-white/10 text-white
                placeholder:text-white/30
                border border-transparent
                focus:border-white/30
                focus:outline-none
                transition
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs text-white/50 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="
                w-full px-4 py-3 rounded-xl
                bg-white/10 text-white
                placeholder:text-white/30
                border border-transparent
                focus:border-white/30
                focus:outline-none
                transition
              "
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-2
              bg-white text-black
              py-3 rounded-xl
              font-medium tracking-wide
              hover:bg-white/90
              active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-60
            "
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-[10px] text-white/40">
          © {new Date().getFullYear()} Batra Associates ·{" "}
          <span className="font-medium text-white/60">
            Powered by BackendBots
          </span>
        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
