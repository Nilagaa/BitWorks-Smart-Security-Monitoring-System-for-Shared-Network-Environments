import { Download, FileText, Calendar, Eye, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

const loginByDay = [
  { day: "Mon", successful: 38, failed: 4 },
  { day: "Tue", successful: 42, failed: 6 },
  { day: "Wed", successful: 35, failed: 8 },
  { day: "Thu", successful: 47, failed: 12 },
  { day: "Fri", successful: 40, failed: 5 },
  { day: "Sat", successful: 18, failed: 2 },
  { day: "Sun", successful: 10, failed: 1 },
];

const REPORT_TYPES = [
  { value: "security", label: "Security Overview" },
  { value: "login", label: "Login Activity" },
  { value: "events", label: "Monitored Events" },
  { value: "domains", label: "Restricted Domain Activity" },
  { value: "alerts", label: "Alert Summary" },
];

interface GeneratedReport {
  id: number;
  name: string;
  type: string;
  date: string;
  rows: number;
  csvData: string;
}

export function Reports() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const store = useStore();

  const [reportType, setReportType] = useState("security");
  const [dateRange, setDateRange] = useState("week");
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [previewReport, setPreviewReport] = useState<GeneratedReport | null>(null);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // Build CSV from LIVE store data
  const buildCSV = (type: string): { csv: string; rows: number } => {
    if (type === "login") {
      const header = "Timestamp,User,IP Address,Workstation,Device,Status";
      const rows = store.loginRecords.map((r) => `${r.timestamp},${r.user},${r.ip},${r.workstation},${r.device},${r.status}`);
      return { csv: [header, ...rows].join("\n"), rows: rows.length };
    }
    if (type === "alerts") {
      const header = "Timestamp,Type,Title,Read";
      const rows = store.alerts.map((a) => `${a.timestamp},${a.type},"${a.title}",${a.read ? "Yes" : "No"}`);
      return { csv: [header, ...rows].join("\n"), rows: rows.length };
    }
    if (type === "events") {
      const header = "Timestamp,Type,Severity,Workstation,Source,Status";
      const rows = store.securityEvents.map((e) => `${e.timestamp},${e.type},${e.severity},${e.workstation},${e.source},${e.status}`);
      return { csv: [header, ...rows].join("\n"), rows: rows.length };
    }
    if (type === "domains") {
      const header = "Domain,Attempts,Workstation,Last Attempt";
      const rows = store.restrictedDomains.map((d) => `${d.domain},${d.attempts},${d.workstation},${d.lastAttempt}`);
      return { csv: [header, ...rows].join("\n"), rows: rows.length };
    }
    // security overview — live counts
    const header = "Metric,Value";
    const rows = [
      `Total Login Records,${store.loginRecords.length}`,
      `Failed Logins,${store.failedLoginCount}`,
      `Security Events,${store.securityEvents.length}`,
      `Open Events,${store.openEventCount}`,
      `Total Alerts,${store.alerts.length}`,
      `Unread Alerts,${store.unreadAlertCount}`,
      `Restricted Domain Attempts,${store.restrictedDomains.reduce((s, d) => s + d.attempts, 0)}`,
      `Total Users,${store.users.length}`,
      `Active Sessions,${store.activeSessions}`,
    ];
    return { csv: [header, ...rows].join("\n"), rows: rows.length };
  };

  const generateReport = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 700));
    const typeMeta = REPORT_TYPES.find((t) => t.value === reportType);
    const { csv, rows } = buildCSV(reportType);
    const dateStr = new Date().toISOString().split("T")[0];
    const newReport: GeneratedReport = {
      id: Date.now(),
      name: `${typeMeta?.label} — ${dateRange === "today" ? "Today" : dateRange === "week" ? "Last 7 Days" : "Last 30 Days"}`,
      type: typeMeta?.label || "",
      date: dateStr,
      rows,
      csvData: csv,
    };
    setGeneratedReports((prev) => [newReport, ...prev]);
    setPreviewReport(newReport);
    setGenerating(false);
    showToast("Report generated from live data.");
  };

  const downloadCSV = (report: GeneratedReport) => {
    const blob = new Blob([report.csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.name.replace(/[^a-z0-9]/gi, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteReport = (id: number) => {
    setGeneratedReports((prev) => prev.filter((r) => r.id !== id));
    if (previewReport?.id === id) setPreviewReport(null);
  };

  // Live event type breakdown for pie chart
  const eventTypeData = [
    { name: "Failed Logins", value: store.securityEvents.filter(e => e.type.includes("Failed")).length || 1, color: "#ef4444" },
    { name: "Restricted Domain", value: store.securityEvents.filter(e => e.type.includes("Domain")).length || 1, color: "#f59e0b" },
    { name: "Inactive User", value: store.securityEvents.filter(e => e.type.includes("Inactive")).length || 1, color: "#3b82f6" },
    { name: "Excessive Activity", value: store.securityEvents.filter(e => e.type.includes("Excessive")).length || 1, color: "#8b5cf6" },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg">{toast}</div>
      )}

      <div>
        <h1 className="text-white text-2xl font-semibold mb-1">Reports</h1>
        <p className="text-gray-400 text-sm">
          {isAdmin ? "Generate and download reports from live system data" : "View available security reports"}
        </p>
      </div>

      {isAdmin && (
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
          <h2 className="text-white text-base font-semibold mb-4">Generate Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
                {REPORT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1.5 block">Date Range</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={generateReport} disabled={generating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60">
                {generating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewReport && (
        <div className="bg-[#0f1420] border border-blue-600/40 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white text-base font-semibold">{previewReport.name}</h2>
              <p className="text-gray-400 text-xs mt-0.5">{previewReport.rows} records · Generated {previewReport.date}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => downloadCSV(previewReport)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                <Download size={15} className="mr-1.5" /> Download CSV
              </Button>
              <Button variant="outline" onClick={() => setPreviewReport(null)} className="border-gray-700 text-gray-400 hover:bg-gray-800 text-sm">
                <X size={15} />
              </Button>
            </div>
          </div>
          <div className="bg-[#1a1f2e] border border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
            <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap">{previewReport.csvData}</pre>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
          <h2 className="text-white text-base font-semibold mb-4">Weekly Login Activity</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={loginByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #374151", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
              <Bar dataKey="successful" fill="#10b981" name="Successful" radius={[3, 3, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" name="Failed" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
          <h2 className="text-white text-base font-semibold mb-4">Security Event Types (Live)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={eventTypeData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {eventTypeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1a1f2e", border: "1px solid #374151", borderRadius: "8px", color: "#fff", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Summary Stats */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-base font-semibold">Live Summary Statistics</h2>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <Calendar size={14} />
            <span>Updates in real-time</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Login Records", value: store.loginRecords.length, color: "text-white" },
            { label: "Failed Logins", value: store.failedLoginCount, color: "text-red-400" },
            { label: "Security Events", value: store.securityEvents.length, color: "text-yellow-400" },
            { label: "Unread Alerts", value: store.unreadAlertCount, color: "text-blue-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#1a1f2e] border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-xs mb-1">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
        <h2 className="text-white text-base font-semibold mb-4">Generated Reports ({generatedReports.length})</h2>
        {generatedReports.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">No reports generated yet. Use the form above to generate one.</p>
        ) : (
          <div className="space-y-3">
            {generatedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-[#1a1f2e] border border-gray-700/50 rounded-lg hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${isAdmin ? "bg-blue-500/10" : "bg-green-500/10"}`}>
                    <FileText className={isAdmin ? "text-blue-400" : "text-green-400"} size={18} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{report.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{report.type} · {report.date} · {report.rows} records</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPreviewReport(report)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 text-xs h-8">
                    <Eye size={13} className="mr-1" /> Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadCSV(report)}
                    className={`border-gray-700 hover:bg-gray-800 text-xs h-8 ${isAdmin ? "text-blue-400" : "text-green-400"}`}>
                    <Download size={13} className="mr-1" /> CSV
                  </Button>
                  {isAdmin && (
                    <Button variant="outline" size="sm" onClick={() => deleteReport(report.id)}
                      className="border-gray-700 text-red-400 hover:bg-red-950/30 text-xs h-8">
                      <X size={13} />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
