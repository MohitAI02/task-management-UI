import {useState,type ReactElement,type SubmitEvent,} from "react";

import "../pagecss/taskfilters.css";
import type { TaskFilter } from "../../type/task";


interface TaskFiltersProps {
onFilter: (filter: TaskFilter) => Promise<void>;
loading: boolean;
}

export default function TaskFilters({
onFilter,
loading,
}: TaskFiltersProps): ReactElement {
const [status, setStatus] = useState<string>("");
const [fromDate, setFromDate] = useState<string>("");
const [toDate, setToDate] = useState<string>("");


async function onSubmit(
    event: SubmitEvent<HTMLFormElement>
): Promise<void> {
    event.preventDefault();

    const filter: TaskFilter = {
        status: status ? status as TaskFilter["status"] : undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
    };

    await onFilter(filter);
}

function handleReset(): void {
    setStatus("");
    setFromDate("");
    setToDate("");

    void onFilter({});
}
return (
    <form className="task-filters" onSubmit={onSubmit}>
        <div className="task-filter-group">
            <label htmlFor="status">Status</label>
            <select
                id="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
            >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="InProgress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
                <option value="Dropped">Dropped</option>
            </select>
        </div>

        <div className="task-filter-group">
            <label htmlFor="fromDate">From</label>
            <select name="age" id="age">
                <option value="12">12</option>
                <option value="23">21</option>
            </select>
            <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
            />
        </div>

        <div className="task-filter-group">
            <label htmlFor="toDate">To</label>
            <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
            />
        </div>

        <div className="task-filter-actions">
            <button
                type="submit"
                className="task-filter-apply"
                disabled={loading}
            >
                {loading ? "Loading..." : "Apply Filter"}
            </button>

            <button
                type="button"
                className="task-filter-reset"
                onClick={handleReset}
                disabled={loading}
            >
                Clear Filters
            </button>
        </div>
    </form>
);
}