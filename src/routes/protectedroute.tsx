
import { Navigate, Outlet, Routes, Route } from "react-router-dom";
import { useAuth } from "../context/authcontext";

import LoginPage from "../pages/loginpage/loginpage";

import AdminLayout from "../pages/admin/admindashboard";
import AdminHome from "../pages/admin/adminhome";
import AdminEmployees from "../pages/admin/adminemployees";
import AdminTasks from "../pages/admin/admintasks";
import AdminReports from "../pages/admin/adminreports";

import EmployeeLayout from "../pages/employee/employeedashboard";
import EmployeeTasks from "../pages/employee/employeetasks";
import EmployeeReport from "../pages/employee/employeereport";

interface ProtectedRouteProps {
    allowedRole: "ADMIN" | "EMPLOYEE";
}


function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
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


export default function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    user ? (
                        <Navigate
                            to={user.role === "ADMIN" ? "/admin" : "/employee"}
                            replace
                        />
                    ) : (
                        <LoginPage />
                    )
                }
            />

            <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminHome />} />
                    <Route path="/admin/employees" element={<AdminEmployees />} />
                    <Route path="/admin/tasks" element={<AdminTasks />} />
                    <Route path="/admin/reports" element={<AdminReports />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute allowedRole="EMPLOYEE" />}>
                <Route element={<EmployeeLayout />}>
                    <Route path="/employee" element={<EmployeeTasks />} />
                    <Route path="/employee/tasks" element={<EmployeeTasks />} />
                    <Route path="/employee/report" element={<EmployeeReport />} />
                </Route>
            </Route>

            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            user
                                ? user.role === "ADMIN"
                                    ? "/admin"
                                    : "/employee"
                                : "/"
                        }
                        replace
                    />
                }
            />
        </Routes>
    );
}
