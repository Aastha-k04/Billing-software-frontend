import React, { useState, useEffect } from "react";
import { Users, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Shield, Trash2, UserPlus, X, Search, MoreVertical, ShieldCheck, Mail, Calendar, ArrowRight } from "lucide-react";
import { showSuccess, showError, showConfirm, showWarning } from '../utils/sweetalert';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Get current user info
  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");
  const isAdmin = currentUser?.role === "admin";

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  // Add user form state
  const [addUserForm, setAddUserForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "sales"
  });

  // Fetch all users - ONLY SALES USERS
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const relevantUsers = (data.users || []).filter((user: any) =>
          user && user.username && (user.role === "sales" || user.role === "customer")
        );
        setUsers(relevantUsers);
      } else {
        showError('Sync Failed', 'Failed to synchronize user database with central matrix');
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      showError('Connectivity Error', 'Matrix connectivity failure. Unauthorized nodes detected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, []);

  // Handle password change modal
  const openPasswordModal = (user: any) => {
    setSelectedUser(user);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setShowPasswordModal(true);

  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      showWarning('Required Fields', "Protocol requires all fields to be populated");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showWarning('Insufficient Entropy', "Credential entropy insufficient (min 6 chars)");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Mismatch Detected', "Credential mismatch detected");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/password/change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showSuccess('Key Updated', 'Security credentials updated successfully');
        setTimeout(() => {
          closePasswordModal();
        }, 1500);
      } else {
        showError('Update Rejected', data.message || "Credential update rejected by security protocol");
      }
    } catch (error) {
      console.error("Password change error:", error);
      showError('Bypass Prevented', 'Security bypass prevented. Network collision data lost.');
    } finally {
      setLoading(false);
    }
  };

  // Handle add user
  const handleAddUser = async () => {
    if (!addUserForm.username || !addUserForm.password || !addUserForm.confirmPassword) {
      showWarning('Incomplete Data', "Provisioning requires complete identity data");
      return;
    }

    if (addUserForm.password.length < 6) {
      showWarning('Insufficient Entropy', "Initial credential entropy insufficient (min 6 chars)");
      return;
    }

    if (addUserForm.password !== addUserForm.confirmPassword) {
      showError('Mismatch Detected', "Initial credential mismatch detected");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: addUserForm.username,
          password: addUserForm.password,
          role: "sales"
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showSuccess('Identity Provisioned', 'New identity successfully registered in the system');
        fetchUsers();
        setTimeout(() => {
          setShowAddUserModal(false);
          setAddUserForm({ username: "", password: "", confirmPassword: "", role: "sales" });
        }, 1500);
      } else {
        showError('Provisioning Denied', data.message || "Identity registration rejected by central protocol");
      }
    } catch (error) {
      console.error("Add user error:", error);
      showError('Creation Failure', 'Identity creation failure. Network collision detected.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: any) => {
    const result = await showConfirm(
      "De-authorize Identity?",
      "Permanently de-authorize this identity? Archiving is irreversible.",
      "Purge Identity"
    );

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        showSuccess('Identity Purged', 'Identity successfully purged from central database');
        fetchUsers();
      } else {
        showError('Purge Denied', data.message || "Purge operation denied by system guard");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      showError('Integrity Lock', 'Integrity protection active. Purge sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u: any) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-premium-obsidian p-6 sm:p-8 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Elite Header */}
        <div className="premium-card p-8 rounded-[2.5rem] bg-[#0a0a0a]/80 backdrop-blur-md border border-zinc-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Users size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white mb-1">Identity Control</h1>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">Operational Access Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group hidden sm:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-amber-500 transition-colors" size={18} />
                <input
                  type="text"
                  id="user-search"
                  name="user-search"
                  placeholder="Query identities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  className="pl-12 pr-4 py-3 bg-zinc-900/40 border border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500/50 outline-none transition-all w-64 shadow-inner"
                />
              </div>
              <button
                onClick={() => {
                  setShowAddUserModal(true);
                }}
                className="bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 text-white px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-950/20 flex items-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <UserPlus size={20} />
                Provision New Access
              </button>
            </div>
          </div>
        </div>



        {/* Identity Matrix (Table) */}
        <div className="premium-card rounded-[2.5rem] bg-[#0a0a0a]/50 border border-zinc-800/50 shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-900/40 border-b border-zinc-800/80">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Validated Identity</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Operational Role</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Resource UID</th>
                  <th className="px-8 py-6 text-center text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Authorization Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                        <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Synchronizing Encrypted Identities...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Users size={48} className="text-zinc-700" />
                        <span className="text-xs font-black text-zinc-600 uppercase tracking-widest">Zero Access Protocols Active</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user: any) => (
                    <tr key={user._id} className="hover:bg-zinc-800/20 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-amber-500/30 group-hover:bg-amber-500/10 transition-all shadow-inner">
                            <span className="text-amber-500 font-black text-lg">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-100">{user.username || 'System User'}</span>
                            <span className="text-[10px] text-zinc-600 font-mono tracking-tighter">verified.access.protocol.active</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border w-fit ${user.role === "sales"
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                          }`}>
                          {user.role === "sales" ? <Shield size={12} /> : <ShieldCheck size={12} />}
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {user.role === "sales" ? "Sales Force" : "Customer"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-zinc-600 text-[11px] font-mono group-hover:text-amber-500/70 transition-colors uppercase">{user._id}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-3">
                          {user.role !== "customer" && (
                            <>
                              <button
                                onClick={() => openPasswordModal(user)}
                                className="p-3 bg-zinc-900/50 hover:bg-amber-500 hover:text-obsid-900 text-amber-500 rounded-xl border border-zinc-800 transition-all shadow-sm"
                                title="Reset Credentials"
                              >
                                <Lock size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="p-3 bg-zinc-900/50 hover:bg-red-600 hover:text-white text-zinc-500 rounded-xl border border-zinc-800 transition-all shadow-sm"
                                title="De-authorize User"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Security Credential Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="premium-card rounded-[2.5rem] w-full max-w-lg p-10 bg-[#0a0a0a] border-zinc-700/50 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Lock size={26} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Access Reset</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Credential Override Active</p>
                </div>
              </div>
              <button
                onClick={closePasswordModal}
                className="w-12 h-12 rounded-2xl bg-zinc-900/50 text-zinc-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-zinc-800"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-8 p-5 bg-zinc-900/40 rounded-2xl border border-zinc-800/50 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xs">
                {selectedUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none mb-1">Authenticated Subject</p>
                <p className="text-zinc-200 font-bold">{selectedUser?.username || 'Unknown identity'}</p>
              </div>
            </div>



            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">New Security Hash</label>
                <div className="relative group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-100 placeholder:text-zinc-700 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all pr-14 shadow-inner"
                    placeholder="Min 6 characters..."
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-500 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Re-Verify Key</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-100 placeholder:text-zinc-700 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all pr-14 shadow-inner"
                    placeholder="Verify entropy..."
                    autoComplete="new-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-amber-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={closePasswordModal}
                  disabled={loading}
                  className="flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-zinc-800/80 rounded-[1.25rem] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 text-white px-6 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-950/20 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Access Provisioning Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="premium-card rounded-[2.5rem] w-full max-w-lg p-10 bg-[#0a0a0a] border-zinc-700/50 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <UserPlus size={26} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Provision Identity</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">New Subsystem Authorization</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setAddUserForm({ username: "", password: "", confirmPassword: "", role: "sales" });
                }}
                className="w-12 h-12 rounded-2xl bg-zinc-900/50 text-zinc-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-zinc-800"
              >
                <X size={24} />
              </button>
            </div>



            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Identity Identifier</label>
                <input
                  type="text"
                  value={addUserForm.username}
                  onChange={(e) => setAddUserForm({ ...addUserForm, username: e.target.value })}
                  className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-100 placeholder:text-zinc-700 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all shadow-inner"
                  placeholder="Subject name..."
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Initial Security Hash</label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                  className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-100 placeholder:text-zinc-700 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all shadow-inner"
                  placeholder="Min 6 characters..."
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Verify Credential</label>
                <input
                  type="password"
                  value={addUserForm.confirmPassword}
                  onChange={(e) => setAddUserForm({ ...addUserForm, confirmPassword: e.target.value })}
                  className="w-full px-6 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-100 placeholder:text-zinc-700 focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all shadow-inner"
                  placeholder="Confirm entropy..."
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setAddUserForm({ username: "", password: "", confirmPassword: "", role: "sales" });
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800/50 border border-zinc-800/80 rounded-[1.25rem] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={loading}
                  className="flex-[2] bg-gradient-to-r from-amber-600 to-orange-800 hover:from-amber-500 hover:to-orange-700 text-white px-6 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-amber-950/20 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Add User"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;