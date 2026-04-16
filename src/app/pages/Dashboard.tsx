import { Users, Activity, AlertTriangle, Shield, Clock, FlaskConical, ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { StatCard } from "../components/StatCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useState, useMemo } from "react";

const DEMO_DOMAINS = ["social-media.example.com", "gambling.example.com", "streaming.example.com", "gaming.example.com"];
const DEMO_WS = ["PC-03", "PC-05", "PC-08", "PC-11", "PC-13"];
const DEMO_IPS = ["192.168.1.71", "192.168.1.82", "192.168.1.93", "192.168.1.104"];
const DEMO_USERS = [
  { name: "Test User A", email: "testa@bitworks.com", workstation: "PC-16" },
  { name: "Test User B", email: "testb@bitworks.com", workstation: "PC-17" },
  { name: "Test User C", email: "testc@bitworks.com", workstation: "PC-18" },
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function buildDateRangeData(start: string, end: string) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) return null;
  const diffDays = Math.round((e.getTime() - s.getTime()) / 86400000);
  if (diffDays === 0) return null;
  const points = [];
  for (let i = 0; i <= diffDays; i++) {
    const d = new Date(s);
    d.setDate(s.getDate() + i);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const seed = i + 1;
    points.push({
      time: label,
      logins: Math.round(20 + seed * 7 + Math.sin(seed) * 8),
      events: Math.round(4 + seed * 2 + Math.cos(seed) * 3),
    });
  }
  return points;
}

