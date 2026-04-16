import { Download, Search, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function LoginRecords() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "Admin";
  const store = useStore();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
          <h2 className="text-white text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-gray-400 text-sm">Only administrators can access login records.</p>
        </div>
      </div>
    );
  }

  const filtered = store.loginRecords.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.user.toLowerCase().includes(q) ||
      r.ip.includes(q) ||
      r.workstation.toLowerCase().includes(q);
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const header = "Timestamp,User,IP Address,Workstation,Device,Status";
    const rows = filtered.map(
      (r) => `${r.timestamp},${r.user},${r.ip},${r.workstation},${r.device},${r.status}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "login_records.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const successCount = store.loginRecords.filter((r) => r.status === "Success").length;
  const failedCount = store.loginRecords.filter((r) => r.status === "Failed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">Login Records</h1>
          <p className="text-gray-400 text-sm">All authentication attempts — Admin only</p>
        </div>
        <Button onClick={exportCSV} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download size={17} className="mr-2" /> Export CSV
        </Button>
      </div>

      {/* Live summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Total Records</p>
          <p className="text-white text-2xl font-semibold">{store.loginRecords.length}</p>
        </div>
        <div className="bg-[#0f1420] border border-green-900/40 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Successful</p>
          <p className="text-green-400 text-2xl font-semibold">{successCount}</p>
        </div>
        <div className="bg-[#0f1420] border border-red-900/40 rounded-lg p-4 text-center">
          <p className="text-gray-400 text-xs mb-1">Failed</p>
          <p className="text-red-400 text-2xl font-semibold">{failedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-48 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by email, IP, or workstation..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
            <option value="All">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
          <span className="text-gray-500 text-xs">{filtered.length} record(s)</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1f2e]">
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Timestamp</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">User</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">IP Address</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Workstation</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Device</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-gray-500 text-sm">No records match your search.</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-5 text-gray-400 text-xs">{r.timestamp}</td>
                  <td className="py-3 px-5 text-white text-sm">{r.user}</td>
                  <td className="py-3 px-5 text-gray-300 text-sm font-mono">{r.ip}</td>
                  <td className="py-3 px-5 text-gray-300 text-sm">{r.workstation}</td>
                  <td className="py-3 px-5 text-gray-400 text-sm">{r.device}</td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${r.status === "Success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                      {r.status}
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
