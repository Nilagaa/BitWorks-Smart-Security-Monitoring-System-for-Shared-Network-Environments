import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  AlertTriangle,
  Bell,
  BarChart3,
  Settings,
  Shield,
  ChevronDown,
  Search,
  Menu,
  UserCog,
  X,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

const adminNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "User Management", href: "/users", icon: Users },
  { name: "Role Management", href: "/roles", icon: UserCog },
  { name: "Login Records", href: "/login-records", icon: FileText },
  { name: "Monitoring Overview", href: "/network-traffic", icon: Activity },
  { name: "Detected Activities", href: "/suspicious-activity", icon: AlertTriangle },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

const staffNav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Monitoring Overview", href: "/network-traffic", icon: Activity },
  { name: "Detected Activities", href: "/suspicious-activity", icon: AlertTriangle },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Reports", href: "/reports", icon: BarChart3 },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin";
  const navigation = isAdmin ? adminNav : staffNav;
  const store = useStore();
  const unreadCount = store.unreadAlertCount;

  const handleSignOut = () => {
    signOut();
    navigate("/signin");
  };

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0f1420] border-r border-gray-800 transition-all duration-300 z-40 flex flex-col ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-800 flex-shrink-0">
          <div className={`p-1.5 rounded-lg ${isAdmin ? "bg-blue-600" : "bg-green-600"}`}>
            <Shield className="text-white" size={20} />
          </div>
          {sidebarOpen && (
            <div className="ml-3 overflow-hidden">
              <span className="text-white font-semibold text-base block leading-tight">BitWorks</span>
              <span className={`text-xs ${isAdmin ? "text-blue-400" : "text-green-400"}`}>
                {user?.role} Portal
              </span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              title={!sidebarOpen ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 mb-1 rounded-lg transition-colors group ${
                  isActive
                    ? isAdmin
                      ? "bg-blue-600 text-white"
                      : "bg-green-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className="flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="ml-3 text-sm truncate">{item.name}</span>
                  )}
                  {/* Alert badge on Alerts nav item */}
                  {item.name === "Alerts" && unreadCount > 0 && sidebarOpen && (
                    <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-medium ${isActive ? "bg-white/20 text-white" : "bg-red-500 text-white"}`}>
                      {unreadCount}
                    </span>
                  )}
                  {item.name === "Alerts" && unreadCount > 0 && !sidebarOpen && (
                    <span className="absolute left-8 top-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info at bottom */}
        {sidebarOpen && (
          <div className="p-3 border-t border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-[#1a1f2e]">
              <Avatar className="w-7 h-7">
                <AvatarFallback className={`text-xs ${isAdmin ? "bg-blue-600" : "bg-green-600"} text-white`}>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{user?.name}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <header className="h-16 bg-[#0f1420] border-b border-gray-800 flex items-center justify-between px-5 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 w-56 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifPanel && (
                <div className="absolute right-0 top-12 w-80 bg-[#0f1420] border border-gray-700 rounded-xl shadow-2xl z-50">
                  <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <Shield className="text-blue-500" size={17} />
                      <span className="text-white font-semibold text-sm">Notifications</span>
                    </div>
                    <button onClick={() => setShowNotifPanel(false)} className="text-gray-400 hover:text-white">
                      <X size={17} />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {store.alerts.filter((a) => !a.read).slice(0, 8).map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              alert.type === "critical" ? "bg-red-500" : alert.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                            }`}
                          />
                          <div>
                            <p className="text-white text-xs font-medium leading-snug">{alert.title}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{alert.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-700">
                    <button
                      onClick={() => { setShowNotifPanel(false); navigate("/alerts"); }}
                      className="w-full text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                    >
                      View All Alerts →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`text-xs ${isAdmin ? "bg-blue-600" : "bg-green-600"} text-white`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <div className="text-sm text-white flex items-center gap-2">
                    {user?.name}
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        isAdmin
                          ? "border-blue-500 text-blue-400 bg-blue-500/10"
                          : "border-green-500 text-green-400 bg-green-500/10"
                      }`}
                    >
                      {user?.role}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400">{user?.email}</div>
                </div>
                <ChevronDown size={15} className="text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-[#1a1f2e] border-gray-700">
                <DropdownMenuLabel className="text-gray-400 text-xs">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-white text-sm cursor-pointer">
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-white text-sm cursor-pointer">
                  Security
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/login-records")}
                  className="text-gray-300 focus:bg-gray-800 focus:text-white text-sm cursor-pointer"
                >
                  Activity Log
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 focus:bg-gray-800 focus:text-red-400 cursor-pointer text-sm"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
