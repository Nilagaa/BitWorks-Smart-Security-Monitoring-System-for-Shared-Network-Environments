// Shared mock data used across pages
// All data resets on page refresh — this is intentional for prototype demo

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Staff";
  status: "Active" | "Inactive";
  lastLogin: string;
  workstation: string;
}

export interface LoginRecord {
  id: number;
  timestamp: string;
  user: string;
  ip: string;
  workstation: string;
  device: string;
  status: "Success" | "Failed";
}

export interface SecurityEvent {
  id: number;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  source: string;
  workstation: string;
  timestamp: string;
  status: "Open" | "Reviewed" | "Resolved";
}

export interface AlertItem {
  id: number;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export const INITIAL_USERS: UserRecord[] = [
  { id: 1, name: "John Dela Cruz", email: "john.delacruz@bitworks.com", role: "Staff", status: "Active", lastLogin: "2 hours ago", workstation: "PC-04" },
  { id: 2, name: "Maria Santos", email: "maria.santos@bitworks.com", role: "Admin", status: "Active", lastLogin: "5 min ago", workstation: "PC-01" },
  { id: 3, name: "Carlos Reyes", email: "carlos.reyes@bitworks.com", role: "Staff", status: "Active", lastLogin: "1 hour ago", workstation: "PC-07" },
  { id: 4, name: "Ana Lim", email: "ana.lim@bitworks.com", role: "Staff", status: "Inactive", lastLogin: "3 days ago", workstation: "PC-10" },
  { id: 5, name: "Ramon Torres", email: "ramon.torres@bitworks.com", role: "Staff", status: "Active", lastLogin: "30 min ago", workstation: "PC-12" },
  { id: 6, name: "Elena Cruz", email: "elena.cruz@bitworks.com", role: "Admin", status: "Active", lastLogin: "15 min ago", workstation: "PC-02" },
  { id: 7, name: "Miguel Bautista", email: "miguel.bautista@bitworks.com", role: "Staff", status: "Active", lastLogin: "4 hours ago", workstation: "PC-09" },
  { id: 8, name: "Rosa Mendoza", email: "rosa.mendoza@bitworks.com", role: "Staff", status: "Inactive", lastLogin: "1 week ago", workstation: "PC-15" },
];

export const INITIAL_LOGIN_RECORDS: LoginRecord[] = [
  { id: 1, timestamp: "2026-04-16 09:32:15", user: "admin@bitworks.com", ip: "192.168.1.10", workstation: "PC-01", device: "Windows PC", status: "Success" },
  { id: 2, timestamp: "2026-04-16 09:28:42", user: "john.delacruz@bitworks.com", ip: "192.168.1.45", workstation: "PC-04", device: "Windows PC", status: "Failed" },
  { id: 3, timestamp: "2026-04-16 09:25:18", user: "maria.santos@bitworks.com", ip: "192.168.1.22", workstation: "PC-01", device: "Windows PC", status: "Success" },
  { id: 4, timestamp: "2026-04-16 09:20:05", user: "carlos.reyes@bitworks.com", ip: "192.168.1.33", workstation: "PC-07", device: "Windows PC", status: "Success" },
  { id: 5, timestamp: "2026-04-16 09:15:30", user: "john.delacruz@bitworks.com", ip: "192.168.1.45", workstation: "PC-04", device: "Windows PC", status: "Failed" },
  { id: 6, timestamp: "2026-04-16 09:10:22", user: "ana.lim@bitworks.com", ip: "192.168.1.15", workstation: "PC-10", device: "Windows PC", status: "Failed" },
  { id: 7, timestamp: "2026-04-16 09:05:18", user: "ramon.torres@bitworks.com", ip: "192.168.1.28", workstation: "PC-12", device: "Windows PC", status: "Success" },
  { id: 8, timestamp: "2026-04-16 09:00:45", user: "elena.cruz@bitworks.com", ip: "192.168.1.11", workstation: "PC-02", device: "Windows PC", status: "Success" },
  { id: 9, timestamp: "2026-04-16 08:55:10", user: "john.delacruz@bitworks.com", ip: "192.168.1.45", workstation: "PC-04", device: "Windows PC", status: "Failed" },
  { id: 10, timestamp: "2026-04-16 08:50:33", user: "miguel.bautista@bitworks.com", ip: "192.168.1.19", workstation: "PC-09", device: "Windows PC", status: "Success" },
  { id: 11, timestamp: "2026-04-16 08:45:07", user: "staff@bitworks.com", ip: "192.168.1.50", workstation: "PC-06", device: "Windows PC", status: "Success" },
  { id: 12, timestamp: "2026-04-16 08:40:55", user: "rosa.mendoza@bitworks.com", ip: "192.168.1.60", workstation: "PC-15", device: "Windows PC", status: "Failed" },
];

export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 1,
    severity: "critical",
    type: "Repeated Failed Login Attempts",
    description: "User john.delacruz@bitworks.com has 3 consecutive failed login attempts from PC-04 (192.168.1.45).",
    source: "192.168.1.45",
    workstation: "PC-04",
    timestamp: "2026-04-16 09:28:42",
    status: "Open",
  },
  {
    id: 2,
    severity: "high",
    type: "Restricted Domain Access Attempt",
    description: "Workstation PC-07 attempted to access a restricted domain (social-media.example.com) during work hours.",
    source: "192.168.1.33",
    workstation: "PC-07",
    timestamp: "2026-04-16 09:15:18",
    status: "Open",
  },
  {
    id: 3,
    severity: "medium",
    type: "Inactive User Login Attempt",
    description: "Inactive account ana.lim@bitworks.com attempted to log in from PC-10.",
    source: "192.168.1.15",
    workstation: "PC-10",
    timestamp: "2026-04-16 09:10:22",
    status: "Reviewed",
  },
  {
    id: 4,
    severity: "high",
    type: "Excessive Repeated Actions",
    description: "PC-04 has triggered 5 login events within 10 minutes, exceeding the allowed threshold.",
    source: "192.168.1.45",
    workstation: "PC-04",
    timestamp: "2026-04-16 08:55:10",
    status: "Open",
  },
  {
    id: 5,
    severity: "medium",
    type: "Restricted Domain Access Attempt",
    description: "Workstation PC-12 attempted to access a restricted streaming domain (stream.example.com).",
    source: "192.168.1.28",
    workstation: "PC-12",
    timestamp: "2026-04-16 08:40:00",
    status: "Resolved",
  },
  {
    id: 6,
    severity: "low",
    type: "Repeated Failed Login Attempts",
    description: "rosa.mendoza@bitworks.com failed to log in from PC-15. Account is currently inactive.",
    source: "192.168.1.60",
    workstation: "PC-15",
    timestamp: "2026-04-16 08:40:55",
    status: "Reviewed",
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 1,
    type: "critical",
    title: "Repeated Failed Login Attempts Detected",
    description: "john.delacruz@bitworks.com has 3 consecutive failed login attempts from PC-04 (192.168.1.45). Possible unauthorized access attempt.",
    timestamp: "2026-04-16 09:28:42",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Restricted Domain Access Attempt",
    description: "PC-07 attempted to access a restricted domain. The request was blocked by the monitoring rule.",
    timestamp: "2026-04-16 09:15:30",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Inactive User Login Attempt",
    description: "Inactive account ana.lim@bitworks.com attempted to authenticate from PC-10. Access was denied.",
    timestamp: "2026-04-16 09:10:22",
    read: false,
  },
  {
    id: 4,
    type: "warning",
    title: "Excessive Activity from Single Workstation",
    description: "PC-04 triggered 5 login events within 10 minutes, exceeding the configured threshold.",
    timestamp: "2026-04-16 08:55:10",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "New User Account Created",
    description: "Admin created a new staff account: miguel.bautista@bitworks.com. Account is now active.",
    timestamp: "2026-04-16 08:30:00",
    read: true,
  },
  {
    id: 6,
    type: "info",
    title: "System Settings Updated",
    description: "Failed login protection threshold was updated from 5 to 3 attempts by admin@bitworks.com.",
    timestamp: "2026-04-16 08:00:00",
    read: true,
  },
];

