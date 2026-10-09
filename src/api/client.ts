import type { LoginResponse } from "../type";



const BASE_URL = "https://localhost:7258/api";

interface ApiErrorBody {
  message?: string;
}

let currentLoginId: string | null = null;



export function setLoginHeader(
  user: LoginResponse | null
): void {
  currentLoginId = user?.loginId ?? null;
}



function buildHeaders(withJson: boolean): Record<string, string> {
  const headers: Record<string, string> = {};

  if (withJson) {
    headers["Content-Type"] = "application/json";
  }

  if (currentLoginId) {
    headers["X-Login-Id"] = currentLoginId;
  }
  return headers;
}



async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody: ApiErrorBody | null =
      await res.json().catch((): null => null);

    throw new Error(
      errorBody?.message ??
      `Request failed with status ${res.status}`
    );
  }
  return (await res.json()) as T;
}



export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: buildHeaders(false),
  });
  return handleResponse<T>(res);
}



export async function apiPost<T>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}



export async function apiPut<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(false),
  });
  return handleResponse<T>(res);
}
