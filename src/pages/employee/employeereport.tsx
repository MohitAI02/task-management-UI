
import { useState, useEffect, type ReactElement } from "react";
import { useAuth } from "../../context/authcontext";
import { getEmployeeReport } from "../../api/reports";
import type { EmployeeReport } from "../../type";


export default function EmployeeReport(): ReactElement {
    const { user } = useAuth();

    const [report, setReport] = useState<EmployeeReport | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    async function loadReport(): Promise<void> {
        if (!user) {
            setReport(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const reportData = await getEmployeeReport();
            setReport(reportData);
        } catch (err: unknown) {
            setReport(null);

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load employee report."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadReport();
    }, [user]);

    return (
        <div className="employee-report">
            <h2>My Report</h2>

            {loading && <p>Loading report...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && report && (
                <>
                    <p>
                        <strong>Name:</strong> {report.name}
                    </p>

                    <p>
                        <strong>Login ID:</strong> {report.loginId}
                    </p>

                    <table border={1} cellPadding={8}>
                        <tbody>
                            <tr>
                                <td>Total Assigned</td>
                                <td>{report.totalAssigned}</td>
                            </tr>

                            <tr>
                                <td>Completed In Time</td>
                                <td>{report.completedInTime}</td>
                            </tr>

                            <tr>
                                <td>Overdue</td>
                                <td>{report.overdueCount}</td>
                            </tr>

                            <tr>
                                <td>Ratio (Completed : Overdue)</td>
                                <td>{report.ratioCompletedToOverdue}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}

            {!loading && !error && !report && (
                <p>No report found.</p>
            )}

            <button
                type="button"
                onClick={() => void loadReport()}
                disabled={loading}
            >
                {loading ? "Loading..." : "Refresh Report"}
            </button>
        </div>
    );
}