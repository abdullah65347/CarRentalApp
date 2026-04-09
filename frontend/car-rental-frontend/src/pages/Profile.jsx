import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown({ user, onClose }) {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/");
        onClose();
    }

    return (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg p-4 z-50">

            {/* USER INFO */}
            <div className="mb-3">
                <div className="font-semibold text-gray-900">
                    {user?.name}
                </div>
                <div className="text-sm text-gray-500">
                    {user?.email}
                </div>
            </div>

            <div className="border-t border-gray-100 my-2" />

            {/* MY BOOKINGS */}
            <button
                onClick={() => {
                    navigate("/my-bookings");
                    onClose();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
            >
                My Bookings
            </button>

            {/* LOGOUT */}
            <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
            >
                Logout
            </button>
        </div>
    );
}