import {
useState,
useEffect,
type ReactElement,
type SubmitEvent,
} from "react";

import {
createEmployee,
getAllEmployees,
} from "../../api/employees";
import type { CreateEmployeeRequest, Employee } from "../../type";



export default function AdminEmployees(): ReactElement {
const [name, setName] = useState<string>("");
const [designation, setDesignation] = useState<string>("");
const [email, setEmail] = useState<string>("");


const [employees, setEmployees] = useState<Employee[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [creating, setCreating] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);

async function loadEmployees(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
        const employeeList = await getAllEmployees();
        setEmployees(employeeList);
    } catch (err: unknown) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to load employees."
        );
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    void loadEmployees();
}, []);

async function onSubmit(
    event: SubmitEvent<HTMLFormElement>
): Promise<void> {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const employeeData: CreateEmployeeRequest = {
        name: name.trim(),
        designation: designation.trim(),
        email: email.trim(),
    };

    if (
        !employeeData.name ||
        !employeeData.designation ||
        !employeeData.email
    ) {
        setError("Please fill in all fields.");
        return;
    }

    setCreating(true);

    try {
        const employee = await createEmployee(employeeData);

        setSuccess(
            `Employee "${employee.name}" created. Login: ${employee.loginId}`
        );

        setName("");
        setDesignation("");
        setEmail("");

        await loadEmployees();
    } catch (err: unknown) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to create employee."
        );
    } finally {
        setCreating(false);
    }
}

return (
    <div>
        <h2>Create Employee</h2>

        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="name">Name</label>
                <br />
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    required
                />
            </div>

            <div>
                <label htmlFor="designation">
                    Designation
                </label>
                <br />
                <input
                    id="designation"
                    type="text"
                    value={designation}
                    onChange={(event) =>
                        setDesignation(event.target.value)
                    }
                    required
                />
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <br />
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                    title="Please enter a valid email address"
                    required
                />
            </div>

            {error && <p role="alert">{error}</p>}
            {success && <p role="status">{success}</p>}

            <button
                type="submit"
                disabled={creating}
            >
                {creating
                    ? "Creating..."
                    : "Create Employee"}
            </button>
        </form>

        <hr />

        <h3>All Employees</h3>

        {loading && <p>Loading employees...</p>}

        {!loading && !error && employees.length === 0 && (
            <p>No employees found.</p>
        )}

        {!loading && employees.length > 0 && (
            <ul>
                {employees.map((employee) => (
                    <li key={employee.userId}>
                        {employee.name} ({employee.loginId}) -{" "}
                        {employee.designation}
                    </li>
                ))}
            </ul>
        )}

        <button
            type="button"
            onClick={() => void loadEmployees()}
            disabled={loading || creating}
        >
            {loading
                ? "Loading..."
                : "Refresh Employees"}
        </button>
    </div>
);


}