export function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const store = useStore();
  const [demoPanelOpen, setDemoPanelOpen] = useState(false);
  const [demoLog, setDemoLog] = useState<string[]>([]);

  const todayStr = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [dateError, setDateError] = useState("");

  const handleStartChange = (val: string) => {
    setStartDate(val);
    setDateError("");
    if (endDate && val > endDate) setDateError("Start date cannot be after end date.");
  };

  const handleEndChange = (val: string) => {
    setEndDate(val);
    setDateError("");
    if (startDate && val < startDate) setDateError("End date cannot be before start date.");
  };

  const chartData = useMemo(() => {
    if (startDate === endDate || !startDate || !endDate) return store.chartData;
    return buildDateRangeData(startDate, endDate) ?? store.chartData;
  }, [startDate, endDate, store.chartData]);

  const isMultiDay = startDate !== endDate && !!startDate && !!endDate && !dateError;

  const log = (msg: string) => setDemoLog((p) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 9)]);

  const triggerFailedLogin = () => {
    const u = pick(DEMO_USERS);
    const ip = pick(DEMO_IPS);
    const ws = pick(DEMO_WS);
    store.pushLoginRecord({
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      user: u.email, ip, workstation: ws, device: "Windows PC", status: "Failed",
    });
    log(`Failed login: ${u.email} from ${ws} (${ip})`);
  };

  const triggerRestrictedDomain = () => {
    const domain = pick(DEMO_DOMAINS);
    const ws = pick(DEMO_WS);
    const ip = pick(DEMO_IPS);
    store.simulateDomainAccess(domain, ws, ip);
    log(`Restricted domain access: ${domain} from ${ws}`);
  };

  const triggerAddUser = () => {
    const u = pick(DEMO_USERS);
    store.addUser({ ...u, role: "Staff", status: "Active", lastLogin: "Just now" });
    log(`Added test user: ${u.email}`);
  };

  const triggerAlert = () => {
    store.addAlert({
      type: "warning",
      title: "Demo Alert Generated",
      description: `A simulated security alert was triggered from the demo panel at ${new Date().toLocaleTimeString()}.`,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      read: false,
    });
    log("Generated demo alert");
  };

  const triggerInactiveLogin = () => {
    const ws = pick(DEMO_WS);
    const ip = pick(DEMO_IPS);
    const ts = new Date().toISOString().replace("T", " ").slice(0, 19);
    store.pushLoginRecord({ timestamp: ts, user: "ana.lim@bitworks.com", ip, workstation: ws, device: "Windows PC", status: "Failed" });
    store.addSecurityEvent({
      severity: "medium",
      type: "Inactive User Login Attempt",
      description: `Inactive account ana.lim@bitworks.com attempted to log in from ${ws} (${ip}).`,
      source: ip, workstation: ws, timestamp: ts, status: "Open",
    });
    log(`Inactive user login attempt from ${ws}`);
  };

  const recentAlerts = store.alerts.slice(0, 4);
  const recentActivity = store.loginRecords.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">
            {isAdmin ? "Admin Control Center" : "Staff Monitoring Dashboard"}
          </h1>
          <p className="text-gray-400 text-sm">
            {isAdmin ? "System overview and management controls" : "Activity monitoring and security overview"}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setDemoPanelOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 border border-purple-500/40 rounded-lg text-purple-400 hover:bg-purple-600/30 transition-colors text-xs font-medium"
          >
            <FlaskConical size={14} />
            Demo Panel
            {demoPanelOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>

      {/* Demo Panel */}
      {isAdmin && demoPanelOpen && (
        <div className="bg-[#0f1420] border border-purple-500/30 rounded-xl p-5">
          <p className="text-purple-400 text-xs font-semibold mb-3 uppercase tracking-wider">
            Demo Simulation Panel — triggers update all pages instantly
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={triggerFailedLogin} className="px-3 py-2 bg-red-600/20 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-600/30 text-xs font-medium transition-colors">
              Trigger Failed Login
            </button>
            <button onClick={triggerRestrictedDomain} className="px-3 py-2 bg-orange-600/20 border border-orange-500/40 rounded-lg text-orange-400 hover:bg-orange-600/30 text-xs font-medium transition-colors">
              Simulate Restricted Domain
            </button>
            <button onClick={triggerInactiveLogin} className="px-3 py-2 bg-yellow-600/20 border border-yellow-500/40 rounded-lg text-yellow-400 hover:bg-yellow-600/30 text-xs font-medium transition-colors">
              Inactive User Attempt
            </button>
            <button onClick={triggerAddUser} className="px-3 py-2 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-400 hover:bg-blue-600/30 text-xs font-medium transition-colors">
              Add Test User
            </button>
            <button onClick={triggerAlert} className="px-3 py-2 bg-purple-600/20 border border-purple-500/40 rounded-lg text-purple-400 hover:bg-purple-600/30 text-xs font-medium transition-colors">
              Generate Alert
            </button>
          </div>
          {demoLog.length > 0 && (
            <div className="bg-[#0a0e1a] border border-gray-800 rounded-lg p-3 max-h-28 overflow-y-auto">
              {demoLog.map((entry, i) => (
                <p key={i} className="text-gray-400 text-xs font-mono leading-relaxed">{entry}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {isAdmin && (
          <StatCard
            title="Total Users"
            value={String(store.users.length)}
            icon={Users}
            trend={{ value: `${store.users.filter((u) => u.status === "Inactive").length} inactive`, isPositive: false }}
            color="blue"
          />
        )}
        <StatCard title="Active Sessions" value={String(store.activeSessions)} icon={Activity} trend={{ value: "Currently online", isPositive: true }} color="green" />
        <StatCard title="Failed Login Attempts" value={String(store.failedLoginCount)} icon={AlertTriangle} trend={{ value: "Today", isPositive: false }} color="red" />
        <StatCard title="Unread Alerts" value={String(store.unreadAlertCount)} icon={Shield} trend={{ value: "Require attention", isPositive: false }} color="yellow" />
        {!isAdmin && (
          <StatCard title="Monitored Events" value={String(store.securityEvents.length)} icon={Activity} trend={{ value: "Total detected", isPositive: true }} color="blue" />
        )}
      </div>

      {/* Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0f1420] border border-gray-800 rounded-lg p-6">

          {/* Chart header with date range pickers */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-white text-base font-semibold">Activity Monitoring Overview</h2>
              <p className="text-gray-500 text-xs mt-0.5">
                {isMultiDay
                  ? `${new Date(startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — ${new Date(endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · daily`
                  : "Today — hourly (live)"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-gray-500 flex-shrink-0 mt-4" />
                <div className="flex flex-col">
                  <label className="text-gray-500 text-xs mb-0.5">Start date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartChange(e.target.value)}
                    className="px-2 py-1.5 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <span className="text-gray-600 text-xs mt-4">to</span>
              <div className="flex flex-col">
                <label className="text-gray-500 text-xs mb-0.5">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndChange(e.target.value)}
                  className="px-2 py-1.5 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              {(startDate !== todayStr || endDate !== todayStr) && (
                <button
                  onClick={() => { setStartDate(todayStr); setEndDate(todayStr); setDateError(""); }}
                  className="mt-4 px-2 py-1.5 bg-gray-700/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 text-xs transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {dateError && (
            <p className="text-red-400 text-xs mb-3">{dateError}</p>
          )}

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #374151", borderRadius: "8px", color: "#fff", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
              <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} dot={isMultiDay ? { r: 3, fill: "#3b82f6" } : false} name="Login Events" />
              <Line type="monotone" dataKey="events" stroke="#f59e0b" strokeWidth={2} dot={isMultiDay ? { r: 3, fill: "#f59e0b" } : false} name="Security Events" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
          <h2 className="text-white text-base font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {recentAlerts.length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-4">No alerts.</p>
            ) : (
              recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border transition-colors ${!alert.read ? "bg-[#1a1f2e] border-blue-600/40" : "bg-[#1a1f2e] border-gray-700"}`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span className={`inline-block w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.type === "critical" ? "bg-red-500" : alert.type === "warning" ? "bg-yellow-500" : "bg-blue-500"}`} />
                    <p className="text-white text-xs leading-relaxed">{alert.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs ml-4">
                    <Clock size={10} />
                    <span>{alert.timestamp.split(" ")[1]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
        <h2 className="text-white text-base font-semibold mb-4">
          Recent Activity Log
          <span className="ml-2 text-xs text-gray-500 font-normal">({store.loginRecords.length} total)</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 text-xs font-medium pb-3 px-3">Timestamp</th>
                <th className="text-left text-gray-400 text-xs font-medium pb-3 px-3">User</th>
                <th className="text-left text-gray-400 text-xs font-medium pb-3 px-3">Workstation</th>
                <th className="text-left text-gray-400 text-xs font-medium pb-3 px-3">IP Address</th>
                <th className="text-left text-gray-400 text-xs font-medium pb-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((log) => (
                <tr key={log.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-3 text-gray-400 text-xs">{log.timestamp}</td>
                  <td className="py-3 px-3 text-gray-300 text-xs">{log.user}</td>
                  <td className="py-3 px-3 text-gray-300 text-xs">{log.workstation}</td>
                  <td className="py-3 px-3 text-gray-300 text-xs font-mono">{log.ip}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${log.status === "Success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
