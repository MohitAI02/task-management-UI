
import type { EmployeeReport } from "../type";
import { apiGet } from "./client";


export function getEmployeeReport(): Promise<EmployeeReport> {
  return apiGet<EmployeeReport>("/Reports/employee");
}


export function getAllEmployeeReports(): Promise<EmployeeReport[]> {
  return apiGet<EmployeeReport[]>("/Reports/all");
}

