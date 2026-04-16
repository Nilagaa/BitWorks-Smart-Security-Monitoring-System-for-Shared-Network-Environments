import { Activity, Globe, Monitor, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

export function NetworkTraffic() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const store = useStore();

  const totalEvents = store.chartData.reduce((s, d) => s + d.events, 0);
  const totalLogins = store.chartData.reduce((s, d) => s + d.logins, 0);
  const restrictedAttempts = store.restrictedDomains.reduce((s, d) => s + d.attempts, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-semibold mb-1">Monitoring Overview</h1>
        <p className="text-gray-400 text-sm">
          {isAdmin ? "Domain-level activity monitoring across all workstations" : "Activity monitoring for your assigned workstations"}
        </p>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Monitored Events</span>
            <Activity className={isAdmin ? "text-blue-500" : "text-green-500"} size={20} />
          </div>
          <div className="text-white text-3xl font-semibold">{totalEvents + totalLogins}</div>
          <div className="text-gray-500 text-xs mt-1">Today — updates live</div>
        </div>
        <div className="bg-[#0f1420] border border-red-900/40 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Restricted Domain Attempts</span>
            <Globe className="text-red-400" size={20} />
          </div>
          <div className="text-red-400 text-3xl font-semibold">{restrictedAttempts}</div>
          <div className="text-gray-500 text-xs mt-1">Blocked by monitoring rules</div>
        </div>
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Workstations</span>
            <Monitor className={isAdmin ? "text-blue-500" : "text-green-500"} size={20} />
          </div>
          <div className="text-white text-3xl font-semibold">{store.workstationStats.length}</div>
          <div className="text-gray-500 text-xs mt-1">With recorded activity</div>
        </div>
      </div>

      {/* Live Event Trend Chart */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
        <h2 className="text-white text-base font-semibold mb-4">Event Trend — Today (Hourly)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={store.chartData}>
            <defs>
              <linearGradient id="gLogin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gEvent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="time" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #374151", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
            <Area type="monotone" dataKey="logins" stroke="#3b82f6" fill="url(#gLogin)" name="Login Events" strokeWidth={2} />
            <Area type="monotone" dataKey="events" stroke="#f59e0b" fill="url(#gEvent)" name="Security Events" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Top Workstations */}
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
          <h2 className="text-white text-base font-semibold mb-4">Top Workstations by Activity</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={store.workstationStats.slice(0, 6)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 11 }} />
              <YAxis dataKey="workstation" type="category" stroke="#6b7280" tick={{ fontSize: 11 }} width={50} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #374151", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
              <Bar dataKey="events" fill={isAdmin ? "#3b82f6" : "#10b981"} name="Events" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Restricted Domains */}
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
          <h2 className="text-white text-base font-semibold mb-4">Restricted Domain Attempts</h2>
          {store.restrictedDomains.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No restricted domain attempts recorded.</p>
          ) : (
            <div className="space-y-3">
              {store.restrictedDomains.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#1a1f2e] border border-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-red-500/10 rounded">
                      <Globe className="text-red-400" size={14} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-mono">{d.domain}</p>
                      <p className="text-gray-500 text-xs">{d.workstation} · Last: {d.lastAttempt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="text-red-400" size={14} />
                    <span className="text-red-400 text-sm font-semibold">{d.attempts}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
