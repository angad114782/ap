import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate to={userRole === "admin" ? "/admin" : "/main-screen"} replace />
    );
  }

  return <>{children}</>;
};
