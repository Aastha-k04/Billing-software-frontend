import React from "react";
import {
  Lock,
  Package,
  User,
  Shield,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const navigate = useNavigate();

  const options = [
    {
      id: 1,
      title: "Identity Rotation",
      description: "Manage sales protocol security credentials",
      icon: <User size={28} />,
      onClick: () => navigate("/user"),
      category: "Security"
    },
    {
      id: 2,
      title: "Self-Override",
      description: "Rotate master administrative access keys",
      icon: <Lock size={28} />,
      onClick: () => navigate("/settings"),
      category: "Access"
    },
    {
      id: 3,
      title: "Asset Catalog",
      description: "Synchronize and refine global inventory",
      icon: <Package size={28} />,
      onClick: () => navigate("/items"),
      category: "Inventory"
    },
  ];

  return (
    <div className="min-h-screen p-6 sm:p-8 font-sans selection:bg-amber-500/20" style={{ background: "var(--premium-base)" }}>
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Elite Command Header */}
        <div className="premium-card p-10 rounded-[2.5rem] relative overflow-hidden" style={{ background: "var(--premium-surface)", border: "1px solid var(--premium-border-strong)" }}>
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full -translate-y-40 translate-x-40 blur-3xl"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[1.5rem] bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                <Shield size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-1">Master Command</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-2" style={{ color: "var(--premium-text-muted)" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Central Intelligence Node
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 px-5 rounded-2xl border border-[var(--premium-border)] bg-[var(--premium-base)]/50">
              <Activity size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--premium-text-muted)" }}>Systems Nominal</span>
            </div>
          </div>
        </div>

        {/* Dashboard Intelligence Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={opt.onClick}
              className="premium-card group cursor-pointer p-8 rounded-[2rem] border relative overflow-hidden"
              style={{ background: "var(--premium-raised)", borderColor: "var(--premium-border)" }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-3 py-1 rounded-full border border-[var(--premium-border)] bg-[var(--premium-base)]" style={{ color: "var(--premium-text-muted)" }}>
                  {opt.category}
                </div>

                <div className="w-16 h-16 bg-[var(--premium-base)] rounded-2xl flex items-center justify-center text-amber-500 border border-[var(--premium-border)] group-hover:border-amber-500 group-hover:bg-amber-500/10 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]">
                  {opt.icon}
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold transition-colors duration-300 group-hover:text-amber-500" style={{ color: "var(--premium-text-primary)" }}>
                    {opt.title}
                  </h2>
                  <p className="text-xs leading-relaxed font-medium" style={{ color: "var(--premium-text-muted)" }}>
                    {opt.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-amber-500 group-hover:translate-x-2 transition-transform duration-500">
                  <span className="text-[10px] font-black uppercase tracking-widest">Execute Protocol</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Architecture Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          <div className="premium-card p-8 rounded-[2rem] shadow-inner" style={{ background: "var(--premium-base)", border: "1px solid var(--premium-border)" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-[var(--premium-surface)] border border-[var(--premium-border)] text-[var(--premium-text-muted)]">
                <Layers size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "var(--premium-text-muted)" }}>Architecture Node</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--premium-text-faint)" }}>System backbone operating on high-bit encryption layers.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-1 bg-[var(--premium-surface)] rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-amber-500/30 rounded-full"></div>
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter" style={{ color: "var(--premium-text-faint)" }}>
                <span>Resource Distribution</span>
                <span className="text-[var(--premium-text-muted)]">82% Load</span>
              </div>
            </div>
          </div>

          <div className="premium-card p-8 rounded-[2rem] shadow-inner" style={{ background: "var(--premium-base)", border: "1px solid var(--premium-border)" }}>
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-[var(--premium-surface)] border border-[var(--premium-border)] text-[var(--premium-text-muted)]">
                <Database size={20} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "var(--premium-text-muted)" }}>Database Sync</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--premium-text-faint)" }}>Real-time synchronization active for global asset matrices.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--premium-text-muted)" }}>Integrity Verified</span>
            </div>
          </div>
        </div>

        {/* Master Security Notice */}
        <div className="text-center pt-20 pb-10">
          <div className="flex items-center justify-center gap-3" style={{ color: "var(--premium-text-faint)" }}>
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] leading-none">Secured Administrative Environment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;