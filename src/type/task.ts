
export type TaskStatus =
    | "Pending"
    | "InProgress"
    | "Review"
    | "Done"
    | "Dropped";

export interface CreateTaskRequest {
    title: string;
    description: string | null;
    dueDate: string;
    assignedTo: string;
}

export interface TaskItem {
    taskId: number;
    title: string;
    description: string | null;
    createDate: string;
    dueDate: string;
    actualCompletedDate: string | null;
    status: TaskStatus;
    assignedTo: string;
    createdBy: string;
}

export interface TaskFilter {
    status?: TaskStatus;
    fromDate?: string;
    toDate?: string;
}
