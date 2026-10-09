import type { CreateEmployeeRequest, Employee } from "../type";
import { apiGet, apiPost } from "./client";



export function createEmployee(request: CreateEmployeeRequest): Promise<Employee> {
  return apiPost<Employee>("/Employees", request);
}


export function getAllEmployees(): Promise<Employee[]> {
  return apiGet<Employee[]>("/Employees");
}


export function getEmployee(loginId: string): Promise<Employee> {
  return apiGet<Employee>(`/Employees/${loginId}`);
}