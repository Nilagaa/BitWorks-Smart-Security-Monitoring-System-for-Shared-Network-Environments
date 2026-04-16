import { AlertTriangle, X, Shield, Clock } from "lucide-react";
import { motion } from "motion/react";

interface AlertNotificationProps {
  onClose: () => void;
}

export function AlertNotification({ onClose }: AlertNotificationProps) {
  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "Repeated Failed Login Attempts",
      description: "john.delacruz@bitworks.com has 3 failed login attempts from PC-04 (192.168.1.45).",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "warning",
      title: "Restricted Domain Access Attempt",
      description: "PC-07 attempted to access a restricted domain. Request blocked.",
      time: "15 minutes ago",
    },
    {
      id: 3,
      type: "info",
      title: "New User Account Created",
      description: "Admin created a new staff account: miguel.bautista@bitworks.com.",
      time: "1 hour ago",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-96 bg-[#0f1420] border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-500" size={20} />
            <h3 className="text-white font-semibold">Security Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Alerts List */}
        <div className="max-h-[500px] overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 ${
                    alert.type === "critical"
                      ? "text-red-500"
                      : alert.type === "warning"
                      ? "text-yellow-500"
                      : "text-blue-500"
                  }`}
                >
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock size={12} />
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0e1a] border-t border-gray-700">
          <button className="w-full text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View All Alerts
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
