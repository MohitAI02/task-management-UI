
import { useState, useEffect, type ReactElement } from "react";
import {getMyTasks,startTask,submitForReview} from "../../api/tasks";
import { useAuth } from "../../context/authcontext";
import type { TaskItem } from "../../type/task";






export default function EmployeeTasks(): ReactElement {
    const { user } = useAuth();

    const [myTasks, setMyTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function loadMyTasks(): Promise<void> {
        if (!user) {
            setMyTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const tasks = await getMyTasks();
            setMyTasks(tasks);
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
        void loadMyTasks();
    }, [user]);

    async function handleStart(taskId: number): Promise<void> {
        if (!user) {
            setError("User is not logged in.");
            return;
        }

        setError(null);
        setActionLoading(true);

        try {
            await startTask(taskId);
            await loadMyTasks();
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to start task."
            );
        } finally {
            setActionLoading(false);
        }
    }

    async function handleSubmitForReview(
        taskId: number
    ): Promise<void> {
        if (!user) {
            setError("User is not logged in.");
            return;
        }

        setError(null);
        setActionLoading(true);

        try {
            await submitForReview(taskId);
            await loadMyTasks();
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to submit task for review."
            );
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <div className="employee-tasks">
            <h2>My Tasks</h2>
            <p>View your assigned tasks and update their status.</p>

            {loading && <p>Loading tasks...</p>}

            {error && (
                <p className="error-message" role="alert">
                    {error}
                </p>
            )}

            {!loading && !error && myTasks.length === 0 && (
                <p>No tasks assigned.</p>
            )}

            {!loading && myTasks.length > 0 && (
                <table border={1} cellPadding={8}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {myTasks.map((task) => (
                            <tr key={task.taskId}>
                                <td>{task.taskId}</td>
                                <td>{task.title}</td>
                                <td>{task.description ?? "-"}</td>
                                <td>{task.dueDate}</td>
                                <td>{task.status}</td>
                                <td>
                                    {task.status === "Pending" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleStart(task.taskId)
                                            }
                                            disabled={actionLoading}
                                        >
                                            {actionLoading
                                                ? "Processing..."
                                                : "Start"}
                                        </button>
                                    )}

                                    {task.status === "InProgress" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleSubmitForReview(
                                                    task.taskId
                                                )
                                            }
                                            disabled={actionLoading}
                                        >
                                            {actionLoading
                                                ? "Processing..."
                                                : "Submit for Review"}
                                        </button>
                                    )}

                                    {task.status === "Review" && (
                                        <span>Waiting for review</span>
                                    )}

                                    {task.status === "Done" && (
                                        <span>Completed</span>
                                    )}

                                    {task.status === "Dropped" && (
                                        <span>Dropped</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button
                type="button"
                onClick={() => void loadMyTasks()}
                disabled={loading || actionLoading}
            >
                {loading ? "Loading..." : "Refresh Tasks"}
            </button>
        </div>
    );
}