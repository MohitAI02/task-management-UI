import {  createContext, useContext, useState,type ReactNode} from "react";

import { setLoginHeader } from "../api/client";
import type { LoginResponse } from "../type/auth";



interface AuthContextType {
    user: LoginResponse | null;
    login: (user: LoginResponse) => void;
    logout: () => void;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);


function getSavedUser(): LoginResponse | null {
    const saved = localStorage.getItem("taskManagementUser");

    if (!saved) {
        return null;
    }

    try {
        const user = JSON.parse(saved) as LoginResponse;
        setLoginHeader(user);
        return user;
    } catch {
        localStorage.removeItem("taskManagementUser");
        setLoginHeader(null);
        return null;
    }
}


export function AuthProvider({ children}: {children: ReactNode;}) {
    const [user, setUser] = useState<LoginResponse | null>(getSavedUser);


    function login(loggedInUser: LoginResponse): void {
      setUser(loggedInUser);
      localStorage.setItem("taskManagementUser",JSON.stringify(loggedInUser) );
      setLoginHeader(loggedInUser);
    }


    function logout(): void {
      setUser(null);   
      localStorage.clear();
      setLoginHeader(null);
    }   
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );}



export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}





























