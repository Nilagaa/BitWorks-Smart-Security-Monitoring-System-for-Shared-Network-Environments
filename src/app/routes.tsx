import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignIn } from "./pages/SignIn";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { RoleManagement } from "./pages/RoleManagement";
import { LoginRecords } from "./pages/LoginRecords";
import { NetworkTraffic } from "./pages/NetworkTraffic";
import { SuspiciousActivity } from "./pages/SuspiciousActivity";
import { Alerts } from "./pages/Alerts";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "users", Component: Users },
      { path: "roles", Component: RoleManagement },
      { path: "login-records", Component: LoginRecords },
      { path: "network-traffic", Component: NetworkTraffic },
      { path: "suspicious-activity", Component: SuspiciousActivity },
      { path: "alerts", Component: Alerts },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
]);