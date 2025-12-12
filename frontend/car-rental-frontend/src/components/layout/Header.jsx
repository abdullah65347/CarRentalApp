import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

export default function Header() {
    const { user, logout } = useContext(AuthContext)
    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-semibold">CarRental</Link>
                <nav className="space-x-4">
                    <Link to="/cars">Browse</Link>
                    {user ? (
                        <>
                            <Link to="/me/bookings">My Bookings</Link>
                            <button onClick={logout} className="ml-2">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login">Login</Link>
                            <Link to="/auth/register" className="ml-2">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    )
}