import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/authcontext";
import AppRoutes from "./routes/protectedroute";



export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

