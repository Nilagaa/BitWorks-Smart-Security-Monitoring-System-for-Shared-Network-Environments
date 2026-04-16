import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  role: "Admin" | "Staff";
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  isAuthenticated: boolean;
  failedAttempts: number;
  incrementFailedAttempts: () => void;
  resetFailedAttempts: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = [
  { email: "admin@bitworks.com", password: "admin123", name: "Admin User", role: "Admin" as const },
  { email: "staff@bitworks.com", password: "staff123", name: "Staff User", role: "Staff" as const },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const match = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (match) {
      setUser({ name: match.name, email: match.email, role: match.role });
      setFailedAttempts(0);
      return true;
    }
    return false;
  };

  const signOut = () => setUser(null);
  const incrementFailedAttempts = () => setFailedAttempts((n) => n + 1);
  const resetFailedAttempts = () => setFailedAttempts(0);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isAuthenticated: !!user,
        failedAttempts,
        incrementFailedAttempts,
        resetFailedAttempts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
