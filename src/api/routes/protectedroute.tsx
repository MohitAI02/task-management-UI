import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authcontext";


interface ProtectedRouteProps {
    allowedRole: "ADMIN" | "EMPLOYEE";
}

export default function ProtectedRoute({
    allowedRole,
}: ProtectedRouteProps) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (user.role !== allowedRole) {
        return (
            <Navigate
                to={user.role === "ADMIN" ? "/admin" : "/employee"}
                replace
            />
        );
    }

    return <Outlet />;
}
