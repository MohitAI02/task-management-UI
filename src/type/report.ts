
export interface EmployeeReport {
    loginId: string;
    name: string;
    totalAssigned: number;
    completedInTime: number;
    overdueCount: number;
    ratioCompletedToOverdue: string;
}
