import React, { useState } from "react";
import { Lock, Eye, EyeOff, User, UserPlus, UserCog } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sales");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, role }),
        }
      );
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      login(data.token, data.user);
      if (data?.user?.role === "sales") {
        navigate("/dashboard");
      } else if (data?.user?.role === "customer") {
        navigate("/customer-quotations");
      } else {
        navigate("/items");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "var(--premium-base)" }}
    >
      {/* ── Ambient Glows ── */}
      <div
        className="absolute top-[-15%] right-[-5%] w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(180,83,9,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-8%] w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(146,64,14,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Tile Grid Pattern ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(255,255,255,0.06) 80px, rgba(255,255,255,0.06) 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(255,255,255,0.06) 80px, rgba(255,255,255,0.06) 81px)
          `,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-5">
            {/* Glow behind logo */}
            <div
              className="absolute -inset-3 rounded-full"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(180,83,9,0.15), transparent 70%)",
              }}
            />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #9A3412)",
                border: "3px solid #B45309",
                boxShadow: "0 10px 30px -10px rgba(154, 52, 18, 0.4)",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </div>
          </div>
          <h1
            className="text-4xl font-extrabold tracking-tight mb-2"
            style={{ color: "var(--premium-text-primary)" }}
          >
            QUAN<span className="text-amber-500">TILE</span>
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--premium-text-muted)" }}
          >
            Sign in to continue to your account
          </p>
        </div>

        {/* ── Form Card ── */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--premium-raised)",
            border: "1px solid var(--premium-border)",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm flex items-start gap-2.5"
                style={{
                  background: "rgba(239, 68, 68, 0.08)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#f87171",
                }}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--premium-text-primary)" }}
              >
                Select Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserCog
                    className="h-5 w-5"
                    style={{ color: "var(--premium-amber-600)" }}
                  />
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-premium pl-11 pr-10 cursor-pointer appearance-none"
                  required
                >
                  <option value="sales">Sales</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4"
                    style={{ color: "var(--premium-text-faint)" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--premium-text-primary)" }}
              >
                {role === "customer" ? "Identifier (Username/Email/Phone)" : "Username"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User
                    className="h-5 w-5"
                    style={{ color: "var(--premium-amber-600)" }}
                  />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-premium pl-11"
                  placeholder={role === "customer" ? "Enter identifier" : "Enter your username"}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--premium-text-primary)" }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock
                    className="h-5 w-5"
                    style={{ color: "var(--premium-amber-600)" }}
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-11 pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer"
                  style={{ color: "var(--premium-text-faint)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--premium-amber-500)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--premium-text-faint)")
                  }
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium-primary py-3.5 text-[15px] rounded-xl cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full divider-warm" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span
                className="px-3 text-xs font-medium"
                style={{
                  background: "var(--premium-raised)",
                  color: "var(--premium-text-faint)",
                }}
              >
                Or
              </span>
            </div>
          </div>

          {/* Sign Up */}
          <button
            onClick={() => navigate("/signup")}
            className="w-full btn-premium-secondary py-3.5 text-[15px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus size={18} />
            Create New Account
          </button>
        </div>

        {/* Footer */}
        <p
          className="mt-8 text-center text-xs flex items-center justify-center gap-1.5"
          style={{ color: "var(--premium-text-faint)" }}
        >
          © 2026 Quantile. Made with
          <span style={{ color: "var(--premium-amber-600)" }}>♦</span>
          in India
        </p>
      </div>
    </div>
  );
}