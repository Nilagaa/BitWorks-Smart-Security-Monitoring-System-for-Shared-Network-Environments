import { useState } from "react";
import { useNavigate } from "react-router";
import { Shield, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";

// Mock IP pool for demo
const MOCK_IPS = ["192.168.1.10", "192.168.1.22", "192.168.1.33", "192.168.1.45", "192.168.1.50"];
const MOCK_WS = ["PC-01", "PC-02", "PC-04", "PC-06", "PC-07", "PC-12"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lockedOut, setLockedOut] = useState(false);
  const navigate = useNavigate();
  const { signIn, failedAttempts, incrementFailedAttempts, resetFailedAttempts } = useAuth();
  const { pushLoginRecord, settings } = useStore();

  const MAX_ATTEMPTS = settings.failedLoginThreshold;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockedOut) return;
    setError("");
    setIsLoading(true);

    const ip = randomFrom(MOCK_IPS);
    const workstation = randomFrom(MOCK_WS);

    try {
      const success = await signIn(email, password);

      // Push login record to global store regardless of outcome
      pushLoginRecord({
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        user: email,
        ip,
        workstation,
        device: "Windows PC",
        status: success ? "Success" : "Failed",
      });

      if (success) {
        resetFailedAttempts();
        navigate("/");
      } else {
        incrementFailedAttempts();
        const newCount = failedAttempts + 1;
        if (newCount >= MAX_ATTEMPTS) {
          setLockedOut(true);
          setError(
            `Too many failed attempts. Account temporarily locked. Please contact your administrator.`
          );
        } else {
          setError(
            `Invalid email or password. ${MAX_ATTEMPTS - newCount} attempt(s) remaining before lockout.`
          );
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h1 className="text-white text-3xl font-semibold mb-1">BitWorks</h1>
          <p className="text-gray-400 text-sm">Smart Security Monitoring System</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f1420] border border-gray-800 rounded-xl p-8">
          <h2 className="text-white text-xl font-semibold mb-6">Sign In</h2>

          {error && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-500/40 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {failedAttempts > 0 && !lockedOut && (
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-xs">
                Failed attempts: {failedAttempts} / {MAX_ATTEMPTS}
              </p>
              <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ width: `${(failedAttempts / MAX_ATTEMPTS) * 100}%` }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-gray-400 text-sm mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={lockedOut}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-gray-400 text-sm mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={17} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={lockedOut}
                  className="w-full pl-10 pr-10 py-3 bg-[#1a1f2e] border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-[#1a1f2e] border border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-400 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                onClick={() => alert("Password reset is handled by your administrator.")}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading || lockedOut}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : lockedOut ? "Account Locked" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-[#1a1f2e] border border-gray-700 rounded-lg">
            <p className="text-gray-400 text-xs mb-2 font-medium">Demo Credentials</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>Admin: admin@bitworks.com / admin123</p>
              <p>Staff: staff@bitworks.com / staff123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 BitWorks. Smart Security Monitoring System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
