import { AlertTriangle, Shield, Search, Eye, CheckCircle, Trash2, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { SecurityEvent } from "../data/mockData";

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export function SuspiciousActivity() {
  const store = useStore();
  const [search, setSearch] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [detailEvent, setDetailEvent] = useState<SecurityEvent | null>(null);

  const filtered = store.securityEvents
    .filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        e.type.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.workstation.toLowerCase().includes(q) ||
        e.source.includes(q);
      const matchSev = filterSeverity === "All" || e.severity === filterSeverity.toLowerCase();
      const matchStat = filterStatus === "All" || e.status === filterStatus;
      return matchSearch && matchSev && matchStat;
    })
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  const counts = {
    critical: store.securityEvents.filter((e) => e.severity === "critical").length,
    high: store.securityEvents.filter((e) => e.severity === "high").length,
    medium: store.securityEvents.filter((e) => e.severity === "medium").length,
    open: store.securityEvents.filter((e) => e.status === "Open").length,
  };

  const severityColor = (s: string) => {
    if (s === "critical") return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-900/50", badge: "bg-red-500/10 text-red-400" };
    if (s === "high") return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-900/50", badge: "bg-orange-500/10 text-orange-400" };
    if (s === "medium") return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-900/50", badge: "bg-yellow-500/10 text-yellow-400" };
    return { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-900/50", badge: "bg-blue-500/10 text-blue-400" };
  };

  const statusColor = (s: string) => {
    if (s === "Open") return "bg-red-500/10 text-red-400";
    if (s === "Reviewed") return "bg-blue-500/10 text-blue-400";
    return "bg-green-500/10 text-green-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">Detected Activities</h1>
          <p className="text-gray-400 text-sm">Rule-based security event detection</p>
        </div>
        <Button variant="outline" onClick={store.markAllEventsReviewed}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 text-sm">
          <CheckCircle size={16} className="mr-2" /> Mark All Reviewed
        </Button>
      </div>

      {/* Live Severity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Critical", count: counts.critical, color: "text-red-400", border: "border-red-900/40", bg: "bg-red-500/10" },
          { label: "High", count: counts.high, color: "text-orange-400", border: "border-orange-900/40", bg: "bg-orange-500/10" },
          { label: "Medium", count: counts.medium, color: "text-yellow-400", border: "border-yellow-900/40", bg: "bg-yellow-500/10" },
          { label: "Open", count: counts.open, color: "text-blue-400", border: "border-blue-900/40", bg: "bg-blue-500/10" },
        ].map((s) => (
          <div key={s.label} className={`bg-[#0f1420] border ${s.border} rounded-lg p-4`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${s.bg} rounded-lg`}><AlertTriangle className={s.color} size={18} /></div>
              <div>
                <p className="text-gray-400 text-xs">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.color}`}>{s.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by type, workstation, or IP..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
          </div>
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Resolved">Resolved</option>
          </select>
          <span className="text-gray-500 text-xs">{filtered.length} event(s)</span>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-10 text-center">
            <Shield className="text-gray-600 mx-auto mb-3" size={36} />
            <p className="text-gray-500 text-sm">No events match your filters.</p>
          </div>
        ) : filtered.map((event) => {
          const c = severityColor(event.severity);
          return (
            <div key={event.id} className={`bg-[#0f1420] border ${c.border} rounded-lg p-5 hover:border-gray-600 transition-colors`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2.5 rounded-lg ${c.bg} flex-shrink-0`}>
                    <AlertTriangle className={c.text} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-white font-semibold text-sm">{event.type}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.badge}`}>{event.severity.toUpperCase()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(event.status)}`}>{event.status}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span>Source: <span className="text-gray-300 font-mono">{event.source}</span></span>
                      <span>Workstation: <span className="text-gray-300">{event.workstation}</span></span>
                      <span>Time: <span className="text-gray-300">{event.timestamp}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => setDetailEvent(event)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 text-xs h-8">
                    <Eye size={13} className="mr-1" /> Details
                  </Button>
                  {event.status === "Open" && (
                    <Button variant="outline" size="sm" onClick={() => store.updateEventStatus(event.id, "Reviewed")}
                      className="border-blue-700/50 text-blue-400 hover:bg-blue-950/30 text-xs h-8">
                      <CheckCircle size={13} className="mr-1" /> Review
                    </Button>
                  )}
                  {event.status === "Reviewed" && (
                    <Button variant="outline" size="sm" onClick={() => store.updateEventStatus(event.id, "Resolved")}
                      className="border-green-700/50 text-green-400 hover:bg-green-950/30 text-xs h-8">
                      <CheckCircle size={13} className="mr-1" /> Resolve
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => { store.removeSecurityEvent(event.id); if (detailEvent?.id === event.id) setDetailEvent(null); }}
                    className="border-gray-700 text-red-400 hover:bg-red-950/30 text-xs h-8">
                    <Trash2 size={13} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {detailEvent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1420] border border-gray-700 rounded-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Event Details</h3>
              <button onClick={() => setDetailEvent(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { label: "Event Type", value: detailEvent.type },
                { label: "Source IP", value: detailEvent.source },
                { label: "Workstation", value: detailEvent.workstation },
                { label: "Timestamp", value: detailEvent.timestamp },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="text-white font-mono">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="text-gray-400">Severity</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColor(detailEvent.severity).badge}`}>{detailEvent.severity.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(detailEvent.status)}`}>{detailEvent.status}</span>
              </div>
              <div className="pt-3 border-t border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Description</p>
                <p className="text-gray-300">{detailEvent.description}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {detailEvent.status === "Open" && (
                <Button onClick={() => { store.updateEventStatus(detailEvent.id, "Reviewed"); setDetailEvent(null); }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">Mark Reviewed</Button>
              )}
              {detailEvent.status === "Reviewed" && (
                <Button onClick={() => { store.updateEventStatus(detailEvent.id, "Resolved"); setDetailEvent(null); }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm">Mark Resolved</Button>
              )}
              <Button variant="outline" onClick={() => setDetailEvent(null)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 text-sm">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
