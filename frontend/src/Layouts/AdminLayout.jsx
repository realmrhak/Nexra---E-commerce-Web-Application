import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  Tags,
  Users,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/inventory", label: "Inventory", icon: Package },
  { to: "/admin/products/new", label: "Add Product", icon: PlusCircle },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Page title based on route
  const pageTitle =
    NAV_ITEMS.find((n) =>
      n.exact ? location.pathname === n.to : location.pathname.startsWith(n.to),
    )?.label || "Admin";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname === item.to;

  return (
    <div className="adminLayout">
      {/* Mobile backdrop */}
      <div
        className={`adminSidebarBackdrop ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`adminSidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="adminBrand">
          <Store size={22} />
          <span>
            Ne<span className="brand-x">x</span>ra
          </span>
        </div>
        <ul className="adminNav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link to={item.to} className={isActive(item) ? "active" : ""}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="adminFooter">
          <button onClick={handleLogout} className="adminLogoutBtn">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="adminMain">
        <header className="adminTopbar">
          <button
            className="menuToggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="pageTitle">{pageTitle}</h1>

          <div className="adminTopbarRight">
            {/* Back to store */}
            <Link to="/" className="adminBackToStore" title="Back to Store">
              <ArrowLeft size={16} />
              <span className="backText">Store</span>
            </Link>

            {/* User avatar */}
            <Link to="/profile" className="adminUser">
              <div className="avatar">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <span className="adminUserName">
                {user?.name?.split(" ")[0] || "Admin"}
              </span>
            </Link>
          </div>
        </header>

        <main className="adminContent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
