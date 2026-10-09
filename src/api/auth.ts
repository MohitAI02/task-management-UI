
import type { LoginRequest, LoginResponse } from "../type";
import { apiPost } from "./client";


export function login(
    request: LoginRequest
): Promise<LoginResponse> {
    return apiPost<LoginResponse>("/Auth/login", request);
}