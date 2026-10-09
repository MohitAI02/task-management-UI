import { type ReactElement } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./navbar.css";
import { useAuth } from "../../context/authcontext";

interface NavItem {
    to: string;
    label: string;
    end?: boolean;
}

interface NavbarProps {
    title: string;
    links: NavItem[];
}

export default function Navbar({
    title,
    links,
}: NavbarProps): ReactElement {

    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout(): void {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <nav className="navbar">
            <span className="navbar-title">
                {title}
            </span>

            <div className="navbar-links">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className="navbar-link"
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>

            <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>
        </nav>
    );
}