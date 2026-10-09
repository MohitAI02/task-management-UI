import {
useState,
useEffect,
type ReactElement,
} from "react";



import { getAllEmployees } from "../../api/employees";

import {
getAllTasks,
markDone,
dropTask,
} from "../../api/tasks";
import type { Employee, TaskFilter, TaskItem } from "../../type";
import { useAuth } from "../../context/authcontext";
import CreateTaskForm from "./CreateTaskForm";
import TaskFilters from "./TaskFilters";



export default function AdminTasks(): ReactElement {
const { user } = useAuth();

const [employees, setEmployees] = useState<Employee[]>([]);
const [tasks, setTasks] = useState<TaskItem[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
const [actionLoading, setActionLoading] = useState<boolean>(false);

async function loadEmployees(): Promise<void> {
    try {
        const data = await getAllEmployees();
        setEmployees(data);
    } catch (err: unknown) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to load employees."
        );
    }
}

async function loadTasks(
    filter?: TaskFilter
): Promise<void> {
    setLoading(true);
    setError(null);

    try {
        const data = await getAllTasks(filter);
        setTasks(data);
    } catch (err: unknown) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to load tasks."
        );
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    void loadEmployees();
    void loadTasks();
}, []);

async function handleTaskCreated(
    task: TaskItem
): Promise<void> {
    setSuccess(`Task "${task.title}" created.`);
    setError(null);

    await loadTasks();
}

function handleCreateTaskError(message: string): void {
    setError(message);
    setSuccess(null);
}

async function handleFilter(
    filter: TaskFilter
): Promise<void> {
    await loadTasks(filter);
}

async function handleMarkDone(
    taskId: number
): Promise<void> {
    if (!user) {
        return;
    }

    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
        await markDone(taskId);
        setSuccess("Task marked as done.");
        await loadTasks();
    } catch (err: unknown) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to mark task as done."
        );
    } finally {
        setActionLoading(false);
    }
}

async function handleDrop(
    taskId: number
): Promise<void> {
    if (!user) {
        return;
    }

    setActionLoading(true);
    setError(null);
    setSuccess(null);

    try {
        await dropTask(taskId);
        setSuccess("Task dropped.");
        await loadTasks();
    } catch (err: unknown) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to drop task."
        );
    } finally {
        setActionLoading(false);
    }
}

return (
    <div>
        <h2>Create Task</h2>

        <CreateTaskForm
            employees={employees}
            onCreated={handleTaskCreated}
            onError={handleCreateTaskError}
        />

        {error && <p role="alert">{error}</p>}
        {success && <p role="status">{success}</p>}

        <hr />

        <h2>All Tasks</h2>

        <TaskFilters
            onFilter={handleFilter}
            loading={loading}
        />

        {loading && <p>Loading tasks...</p>}

        {!loading && !error && tasks.length === 0 && (
            <p>No tasks found.</p>
        )}

        {!loading && tasks.length > 0 && (
            <table border={1} cellPadding={6}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Assigned To</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.taskId}>
                            <td>{task.taskId}</td>
                            <td>{task.title}</td>
                            <td>{task.assignedTo}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.status}</td>

                            <td>
                                {task.status !== "Done" &&
                                    task.status !== "Dropped" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void handleMarkDone(
                                                        task.taskId
                                                    )
                                                }
                                                disabled={actionLoading}
                                            >
                                                Mark Done
                                            </button>

                                            {" "}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void handleDrop(
                                                        task.taskId
                                                    )
                                                }
                                                disabled={actionLoading}
                                            >
                                                Drop
                                            </button>
                                        </>
                                    )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
);


}
