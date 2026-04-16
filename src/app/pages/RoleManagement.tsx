import { UserCog, Shield, Info } from "lucide-react";
import { useState } from "react";

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: { label: string; description: string }[];
  userCount: number;
  color: "blue" | "green";
  pages: string[];
}

const ROLES: Role[] = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access with all management privileges",
    color: "blue",
    userCount: 2,
    pages: ["Dashboard", "User Management", "Role Management", "Login Records", "Monitoring Overview", "Detected Activities", "Alerts", "Reports", "Settings"],
    permissions: [
      { label: "user.view", description: "View all system users" },
      { label: "user.create", description: "Add new user accounts" },
      { label: "user.edit", description: "Edit user information and roles" },
      { label: "user.deactivate", description: "Activate or deactivate user accounts" },
      { label: "role.view", description: "View role definitions and permissions" },
      { label: "login_records.view", description: "View all login records and history" },
      { label: "monitoring.view", description: "View monitoring overview and events" },
      { label: "events.view", description: "View detected security events" },
      { label: "events.review", description: "Mark events as reviewed or resolved" },
      { label: "alerts.view", description: "View all system alerts" },
      { label: "alerts.manage", description: "Mark, delete, and manage alerts" },
      { label: "reports.generate", description: "Generate and download reports" },
      { label: "settings.manage", description: "Configure system security settings" },
    ],
  },
  {
    id: 2,
    name: "Staff",
    description: "Limited access for monitoring and alert management",
    color: "green",
    userCount: 6,
    pages: ["Dashboard", "Monitoring Overview", "Detected Activities", "Alerts", "Reports"],
    permissions: [
      { label: "monitoring.view", description: "View monitoring overview and events" },
      { label: "events.view", description: "View detected security events" },
      { label: "events.review", description: "Mark events as reviewed" },
      { label: "alerts.view", description: "View assigned alerts" },
      { label: "alerts.read", description: "Mark alerts as read" },
      { label: "reports.view", description: "View generated reports" },
    ],
  },
];

export function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(ROLES[0]);
  const [activeTab, setActiveTab] = useState<"permissions" | "pages">("permissions");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-semibold mb-1">Role Management</h1>
          <p className="text-gray-400 text-sm">View system roles and their assigned permissions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <Info size={15} className="text-yellow-400" />
          <span className="text-yellow-400 text-xs">Role creation not available in prototype</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Cards */}
        <div className="space-y-4">
          {ROLES.map((role) => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`bg-[#0f1420] border rounded-xl p-5 cursor-pointer transition-all ${
                selectedRole?.id === role.id
                  ? role.color === "blue"
                    ? "border-blue-500 shadow-lg shadow-blue-500/10"
                    : "border-green-500 shadow-lg shadow-green-500/10"
                  : "border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`p-2.5 rounded-lg ${
                    role.color === "blue" ? "bg-blue-500/10" : "bg-green-500/10"
                  }`}
                >
                  <UserCog
                    className={role.color === "blue" ? "text-blue-500" : "text-green-500"}
                    size={22}
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{role.name}</h3>
                  <p className="text-gray-400 text-xs">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t border-gray-800">
                <span className="flex items-center gap-1">
                  <Shield size={13} />
                  {role.permissions.length} permissions
                </span>
                <span className="flex items-center gap-1">
                  <UserCog size={13} />
                  {role.userCount} users
                </span>
              </div>
            </div>
          ))}

          {/* Viewer note */}
          <div className="bg-[#0f1420] border border-gray-800 rounded-xl p-5 opacity-50">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-lg bg-gray-500/10">
                <UserCog className="text-gray-500" size={22} />
              </div>
              <div>
                <h3 className="text-gray-400 font-semibold">Viewer</h3>
                <p className="text-gray-600 text-xs">Not available in this system</p>
              </div>
            </div>
            <p className="text-gray-600 text-xs mt-2">
              This role is not part of the current system scope.
            </p>
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-2">
          {selectedRole ? (
            <div className="bg-[#0f1420] border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`p-2.5 rounded-lg ${
                    selectedRole.color === "blue" ? "bg-blue-500/10" : "bg-green-500/10"
                  }`}
                >
                  <UserCog
                    className={selectedRole.color === "blue" ? "text-blue-500" : "text-green-500"}
                    size={22}
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{selectedRole.name} Role</h3>
                  <p className="text-gray-400 text-sm">{selectedRole.description}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-5 border-b border-gray-800 pb-3">
                <button
                  onClick={() => setActiveTab("permissions")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "permissions"
                      ? selectedRole.color === "blue"
                        ? "bg-blue-600 text-white"
                        : "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Permissions ({selectedRole.permissions.length})
                </button>
                <button
                  onClick={() => setActiveTab("pages")}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === "pages"
                      ? selectedRole.color === "blue"
                        ? "bg-blue-600 text-white"
                        : "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Accessible Pages ({selectedRole.pages.length})
                </button>
              </div>

              {activeTab === "permissions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRole.permissions.map((perm, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 bg-[#1a1f2e] border border-gray-700/50 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                          selectedRole.color === "blue" ? "bg-blue-500" : "bg-green-500"
                        }`}
                      />
                      <div>
                        <p className="text-white text-xs font-medium font-mono">{perm.label}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{perm.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "pages" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRole.pages.map((page, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 bg-[#1a1f2e] border border-gray-700/50 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          selectedRole.color === "blue" ? "bg-blue-500" : "bg-green-500"
                        }`}
                      />
                      <span className="text-gray-300 text-sm">{page}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 pt-5 border-t border-gray-800 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Users Assigned</p>
                  <p className="text-white font-semibold">{selectedRole.userCount}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Permissions</p>
                  <p className="text-white font-semibold">{selectedRole.permissions.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Pages</p>
                  <p className="text-white font-semibold">{selectedRole.pages.length}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0f1420] border border-gray-800 rounded-xl p-6 h-48 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Select a role to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
