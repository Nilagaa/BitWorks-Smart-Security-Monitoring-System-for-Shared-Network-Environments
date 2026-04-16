/**
 * BitWorks Global In-Memory Store
 * Single source of truth for all live data.
 * All state lives here — pages read from and write to this store.
 * Data resets on page refresh (intentional for prototype).
 */
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  UserRecord,
  LoginRecord,
  SecurityEvent,
  AlertItem,
  INITIAL_USERS,
  INITIAL_LOGIN_RECORDS,
  INITIAL_SECURITY_EVENTS,
  INITIAL_ALERTS,
  ACTIVITY_CHART_DATA,
  WORKSTATION_ACTIVITY,
  RESTRICTED_DOMAINS,
} from "../data/mockData";

export interface ChartPoint { time: string; logins: number; events: number }
export interface WorkstationStat { workstation: string; events: number }
export interface DomainRecord { domain: string; attempts: number; workstation: string; lastAttempt: string }

export interface SystemSettings {
  failedLoginThreshold: number;
  passwordMinLength: number;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  autoLockSession: boolean;
  sessionTimeoutMinutes: number;
  criticalAlerts: boolean;
  warningAlerts: boolean;
  infoAlerts: boolean;
}

interface StoreContextType {
  // Data
  users: UserRecord[];
  loginRecords: LoginRecord[];
  securityEvents: SecurityEvent[];
  alerts: AlertItem[];
  chartData: ChartPoint[];
  workstationStats: WorkstationStat[];
  restrictedDomains: DomainRecord[];
  settings: SystemSettings;
  activeSessions: number;

  // Derived counters (computed live)
  failedLoginCount: number;
  unreadAlertCount: number;
  openEventCount: number;

  // User actions
  addUser: (u: Omit<UserRecord, "id">) => void;
  updateUser: (u: UserRecord) => void;
  toggleUserStatus: (id: number) => void;
  removeUser: (id: number) => void;

  // Login record actions
  pushLoginRecord: (r: Omit<LoginRecord, "id">) => void;

  // Security event actions
  addSecurityEvent: (e: Omit<SecurityEvent, "id">) => void;
  updateEventStatus: (id: number, status: SecurityEvent["status"]) => void;
  removeSecurityEvent: (id: number) => void;
  markAllEventsReviewed: () => void;

  // Alert actions
  addAlert: (a: Omit<AlertItem, "id">) => void;
  markAlertRead: (id: number) => void;
  markAllAlertsRead: () => void;
  removeAlert: (id: number) => void;
  clearAllAlerts: () => void;

  // Domain simulation
  simulateDomainAccess: (domain: string, workstation: string, ip: string) => void;

  // Settings
  saveSettings: (s: SystemSettings) => void;
  resetSettings: () => void;

