import {Routes,Route,Navigate,} from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import LoginPage from "../../pages/loginpage/loginpage";
import ProtectedRoute from "./protectedroute";
import AdminLayout from "../../pages/admin/admindashboard";
import AdminHome from "../../pages/admin/adminhome";
import AdminEmployees from "../../pages/admin/adminemployees";
import AdminTasks from "../../pages/admin/admintasks";
import AdminReports from "../../pages/admin/adminreports";
import EmployeeLayout from "../../pages/employee/employeedashboard";
import EmployeeTasks from "../../pages/employee/employeetasks";
import EmployeeReport from "../../pages/employee/employeereport";

;

export default function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    user ? (
                        <Navigate
                            to={
                                user.role === "ADMIN"
                                    ? "/admin"
                                    : "/employee"
                            }
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

