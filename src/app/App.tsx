import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </AuthProvider>
  );
}
