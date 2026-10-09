import { apiGet, apiPost, apiPut } from "./client";
import type { CreateTaskRequest, TaskItem, TaskFilter }from "../type";

export function createTask(request: CreateTaskRequest): Promise<TaskItem> {
  return apiPost<TaskItem>("/Tasks", request);
}

export function getAllTasks(filter?: TaskFilter): Promise<TaskItem[]> {
  const params = new URLSearchParams();
  if (filter?.status) params.append("status", filter.status);
  if (filter?.fromDate) params.append("fromDate", filter.fromDate);
  if (filter?.toDate) params.append("toDate", filter.toDate);
  const query = params.toString();
  return apiGet<TaskItem[]>(`/Tasks${query ? `?${query}` : ""}`);
}


export function getOverdueTasks(): Promise<TaskItem[]> {
  return apiGet<TaskItem[]>("/Tasks/overdue");
}

export function getTaskById(taskId: number): Promise<TaskItem> {
  return apiGet<TaskItem>(`/Tasks/${taskId}`);
}

export function getMyTasks(): Promise<TaskItem[]> {
  return apiGet<TaskItem[]>("/Tasks/my");
}


export function startTask(taskId: number): Promise<TaskItem> {
  return apiPut<TaskItem>(`/Tasks/${taskId}/start`);
}

export function submitForReview(taskId: number): Promise<TaskItem> {
  return apiPut<TaskItem>(`/Tasks/${taskId}/review`);
}


export function markDone(taskId: number): Promise<TaskItem> {
  return apiPut<TaskItem>(`/Tasks/${taskId}/done`);
}


export function dropTask(taskId: number): Promise<TaskItem> {
  return apiPut<TaskItem>(`/Tasks/${taskId}/drop`);
}