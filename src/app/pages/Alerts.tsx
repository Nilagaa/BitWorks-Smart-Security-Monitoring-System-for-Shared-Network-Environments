import { Bell, CheckCircle, AlertTriangle, Info, Trash2, Eye, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useState } from "react";
import { AlertItem } from "../data/mockData";

type FilterTab = "all" | "unread" | "critical" | "warning" | "info";

export function Alerts() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const store = useStore();

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [detailAlert, setDetailAlert] = useState<AlertItem | null>(null);

  const filtered = store.alerts.filter((a) => {
    if (activeTab === "unread") return !a.read;
    if (activeTab === "critical") return a.type === "critical";
    if (activeTab === "warning") return a.type === "warning";
    if (activeTab === "info") return a.type === "info";
    return true;
  });

  const unreadCount = store.alerts.filter((a) => !a.read).length;
  const criticalCount = store.alerts.filter((a) => a.type === "critical").length;
  const warningCount = store.alerts.filter((a) => a.type === "warning").length;
  const infoCount = store.alerts.filter((a) => a.type === "info").length;

  const typeColor = (type: string) => {
    if (type === "critical") return { icon: "text-red-500", bg: "bg-red-500/10", badge: "bg-red-500/10 text-red-400" };
    if (type === "warning") return { icon: "text-yellow-500", bg: "bg-yellow-500/10", badge: "bg-yellow-500/10 text-yellow-400" };
    return { icon: "text-blue-500", bg: "bg-blue-500/10", badge: "bg-blue-500/10 text-blue-400" };
  };

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: store.alerts.length },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "critical", label: "Critical", count: criticalCount },
    { key: "warning", label: "Warnings", count: warningCount },
    { key: "info", label: "Info", count: infoCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">Security Alerts</h1>
          <p className="text-gray-400 text-sm">
            {isAdmin ? "Manage all system security notifications" : "View and acknowledge your alerts"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={store.markAllAlertsRead} disabled={unreadCount === 0}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 text-sm disabled:opacity-40">
            <CheckCircle size={16} className="mr-2" /> Mark All Read
          </Button>
          {isAdmin && (
            <Button variant="outline" onClick={store.clearAllAlerts} disabled={store.alerts.length === 0}
              className="border-gray-700 text-red-400 hover:bg-red-950/30 text-sm disabled:opacity-40">
              <Trash2 size={16} className="mr-2" /> Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Unread", count: unreadCount, color: "text-white", border: "border-gray-800", bg: "bg-blue-500/10", icon: Bell, iconColor: "text-blue-400" },
          { label: "Critical", count: criticalCount, color: "text-red-400", border: "border-red-900/40", bg: "bg-red-500/10", icon: AlertTriangle, iconColor: "text-red-500" },
          { label: "Warnings", count: warningCount, color: "text-yellow-400", border: "border-yellow-900/40", bg: "bg-yellow-500/10", icon: AlertTriangle, iconColor: "text-yellow-500" },
          { label: "Info", count: infoCount, color: "text-blue-400", border: "border-blue-900/40", bg: "bg-blue-500/10", icon: Info, iconColor: "text-blue-500" },
        ].map((s) => (
          <div key={s.label} className={`bg-[#0f1420] border ${s.border} rounded-lg p-4`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${s.bg} rounded-lg`}><s.icon className={s.iconColor} size={18} /></div>
              <div>
                <p className="text-gray-400 text-xs">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.color}`}>{s.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-2 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === tab.key
                ? isAdmin ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}>
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-gray-700"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      {filtered.length === 0 ? (
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-12 text-center">
          <Bell className="text-gray-600 mx-auto mb-3" size={36} />
          <p className="text-gray-500 text-sm">No alerts in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const c = typeColor(alert.type);
            return (
              <div key={alert.id}
                className={`bg-[#0f1420] border rounded-lg p-5 transition-colors ${!alert.read ? "border-blue-600/40" : "border-gray-800"} hover:border-gray-600`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg ${c.bg} flex-shrink-0`}>
                    <AlertTriangle className={c.icon} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold text-sm">{alert.title}</h3>
                        {!alert.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.badge}`}>{alert.type.toUpperCase()}</span>
                      </div>
                      <span className="text-gray-500 text-xs flex-shrink-0">{alert.timestamp}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{alert.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => setDetailAlert(alert)}
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 text-xs h-8">
                        <Eye size={13} className="mr-1" /> View Details
                      </Button>
                      {!alert.read && (
                        <Button variant="outline" size="sm" onClick={() => store.markAlertRead(alert.id)}
                          className={`border-gray-700 hover:bg-gray-800 text-xs h-8 ${isAdmin ? "text-blue-400" : "text-green-400"}`}>
                          <CheckCircle size={13} className="mr-1" /> Mark as Read
                        </Button>
                      )}
                      {isAdmin && (
                        <Button variant="outline" size="sm" onClick={() => { store.removeAlert(alert.id); if (detailAlert?.id === alert.id) setDetailAlert(null); }}
                          className="border-gray-700 text-red-400 hover:bg-red-950/30 text-xs h-8">
                          <Trash2 size={13} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {detailAlert && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1420] border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Alert Details</h3>
              <button onClick={() => setDetailAlert(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-start gap-4">
                <span className="text-gray-400 flex-shrink-0">Title</span>
                <span className="text-white text-right">{detailAlert.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor(detailAlert.type).badge}`}>{detailAlert.type.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`text-sm ${detailAlert.read ? "text-gray-400" : "text-blue-400"}`}>{detailAlert.read ? "Read" : "Unread"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timestamp</span>
                <span className="text-white">{detailAlert.timestamp}</span>
              </div>
              <div className="pt-3 border-t border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Description</p>
                <p className="text-gray-300">{detailAlert.description}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {!detailAlert.read && (
                <Button onClick={() => { store.markAlertRead(detailAlert.id); setDetailAlert(null); }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">Mark as Read</Button>
              )}
              <Button variant="outline" onClick={() => setDetailAlert(null)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 text-sm">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
