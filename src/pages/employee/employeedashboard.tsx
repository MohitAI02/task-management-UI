import { Outlet } from "react-router-dom";
import Navbar from "../../component/navbar/navbar";


export default function EmployeeLayout() {
    return (
        <>
            <Navbar
                title="Employee Portal"
                links={[
                    
                    {to: "/employee/tasks",label: "My Tasks",},
                    {to: "/employee/report",label: "My Report",},
                ]}
            />
            <main className="employee-page-content">
                <Outlet />
            </main>
        </>
    );
}