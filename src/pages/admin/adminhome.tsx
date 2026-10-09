import {
useState,
useEffect,
type ReactElement,
} from "react";

import { getOverdueTasks } from "../../api/tasks";
import type { TaskItem } from "../../type";


export default function AdminHome(): ReactElement {
const [overdueTasks, setOverdueTasks] = useState<TaskItem[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

async function loadOverdueTasks(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
        const tasks = await getOverdueTasks();
        setOverdueTasks(tasks);
    } catch (err: unknown) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to load overdue tasks."
        );
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    void loadOverdueTasks();
}, []);

return (
    <div>
        <h2>Overdue Tasks</h2>

        {loading && <p>Loading overdue tasks...</p>}

        {error && (
            <p role="alert">{error}</p>
        )}

        {!loading && !error && overdueTasks.length === 0 && (
            <p>No overdue tasks.</p>
        )}

        {!loading && !error && overdueTasks.length > 0 && (
            <table border={1} cellPadding={6}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Assigned To</th>
                        <th>Due Date</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {overdueTasks.map((task) => (
                        <tr key={task.taskId}>
                            <td>{task.taskId}</td>
                            <td>{task.title}</td>
                            <td>{task.assignedTo}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

        <br />

        <button
            type="button"
            onClick={() => void loadOverdueTasks()}
            disabled={loading}
        >
            {loading ? "Loading..." : "Refresh"}
        </button>
    </div>
);


}
