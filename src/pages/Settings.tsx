import React, { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, User, Shield, Key, ShieldCheck, RefreshCcw, ArrowRight, X } from "lucide-react";

function Settings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Get user info from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : { username: "Administrator", role: "admin", id: "0xACCESS" };
  const token = localStorage.getItem("token");

  // Form state
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: "error", text: "Security protocol requires all fields" });
      return false;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New hash length must be at least 6 characters" });
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Hashing mismatch detected in confirmation" });
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: "error", text: "New credential cannot match legacy record" });
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/password/admin-change-own`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          adminId: user?.id,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ type: "success", text: "Security credentials successfully updated" });
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        setMessage({
          type: "error",
          text: data.message || "Credential synchronization failure"
        });
      }

    } catch (error) {
      setMessage({
        type: "error",
        text: "Matrix transmission error. Retrying..."
      });
    }

    setLoading(false);
  };

  const handleClear = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="min-h-screen bg-premium-obsidian p-6 sm:p-8 text-zinc-100 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Modern Header */}
        <div className="premium-card p-10 rounded-[3rem] bg-[#0a0a0a]/80 backdrop-blur-md border border-zinc-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                <Shield size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-1">Global Preferences</h1>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em]">Advanced Control Matrix</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Account Summary */}
          <div className="lg:col-span-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

              {/* Account Profile Card */}
              <div className="premium-card p-8 rounded-[2.5rem] bg-[#0a0a0a]/50 border border-zinc-800/80 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <User className="text-amber-500" size={20} />
                    <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Identity Profile</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Subject Identifier</span>
                      <span className="text-lg font-bold text-zinc-200">{user?.username || "N/A"}</span>
                    </div>

                    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Protocol Authority</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user?.role === "admin" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700"
                          }`}>
                          {user?.role === "admin" ? "Level 1 Administrator" : "Sales Operator"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Hex UID</span>
                      <span className="text-xs font-mono text-zinc-500 truncate">{user?.id || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-800/80">
                  <div className="flex items-center gap-3 text-emerald-500/80">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Identity encryption active</span>
                  </div>
                </div>
              </div>

              {/* Change Password Matrix */}
              <div className="premium-card p-8 rounded-[2.5rem] bg-[#0a0a0a]/50 border border-zinc-800/80 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-8 border-b border-zinc-800/80 pb-6">
                  <Key className="text-amber-500" size={20} />
                  <h2 className="text-sm font-black text-zinc-400 uppercase tracking-widest">Access Rotation</h2>
                </div>

                {message.text && (
                  <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 border ${message.type === "success"
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-500"
                    : "bg-red-950/20 border-red-500/30 text-red-500"
                    }`}>
                    {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <p className="text-[10px] font-black uppercase tracking-widest">{message.text}</p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Legacy Credential</label>
                    <div className="relative group">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-200 placeholder:text-zinc-700 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/50 outline-none transition-all pr-12 shadow-inner"
                        placeholder="Current secret..."
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-500 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Proposed Hash</label>
                    <div className="relative group">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-200 placeholder:text-zinc-700 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/50 outline-none transition-all pr-12 shadow-inner"
                        placeholder="New secret entropy..."
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-500 transition-colors"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirm Protocol</label>
                    <div className="relative group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-200 placeholder:text-zinc-700 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/50 outline-none transition-all pr-12 shadow-inner"
                        placeholder="Re-verify entropy..."
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-500 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="sm:col-span-3 bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-950/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <RefreshCcw size={16} />
                          Commit Hash Rotation
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleClear}
                      disabled={loading}
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-zinc-800 transition-all flex items-center justify-center"
                      title="Abort Operation"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Architecture Tips */}
            <div className="premium-card p-10 rounded-[3rem] bg-gradient-to-r from-amber-600/5 to-transparent border border-amber-500/10 shadow-inner">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-4">
                  <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <AlertCircle size={16} />
                    Security Integrity Protocols
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium">Rotate access credentials every 90 planetary cycles to maintain encryption depth.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium">Ensure credential entropy includes alphanumeric high-bit characters.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium">Never share system-level identifiers across non-encrypted channels.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-medium">Authorization logs are archived globally for identity verification.</p>
                    </div>
                  </div>
                </div>
                <div className="md:w-px bg-zinc-800/80"></div>
                <div className="flex flex-col justify-center gap-2">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Network Status</span>
                  <div className="flex items-center gap-2 py-2 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Secured Node</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;