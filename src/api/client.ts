import type { LoginResponse } from "../type/auth";


const BASE_URL = "https://localhost:7258/api";

interface ApiErrorBody {
  message?: string;
}

let currentLoginId: string | null = null;


export function setLoginHeader(user: LoginResponse | null): void {
  if (user !== null && user !== undefined && user.loginId !== null && user.loginId !== undefined) {
    currentLoginId = user.loginId;
  } else {
    currentLoginId = null;
  }
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
    const errorBody: ApiErrorBody | null =await res.json().catch((): null => null);
    let errorMessage: string;

    if (
      errorBody !== null && 
      errorBody !== undefined && 
      errorBody.message !== null && 
      errorBody.message !== undefined
    ) {
      errorMessage = errorBody.message;
    } else {
      errorMessage = `Request failed with status ${res.status}`;
    }

    throw new Error(errorMessage);
  }
  
  return (await res.json()) as T;
}



export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: buildHeaders(false),
  });
  return handleResponse<T>(res);
}


export async function apiPost<T>(path: string, body: unknown): Promise<T> {
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
