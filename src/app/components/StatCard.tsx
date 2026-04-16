import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: "blue" | "green" | "red" | "yellow";
}

export function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
    red: "bg-red-500/10 text-red-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
  };

  return (
    <div className="bg-[#0f1420] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <h3 className="text-white text-3xl font-semibold mb-2">{value}</h3>
          {trend && (
            <p
              className={`text-sm ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
