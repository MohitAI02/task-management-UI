
export interface LoginRequest {
    loginId: string;
    password: string;
}

export interface LoginResponse {
    userId: number;
    loginId: string;
    name: string;
    designation: string;
    role: "ADMIN" | "EMPLOYEE";
}
