import { Shield, Bell, Lock, AlertTriangle, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { SystemSettings } from "../context/StoreContext";

export function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "Admin";
  const store = useStore();

  const [saved, setSaved] = useState(false);
  const [local, setLocal] = useState<SystemSettings>({ ...store.settings });

  // Keep local in sync if store changes externally
  useEffect(() => { setLocal({ ...store.settings }); }, [store.settings]);

  useEffect(() => {
    if (!isAdmin) navigate("/");
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
          <h2 className="text-white text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-gray-400 text-sm">Only administrators can access system settings.</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    store.saveSettings(local); // writes to global store + creates info alert
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    store.resetSettings();
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg flex items-center gap-2">
          <Check size={16} /> Settings saved. Threshold is now {local.failedLoginThreshold} attempts.
        </div>
      )}

      <div>
        <h1 className="text-white text-2xl font-semibold mb-1">System Settings</h1>
        <p className="text-gray-400 text-sm">Changes apply to the live system immediately on save — Admin only</p>
      </div>

      {/* Login Protection */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-blue-500/10 rounded-lg"><Shield className="text-blue-500" size={20} /></div>
          <div>
            <h2 className="text-white font-semibold">Login Protection</h2>
            <p className="text-gray-400 text-xs">Affects alert triggering in the live system</p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div>
              <p className="text-white text-sm font-medium">Failed Login Threshold</p>
              <p className="text-gray-400 text-xs mt-0.5">Trigger a critical alert after this many consecutive failures</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLocal((s) => ({ ...s, failedLoginThreshold: Math.max(1, s.failedLoginThreshold - 1) }))}
                className="w-8 h-8 bg-[#1a1f2e] border border-gray-700 rounded text-gray-300 hover:bg-gray-700 text-lg leading-none">−</button>
              <span className="text-white font-semibold w-8 text-center">{local.failedLoginThreshold}</span>
              <button onClick={() => setLocal((s) => ({ ...s, failedLoginThreshold: Math.min(10, s.failedLoginThreshold + 1) }))}
                className="w-8 h-8 bg-[#1a1f2e] border border-gray-700 rounded text-gray-300 hover:bg-gray-700 text-lg leading-none">+</button>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div>
              <p className="text-white text-sm font-medium">Auto-Lock Session</p>
              <p className="text-gray-400 text-xs mt-0.5">Automatically lock inactive sessions</p>
            </div>
            <Switch checked={local.autoLockSession} onCheckedChange={(v) => setLocal((s) => ({ ...s, autoLockSession: v }))} />
          </div>
          {local.autoLockSession && (
            <div className="flex items-center justify-between py-3 border-b border-gray-800 pl-4">
              <div>
                <p className="text-white text-sm font-medium">Session Timeout (minutes)</p>
                <p className="text-gray-400 text-xs mt-0.5">Lock after this many minutes of inactivity</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setLocal((s) => ({ ...s, sessionTimeoutMinutes: Math.max(5, s.sessionTimeoutMinutes - 5) }))}
                  className="w-8 h-8 bg-[#1a1f2e] border border-gray-700 rounded text-gray-300 hover:bg-gray-700 text-lg leading-none">−</button>
                <span className="text-white font-semibold w-8 text-center">{local.sessionTimeoutMinutes}</span>
                <button onClick={() => setLocal((s) => ({ ...s, sessionTimeoutMinutes: Math.min(60, s.sessionTimeoutMinutes + 5) }))}
                  className="w-8 h-8 bg-[#1a1f2e] border border-gray-700 rounded text-gray-300 hover:bg-gray-700 text-lg leading-none">+</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-red-500/10 rounded-lg"><Lock className="text-red-400" size={20} /></div>
          <div>
            <h2 className="text-white font-semibold">Password Policy</h2>
            <p className="text-gray-400 text-xs">Minimum requirements for user passwords</p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div>
              <p className="text-white text-sm font-medium">Minimum Password Length</p>
              <p className="text-gray-400 text-xs mt-0.5">Minimum number of characters required</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setLocal((s) => ({ ...s, passwordMinLength: Math.max(6, s.passwordMinLength - 1) }))}
                className="w-8 h-8 bg-[#1a1f2e] border border-gray-700 rounded text-gray-300 hover:bg-gray-700 text-lg leading-none">−</button>
              <span className="text-white font-semibold w-8 text-center">{local.passwordMinLength}</span>
              <button onClick={() => setLocal((s) => ({ ...s, passwordMinLength: Math.min(20, s.passwordMinLength + 1) }))}
                className="w-8 h-8 bg-[#1a1f2e] border border-gray-700 rounded text-gray-300 hover:bg-gray-700 text-lg leading-none">+</button>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <div>
              <p className="text-white text-sm font-medium">Require Numbers</p>
              <p className="text-gray-400 text-xs mt-0.5">Password must contain at least one number</p>
            </div>
            <Switch checked={local.requireNumbers} onCheckedChange={(v) => setLocal((s) => ({ ...s, requireNumbers: v }))} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-white text-sm font-medium">Require Special Characters</p>
              <p className="text-gray-400 text-xs mt-0.5">Password must contain at least one special character</p>
            </div>
            <Switch checked={local.requireSpecialChars} onCheckedChange={(v) => setLocal((s) => ({ ...s, requireSpecialChars: v }))} />
          </div>
        </div>
        <div className="mt-4 p-3 bg-[#1a1f2e] border border-gray-700 rounded-lg">
          <p className="text-gray-400 text-xs mb-1">Current Policy Preview</p>
          <p className="text-gray-300 text-xs">
            Minimum {local.passwordMinLength} characters
            {local.requireNumbers ? ", must include numbers" : ""}
            {local.requireSpecialChars ? ", must include special characters" : ""}.
          </p>
        </div>
      </div>

      {/* Alert Notifications */}
      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-yellow-500/10 rounded-lg"><Bell className="text-yellow-400" size={20} /></div>
          <div>
            <h2 className="text-white font-semibold">Alert Notifications</h2>
            <p className="text-gray-400 text-xs">Control which alert types are active in the system</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { key: "criticalAlerts" as const, label: "Critical Alerts", desc: "Show critical security event notifications" },
            { key: "warningAlerts" as const, label: "Warning Alerts", desc: "Show warning-level notifications" },
            { key: "infoAlerts" as const, label: "Info Notifications", desc: "Show informational system notifications" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
              <div>
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
              </div>
              <Switch checked={local[item.key]} onCheckedChange={(v) => setLocal((s) => ({ ...s, [item.key]: v }))} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-5">
        <p className="text-gray-500 text-xs">
          Features not available in this prototype: Two-Factor Authentication, IP Whitelisting, Backup &amp; Restore. These require backend integration.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={handleReset} className="border-gray-700 text-gray-300 hover:bg-gray-800 text-sm">
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
          <Check size={16} className="mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
}
