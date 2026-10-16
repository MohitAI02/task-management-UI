
export interface CreateEmployeeRequest {
    name: string;
    designation: string;
    email: string;
}

export interface Employee {
    userId: number;
    loginId: string;
    name: string;
    designation: string;
}