  // Chart helpers
  pushChartEvent: (type: "login" | "event") => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  failedLoginThreshold: 5,
  passwordMinLength: 8,
  requireNumbers: true,
  requireSpecialChars: true,
  autoLockSession: true,
  sessionTimeoutMinutes: 15,
  criticalAlerts: true,
  warningAlerts: true,
  infoAlerts: true,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function nowTs() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function currentHour() {
  const h = new Date().getHours();
  return `${String(h).padStart(2, "0")}:00`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>(INITIAL_LOGIN_RECORDS);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(INITIAL_SECURITY_EVENTS);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [chartData, setChartData] = useState<ChartPoint[]>(ACTIVITY_CHART_DATA);
  const [workstationStats, setWorkstationStats] = useState<WorkstationStat[]>(WORKSTATION_ACTIVITY);
  const [restrictedDomains, setRestrictedDomains] = useState<DomainRecord[]>(RESTRICTED_DOMAINS);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [activeSessions, setActiveSessions] = useState(6);

  // Derived
  const failedLoginCount = loginRecords.filter((r) => r.status === "Failed").length;
  const unreadAlertCount = alerts.filter((a) => !a.read).length;
  const openEventCount = securityEvents.filter((e) => e.status === "Open").length;

  // ── Chart helper ──────────────────────────────────────────────
  const pushChartEvent = useCallback((type: "login" | "event") => {
    const hour = currentHour();
    setChartData((prev) => {
      const idx = prev.findIndex((p) => p.time === hour);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          logins: type === "login" ? updated[idx].logins + 1 : updated[idx].logins,
          events: type === "event" ? updated[idx].events + 1 : updated[idx].events,
        };
        return updated;
      }
      return [...prev, { time: hour, logins: type === "login" ? 1 : 0, events: type === "event" ? 1 : 0 }];
    });
  }, []);

  // ── Workstation helper ────────────────────────────────────────
  const bumpWorkstation = useCallback((ws: string) => {
    setWorkstationStats((prev) => {
      const idx = prev.findIndex((w) => w.workstation === ws);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], events: updated[idx].events + 1 };
        return updated.sort((a, b) => b.events - a.events);
      }
      return [...prev, { workstation: ws, events: 1 }].sort((a, b) => b.events - a.events);
    });
  }, []);

  // ── Users ─────────────────────────────────────────────────────
  const addUser = useCallback((u: Omit<UserRecord, "id">) => {
    setUsers((prev) => [{ ...u, id: Date.now() }, ...prev]);
    setActiveSessions((n) => (u.status === "Active" ? n + 1 : n));
    // Info alert
    setAlerts((prev) => [
      {
        id: Date.now(),
        type: "info",
        title: "New User Account Created",
        description: `Admin created a new ${u.role.toLowerCase()} account: ${u.email}.`,
        timestamp: nowTs(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const updateUser = useCallback((u: UserRecord) => {
    setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
  }, []);

  const toggleUserStatus = useCallback((id: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const next = { ...u, status: u.status === "Active" ? ("Inactive" as const) : ("Active" as const) };
        setActiveSessions((n) => (next.status === "Active" ? n + 1 : Math.max(0, n - 1)));
        return next;
      })
    );
  }, []);

  const removeUser = useCallback((id: number) => {
    setUsers((prev) => {
      const target = prev.find((u) => u.id === id);
      if (target?.status === "Active") setActiveSessions((n) => Math.max(0, n - 1));
      return prev.filter((u) => u.id !== id);
    });
  }, []);

  // ── Login Records ─────────────────────────────────────────────
  const pushLoginRecord = useCallback(
    (r: Omit<LoginRecord, "id">) => {
      const record: LoginRecord = { ...r, id: Date.now() };

      setLoginRecords((prev) => {
        const updated = [record, ...prev];

        if (r.status === "Failed") {
          const userFails = updated.filter(
            (x) => x.user === r.user && x.status === "Failed"
          ).length;

          if (userFails >= settings.failedLoginThreshold) {
            const ts = nowTs();
            setAlerts((a) => [
              {
                id: Date.now() + 1,
                type: "critical",
                title: "Repeated Failed Login Attempts Detected",
                description: `${r.user} has ${userFails} consecutive failed login attempts from ${r.workstation} (${r.ip}).`,
                timestamp: ts,
                read: false,
              },
              ...a,
            ]);
            setSecurityEvents((e) => [
              {
                id: Date.now() + 2,
                severity: "critical",
                type: "Repeated Failed Login Attempts",
                description: `${r.user} has ${userFails} consecutive failed login attempts from ${r.workstation} (${r.ip}).`,
                source: r.ip,
                workstation: r.workstation,
                timestamp: ts,
                status: "Open",
              },
              ...e,
            ]);
            pushChartEvent("event");
          }
        }

        return updated;
      });

      pushChartEvent("login");
      bumpWorkstation(r.workstation);
    },
    [settings.failedLoginThreshold, pushChartEvent, bumpWorkstation]
  );

  // ── Security Events ───────────────────────────────────────────
  const addSecurityEvent = useCallback(
    (e: Omit<SecurityEvent, "id">) => {
      setSecurityEvents((prev) => [{ ...e, id: Date.now() }, ...prev]);
      pushChartEvent("event");
      bumpWorkstation(e.workstation);
    },
    [pushChartEvent, bumpWorkstation]
  );

  const updateEventStatus = useCallback((id: number, status: SecurityEvent["status"]) => {
    setSecurityEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  }, []);

  const removeSecurityEvent = useCallback((id: number) => {
    setSecurityEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const markAllEventsReviewed = useCallback(() => {
    setSecurityEvents((prev) =>
      prev.map((e) => (e.status === "Open" ? { ...e, status: "Reviewed" as const } : e))
    );
  }, []);

  // ── Alerts ────────────────────────────────────────────────────
  const addAlert = useCallback((a: Omit<AlertItem, "id">) => {
    setAlerts((prev) => [{ ...a, id: Date.now() }, ...prev]);
  }, []);

  const markAlertRead = useCallback((id: number) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const markAllAlertsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  const removeAlert = useCallback((id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // ── Domain Simulation ─────────────────────────────────────────
  const simulateDomainAccess = useCallback(
    (domain: string, workstation: string, ip: string) => {
      const ts = nowTs();
      const hour = currentHour();

      bumpWorkstation(workstation);
      pushChartEvent("event");

      // Activity log entry (login record with domain access action)
      setLoginRecords((prev) => [
        {
          id: Date.now(),
          timestamp: ts,
          user: `${workstation} (domain access)`,
          ip,
          workstation,
          device: "Windows PC",
          status: "Failed",
        },
        ...prev,
      ]);

      // Update or add domain record
      setRestrictedDomains((prev) => {
        const idx = prev.findIndex((d) => d.domain === domain);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], attempts: updated[idx].attempts + 1, lastAttempt: hour };
          return updated;
        }
        return [{ domain, attempts: 1, workstation, lastAttempt: hour }, ...prev];
      });

      // Detected activity (security event)
      setSecurityEvents((prev) => [
        {
          id: Date.now() + 1,
          severity: "high",
          type: "Restricted Domain Access Attempt",
          description: `Workstation ${workstation} attempted to access restricted domain: ${domain}.`,
          source: ip,
          workstation,
          timestamp: ts,
          status: "Open",
        },
        ...prev,
      ]);

      // Alert
      setAlerts((prev) => [
        {
          id: Date.now() + 2,
          type: "warning",
          title: "Restricted Domain Access Attempt",
          description: `${workstation} (${ip}) attempted to access ${domain}. Request blocked by monitoring rule.`,
          timestamp: ts,
          read: false,
        },
        ...prev,
      ]);
    },
    [bumpWorkstation, pushChartEvent]
  );

  // ── Settings ──────────────────────────────────────────────────
  const saveSettings = useCallback((s: SystemSettings) => {
    setSettings(s);
    setAlerts((prev) => [
      {
        id: Date.now(),
        type: "info",
        title: "System Settings Updated",
        description: `Security settings were updated. Failed login threshold: ${s.failedLoginThreshold}.`,
        timestamp: nowTs(),
        read: false,
      },
      ...prev,
    ]);
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        users,
        loginRecords,
        securityEvents,
        alerts,
        chartData,
        workstationStats,
        restrictedDomains,
        settings,
        activeSessions,
        failedLoginCount,
        unreadAlertCount,
        openEventCount,
        addUser,
        updateUser,
        toggleUserStatus,
        removeUser,
        pushLoginRecord,
        addSecurityEvent,
        updateEventStatus,
        removeSecurityEvent,
        markAllEventsReviewed,
        addAlert,
        markAlertRead,
        markAllAlertsRead,
        removeAlert,
        clearAllAlerts,
        simulateDomainAccess,
        saveSettings,
        resetSettings,
        pushChartEvent,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
