// signup.tsx
import React, { useState } from "react";
import { Lock, Eye, EyeOff, User, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("sales");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const payload: any = { username, password, confirmPassword, role };
      if (role === "customer") {
        payload.phone = phone;
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Signup failed");
      }

      // Success - redirect to login
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.");
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
            Create your premium account
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
          {/* Back to Login */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 transition-colors mb-6 text-sm font-semibold group cursor-pointer"
            style={{ color: "var(--premium-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--premium-amber-500)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--premium-text-muted)")}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

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

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--premium-text-primary)" }}
              >
                Username
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
                  placeholder="Enter username"
                  required
                  minLength={3}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--premium-text-primary)" }}
              >
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Shield
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
              <p className="mt-2 text-[11px] font-medium" style={{ color: "var(--premium-text-muted)" }}>
                {role === "admin" ? "Full access to management features" : role === "customer" ? "View your quotations and browse products" : "Access to create and manage quotations"}
              </p>
            </div>

            {/* Phone (Shown for customer) */}
            {role === "customer" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--premium-text-primary)" }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5"
                      style={{ color: "var(--premium-amber-600)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-premium pl-11"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            )}

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
                  minLength={6}
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold mb-2"
                style={{ color: "var(--premium-text-primary)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock
                    className="h-5 w-5"
                    style={{ color: "var(--premium-amber-600)" }}
                  />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-premium pl-11 pr-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? (
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
              className="w-full btn-premium-primary py-3.5 text-[15px] rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                  Creating Account…
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: "var(--premium-text-muted)" }}>
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-bold transition-colors cursor-pointer"
                style={{ color: "var(--premium-amber-500)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--premium-amber-400)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--premium-amber-500)")}
              >
                Sign in here
              </button>
            </p>
          </div>
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