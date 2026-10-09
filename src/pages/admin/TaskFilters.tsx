import {useState,type ReactElement,type SubmitEvent,} from "react";
import type { TaskFilter } from "../../type";


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
    <form onSubmit={onSubmit}>
        <div>
            <label htmlFor="status">Status</label>
            {" "}
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

        <div>
            <label htmlFor="fromDate">From</label>
            {" "}
            <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(event) => setFromDate(event.target.value)}
            />
        </div>

        <div>
            <label htmlFor="toDate">To</label>
            {" "}
            <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(event) => setToDate(event.target.value)}
            />
        </div>

        <br />

        <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Apply Filter"}
        </button>

        {" "}

        <button
            type="button"
            onClick={handleReset}
            disabled={loading}
        >
            Clear Filters
        </button>
    </form>
);

}
