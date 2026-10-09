
import { Outlet } from "react-router-dom";
import Navbar from "../../component/navbar/navbar";


export default function AdminLayout() {
    return (
        <>
            <Navbar
                title="Admin Portal"
                links={[
                    { to: "/admin", label: "Home", end: true },
                    { to: "/admin/employees", label: "Employees" },
                    { to: "/admin/tasks", label: "Tasks" },
                    { to: "/admin/reports", label: "Reports" },
                    ]}
                />
               

            <main className="admin-page-content">
                <Outlet />
            </main>
        </>
    );
}