export const ACTIVITY_CHART_DATA = [
  { time: "08:00", logins: 12, events: 5 },
  { time: "09:00", logins: 28, events: 14 },
  { time: "10:00", logins: 22, events: 9 },
  { time: "11:00", logins: 18, events: 7 },
  { time: "12:00", logins: 10, events: 3 },
  { time: "13:00", logins: 15, events: 6 },
  { time: "14:00", logins: 24, events: 11 },
  { time: "15:00", logins: 20, events: 8 },
  { time: "16:00", logins: 16, events: 5 },
  { time: "17:00", logins: 8, events: 2 },
];

export const WORKSTATION_ACTIVITY = [
  { workstation: "PC-04", events: 18 },
  { workstation: "PC-07", events: 14 },
  { workstation: "PC-12", events: 11 },
  { workstation: "PC-01", events: 9 },
  { workstation: "PC-09", events: 7 },
];

export const RESTRICTED_DOMAINS = [
  { domain: "social-media.example.com", attempts: 5, workstation: "PC-07", lastAttempt: "09:15" },
  { domain: "stream.example.com", attempts: 3, workstation: "PC-12", lastAttempt: "08:40" },
  { domain: "gaming.example.com", attempts: 2, workstation: "PC-09", lastAttempt: "08:20" },
  { domain: "torrent.example.com", attempts: 1, workstation: "PC-04", lastAttempt: "07:55" },
];
