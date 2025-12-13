import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function Header() {
    const { user, logout } = useContext(AuthContext);

    const roles = user?.roles || [];

    const isAdmin = roles.includes("ROLE_ADMIN");
    const isOwner = roles.includes("ROLE_OWNER");
    const isUser = roles.includes("ROLE_USER"); // NEW
    console.log("User roles:", roles);


    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                {/* LOGO */}
                <Link to="/" className="text-xl font-bold text-blue-600">
                    CarRental
                </Link>

                {/* NAV */}
                <nav className="flex items-center gap-4">

                    <Link to="/cars" className="text-gray-700 hover:text-blue-600">
                        Browse Cars
                    </Link>

                    {/* SHOW ONLY FOR NORMAL USER */}
                    {isUser && (
                        <Link
                            to="/me/bookings"
                            className="text-gray-700 hover:text-blue-600"
                        >
                            My Bookings
                        </Link>
                    )}

                    {/* OWNER LINKS */}
                    {isOwner && (
                        <Link
                            to="/owner/dashboard"
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Owner Dashboard
                        </Link>
                    )}

                    {/* ADMIN LINKS */}
                    {isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Admin Panel
                        </Link>
                    )}

                    {/* AUTH ACTIONS */}
                    {user ? (
                        <div className="flex items-center gap-3 ml-4">
                            <Link
                                to="/profile"
                                className="text-sm font-medium text-gray-600 hover:text-blue-600"
                            >
                                {user.name}
                            </Link>

                            <Button variant="secondary" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 ml-4">
                            <Link to="/auth/login">
                                <Button variant="secondary">Login</Button>
                            </Link>
                            <Link to="/auth/register">
                                <Button>Register</Button>
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
