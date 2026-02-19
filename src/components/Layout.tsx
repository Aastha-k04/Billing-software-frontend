import React, { useState, useEffect } from "react";
import {
  Home,
  FileText,
  Package,
  Settings,
  Menu,
  X,
  User,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logos from '../../public/logo.jpg';

// ==================== LAYOUT COMPONENT ====================
function Layout({ children }: any) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const currentPage = window.location.pathname.slice(1); // Get current page from URL path

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define menu items with role-based access
  const allMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "dashboard",
      roles: ["sales", "admin"] // Both admin and sales can access dashboard
    },
    {
      id: "customer-quotations",
      label: "My Quotations",
      icon: <FileText size={20} />,
      path: "customer-quotations",
      roles: ["customer"]
    },
    {
      id: "quotation",
      label: "New Quotation",
      icon: <FileText size={20} />,
      path: "quotation",
      roles: ["sales"] // Both can create quotations
    },
    {
      id: "items",
      label: "Catalog",
      icon: <Package size={20} />,
      path: "items",
      roles: ["admin", "customer", "sales"] // Everyone can see items
    },
    {
      id: "user",
      label: "User Management",
      icon: <Package size={20} />,
      path: "user",
      roles: ["admin"] // Only admin can manage items
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "settings",
      roles: ["admin"] // Both can access settings to change password
    },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen antialiased selection:bg-amber-500/20" style={{ background: "var(--premium-base)" }}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0"} sidebar-premium text-premium-alabaster transition-all duration-300 overflow-hidden fixed md:relative h-full z-50`}
      >
        <div className="p-6" style={{ borderBottom: "1px solid var(--premium-border)" }}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-800 flex items-center justify-center shadow-lg shadow-amber-900/20 text-white font-bold text-xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">QUAN<span className="text-amber-500">TILE</span></h1>
              <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--premium-text-muted)" }}>Management</p>
            </div>
          </div>
        </div>

        {/* User Info Section */}
        {user && (
          <div className="px-4 py-3 bg-[var(--premium-base)]/30" style={{ borderBottom: "1px solid var(--premium-border)" }}>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-[var(--premium-surface)] border border-[var(--premium-border)] rounded-full flex items-center justify-center shadow-inner">
                <User size={16} className="text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white truncate max-w-[120px]">{user.username}</p>
                <p className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: "var(--premium-text-muted)" }}>
                  {user.role === "admin" ? "Administrator" : user.role === "customer" ? "Valued Customer" : "Sales Force"}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="p-4 space-y-1.5 flex-1">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/${item.path}`);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full nav-item-premium ${currentPage === item.path ? "active" : ""}`}
              >
                <div className="transition-colors">
                  {item.icon}
                </div>
                <span className="font-semibold text-sm tracking-wide">{item.label}</span>
              </button>
            ))
          ) : (
            <div className="text-center text-zinc-600 text-sm py-4">
              No menu items available
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--premium-surface)]" style={{ borderTop: "1px solid var(--premium-border)" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-all text-[var(--premium-text-muted)] hover:text-red-500 group"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="px-6 py-4 relative z-40 bg-[var(--premium-surface)]/80 backdrop-blur-xl" style={{ borderBottom: "1px solid var(--premium-border)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 border border-[var(--premium-border)] text-[var(--premium-text-muted)] hover:text-amber-500 rounded-lg transition-all active:scale-95 bg-[var(--premium-raised)]"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="flex flex-col">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] leading-none mb-1" style={{ color: "var(--premium-text-faint)" }}>Navigation / Workspace</p>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {menuItems.find(item => item.path === currentPage)?.label || "Dashboard"}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-white leading-tight">
                  {user?.username || "Guest User"}
                </p>
                <p className="text-[10px] uppercase font-black tracking-widest mt-0.5" style={{ color: "var(--premium-text-muted)" }}>
                  {user?.role === "admin" ? "Systems Administrator" : user?.role === "customer" ? "Customer Member" : "Sales Representative"}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-full flex items-center justify-center shadow-lg shadow-amber-900/10">
                <User size={20} className="text-amber-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto custom-scrollbar">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default Layout;