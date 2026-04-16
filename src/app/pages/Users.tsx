import { Search, UserPlus, Edit, Trash2, MoreVertical, X, Check, UserCheck, UserX } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useState, useRef, useEffect } from "react";
import { UserRecord } from "../data/mockData";

export function Users() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";
  const store = useStore();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<UserRecord | null>(null);
  const [toast, setToast] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"Admin" | "Staff">("Staff");
  const [newWorkstation, setNewWorkstation] = useState("");

  // Close menu when clicking outside
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = store.users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.workstation.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || u.role === filterRole;
    const matchStatus = filterStatus === "All" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const handleToggleStatus = (id: number) => {
    store.toggleUserStatus(id);
    showToast("User status updated.");
  };

  const handleDelete = (id: number) => {
    store.removeUser(id);
    showToast("User removed.");
  };

  const handleAdd = () => {
    if (!newName || !newEmail) return;
    store.addUser({
      name: newName,
      email: newEmail,
      role: newRole,
      status: "Active",
      lastLogin: "Never",
      workstation: newWorkstation || "Unassigned",
    });
    setNewName(""); setNewEmail(""); setNewRole("Staff"); setNewWorkstation("");
    setShowAddModal(false);
    showToast("User added successfully.");
  };

  const handleEdit = () => {
    if (!editUser) return;
    store.updateUser(editUser);
    setEditUser(null);
    showToast("User updated.");
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2">
          <Check size={16} /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">User Management</h1>
          <p className="text-gray-400 text-sm">
            {store.users.length} total · {store.users.filter(u => u.status === "Active").length} active · {store.users.filter(u => u.status === "Inactive").length} inactive
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <UserPlus size={17} className="mr-2" /> Add User
          </Button>
        )}
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
              placeholder="Search by name, email, or workstation..."
              className="w-full pl-10 pr-4 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <span className="text-gray-500 text-xs">{filtered.length} result(s)</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1a1f2e]">
              <tr className="border-b border-gray-700">
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Name</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Email</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Role</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Status</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Workstation</th>
                <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Last Login</th>
                {isAdmin && <th className="text-left text-gray-400 text-xs font-medium py-3 px-5">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-500 text-sm">No users match your search.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-5 text-white text-sm">{u.name}</td>
                  <td className="py-3 px-5 text-gray-300 text-sm">{u.email}</td>
                  <td className="py-3 px-5">
                    <Badge variant="outline" className={u.role === "Admin" ? "border-blue-500 text-blue-400 bg-blue-500/10 text-xs" : "border-green-500 text-green-400 bg-green-500/10 text-xs"}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-5">
                    <Badge variant="outline" className={u.status === "Active" ? "border-green-500 text-green-400 bg-green-500/10 text-xs" : "border-gray-600 text-gray-400 bg-gray-500/10 text-xs"}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-5 text-gray-300 text-sm">{u.workstation}</td>
                  <td className="py-3 px-5 text-gray-400 text-sm">{u.lastLogin}</td>
                  {isAdmin && (
                    <td className="py-3 px-5">
                      <div className="relative" ref={openMenuId === u.id ? menuRef : undefined}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openMenuId === u.id && (
                          <div className="absolute right-0 top-8 z-50 w-44 bg-[#1a1f2e] border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                            <button
                              onClick={() => { setEditUser({ ...u }); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                            >
                              <Edit size={14} className="text-blue-400" /> Edit User
                            </button>
                            <button
                              onClick={() => { handleToggleStatus(u.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                            >
                              {u.status === "Active"
                                ? <><UserX size={14} className="text-yellow-400" /> Deactivate</>
                                : <><UserCheck size={14} className="text-green-400" /> Activate</>
                              }
                            </button>
                            <div className="border-t border-gray-700" />
                            <button
                              onClick={() => { handleDelete(u.id); setOpenMenuId(null); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-left"
                            >
                              <Trash2 size={14} /> Remove User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1420] border border-gray-700 rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: newName, onChange: setNewName, placeholder: "e.g. Juan dela Cruz" },
                { label: "Email Address", value: newEmail, onChange: setNewEmail, placeholder: "user@bitworks.com" },
                { label: "Assigned Workstation", value: newWorkstation, onChange: setNewWorkstation, placeholder: "e.g. PC-16" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-gray-400 text-sm mb-1 block">{f.label}</label>
                  <input value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder={f.placeholder}
                    className="w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm" />
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Role</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value as "Admin" | "Staff")}
                  className="w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</Button>
              <Button onClick={handleAdd} disabled={!newName || !newEmail} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">Add User</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f1420] border border-gray-700 rounded-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name" as const },
                { label: "Email", key: "email" as const },
                { label: "Workstation", key: "workstation" as const },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-gray-400 text-sm mb-1 block">{f.label}</label>
                  <input value={editUser[f.key]} onChange={(e) => setEditUser({ ...editUser, [f.key]: e.target.value })}
                    className="w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm" />
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Role</label>
                <select value={editUser.role} onChange={(e) => setEditUser({ ...editUser, role: e.target.value as "Admin" | "Staff" })}
                  className="w-full px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500 text-sm">
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditUser(null)} className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</Button>
              <Button onClick={handleEdit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
