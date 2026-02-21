import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Car, Menu, X } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { AuthModalContext } from "../../context/AuthModalContext";
import Button from "../ui/Button";

export default function Header() {
    const { user } = useContext(AuthContext);
    const { openLogin, openRegister } = useContext(AuthModalContext);
    const [mobileOpen, setMobileOpen] = useState(false);

    const roles = user?.roles || [];

    function initials(name = "") {
        return name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    const isAdmin = roles.includes("ROLE_ADMIN");
    const isOwner = roles.includes("ROLE_OWNER");
    const isUser = roles.includes("ROLE_USER");

    return (
        <header className="backdrop-blur-lg sticky top-0 z-40 border-b">
            <div className="px-4 lg:px-10 py-3 flex items-center justify-between">

                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="btn-dark-gradient rounded-lg p-1.5">
                        <Car className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold font-display text-foreground">
                        CarRental
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden text-lg md:flex items-center gap-6">
                    <Link to="/cars" className="nav-link hover:text-yellow-600">
                        Browse Cars
                    </Link>
                    <Link to="" className="nav-link hover:text-yellow-600">
                        How It Works
                    </Link>

                    {isUser && (
                        <Link to="/me/bookings" className="nav-link text-base b bg-slate-300 rounded-md px-2 py-1 ">
                            My Bookings
                        </Link>
                    )}

                    {isOwner && (
                        <Link to="/owner/dashboard" className="nav-link text-base b bg-slate-300 rounded-md px-2 py-1 ">
                            Owner Dashboard
                        </Link>
                    )}

                    {isAdmin && (
                        <Link to="/admin/dashboard" className="nav-link text-base b bg-slate-300 rounded-md px-2 py-1 ">
                            Admin Panel
                        </Link>
                    )}

                    {/* AUTH */}
                    {user ? (
                        <Link
                            to="/profile"
                            className="ml-4 w-9 h-9 rounded-full bg-yellow-900 text-slate-100 flex items-center justify-center font-semibold"
                        >
                            {initials(user.name)}
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2 ml-4">
                            <Button variant="ghost" size="md" onClick={openLogin}>
                                Login
                            </Button>
                            <Button size="sm" className="btn-dark-gradient" onClick={openRegister}>
                                Register
                            </Button>
                        </div>
                    )}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <nav className="md:hidden border-t bg-card px-4 py-4 flex flex-col gap-3">
                    <Link
                        to="/cars"
                        className="nav-link"
                        onClick={() => setMobileOpen(false)}
                    >
                        Browse Cars
                    </Link>

                    {isUser && (
                        <Link
                            to="/me/bookings"
                            className="nav-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            My Bookings
                        </Link>
                    )}

                    {isOwner && (
                        <Link
                            to="/owner/dashboard"
                            className="nav-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            Owner Dashboard
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="nav-link"
                            onClick={() => setMobileOpen(false)}
                        >
                            Admin Panel
                        </Link>
                    )}

                    {/* Mobile Auth */}
                    {user ? (
                        <Link
                            to="/profile"
                            className="mt-2 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold"
                            onClick={() => setMobileOpen(false)}
                        >
                            {initials(user.name)}
                        </Link>
                    ) : (
                        <div className="flex gap-2 pt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                    openLogin();
                                    setMobileOpen(false);
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                    openRegister();
                                    setMobileOpen(false);
                                }}
                            >
                                Register
                            </Button>
                        </div>
                    )}
                </nav>
            )}
        </header>
    );
}
