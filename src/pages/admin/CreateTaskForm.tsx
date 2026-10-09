import {
useState,
type ReactElement,
type SubmitEvent,
} from "react";

import { createTask } from "../../api/tasks";
import type { CreateTaskRequest, Employee, TaskItem } from "../../type";



interface CreateTaskFormProps {
employees: Employee[];
onCreated: (task: TaskItem) => Promise<void>;
onError: (message: string) => void;
}

export default function CreateTaskForm({
employees,
onCreated,
onError,
}: CreateTaskFormProps): ReactElement {
const [title, setTitle] = useState<string>("");
const [description, setDescription] = useState<string>("");
const [dueDate, setDueDate] = useState<string>("");
const [assignedTo, setAssignedTo] = useState<string>("");
const [creating, setCreating] = useState<boolean>(false);


async function onSubmit(
    event: SubmitEvent<HTMLFormElement>
): Promise<void> {
    event.preventDefault();

    const taskData: CreateTaskRequest = {
        title: title.trim(),
        description: description.trim() || null,
        dueDate,
        assignedTo,
    };

    if (!taskData.title || !taskData.dueDate || !taskData.assignedTo) {
        onError("Please fill in the title, due date, and employee.");
        return;
    }

    onError("");
    setCreating(true);

    try {
        const task = await createTask(taskData);

        setTitle("");
        setDescription("");
        setDueDate("");
        setAssignedTo("");

        await onCreated(task);
    } catch (err: unknown) {
        onError(
            err instanceof Error
                ? err.message
                : "Failed to create task."
        );
    } finally {
        setCreating(false);
    }
}

return (
    <form onSubmit={onSubmit}>
        <div>
            <label htmlFor="title">Title</label>
            <br />
            <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
            />
        </div>

        <div>
            <label htmlFor="description">Description</label>
            <br />
            <textarea
                id="description"
                value={description}
                onChange={(event) =>
                    setDescription(event.target.value)
                }
            />
        </div>

        <div>
            <label htmlFor="dueDate">Due Date</label>
            <br />
            <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                required
            />
        </div>

        <div>
            <label htmlFor="assignedTo">Assign To</label>
            <br />
            <select
                id="assignedTo"
                value={assignedTo}
                onChange={(event) =>
                    setAssignedTo(event.target.value)
                }
                required
            >
                <option value="">-- Select Employee --</option>

                {employees.map((employee) => (
                    <option
                        key={employee.userId}
                        value={employee.loginId}
                    >
                        {employee.name} ({employee.loginId})
                    </option>
                ))}
            </select>
        </div>

        <br />

        <button type="submit" disabled={creating}>
            {creating ? "Creating..." : "Create Task"}
        </button>
    </form>
);
}
