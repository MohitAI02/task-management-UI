import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../api/auth";
import { useAuth } from "../../context/authcontext";

import "./loginpage.css";

function LoginPage() {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login: saveUser } = useAuth();

    async function handleSubmit(
        event: SubmitEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await login({
                loginId: loginId,
                password: password,
            });

            if (
                response.role !== "ADMIN" &&
                response.role !== "EMPLOYEE"
            ) {
                setErrorMessage("Your account has an invalid role.");
                return;
            }

            saveUser(response);

            if (response.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate("/employee");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage(
                "Login failed. Please check."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>LOGIN</h1>
                <p>Please enter your login and password!</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="loginId"
                        placeholder="Login ID"
                        value={loginId}
                        onChange={(e) => setLoginId(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {errorMessage && (
                        <p className="error-message" role="alert">
                            {errorMessage}
                        </p>
                    )}
                    


              
                    <br />

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "LOGIN"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;

