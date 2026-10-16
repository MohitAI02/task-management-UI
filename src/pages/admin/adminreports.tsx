import {useState,useEffect,type ReactElement,} from "react";

import { getAllEmployeeReports } from "../../api/reports";
import type { EmployeeReport } from "../../type/report";



export default function AdminReports(): ReactElement {
const [reports, setReports] = useState<EmployeeReport[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);


async function loadReports(): Promise<void> {
    setLoading(true);
    setError(null);

    try {
        const reportList = await getAllEmployeeReports();
        setReports(reportList);
    } catch (err: unknown) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to load employee reports."
        );
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    void loadReports();
}, []);

return (
    <div>
        <h2>Employee Reports</h2>

        {loading && <p>Loading employee reports...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && reports.length === 0 && (
            <p>No employee reports found.</p>
        )}

        {!loading && !error && reports.length > 0 && (
            <table border={1} cellPadding={6}>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Total Assigned</th>
                        <th>Completed In Time</th>
                        <th>Overdue</th>
                        <th>Ratio</th>
                    </tr>
                </thead>

                <tbody>
                    {reports.map((report) => (
                        <tr key={report.loginId}>
                            <td>
                                {report.name} ({report.loginId})
                            </td>
                            <td>{report.totalAssigned}</td>
                            <td>{report.completedInTime}</td>
                            <td>{report.overdueCount}</td>
                            <td>{report.ratioCompletedToOverdue}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}

        <br />

        <button
            type="button"
            onClick={() => void loadReports()}
            disabled={loading}
        >
            {loading ? "Loading..." : "Refresh Reports"}
        </button>
    </div>
);


}
