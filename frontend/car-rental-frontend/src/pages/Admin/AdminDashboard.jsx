import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

import ManageUser from "./ManageUsers";
import ManageAllCars from "./ManageAllCars";
import ManageAllBookings from "./ManageAllBookings";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeView, setActiveView] = useState("USERS");

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        try {
            setLoading(true);

            const [usersRes, carsRes, bookingsRes] = await Promise.all([
                api.get(ENDPOINTS.ADMIN.USERS),
                api.get(ENDPOINTS.CARS.LIST),
                api.get(ENDPOINTS.BOOKINGS.ALL),
            ]);

            setUsers(
                usersRes.data.filter(u =>
                    !u.roles.some(r => r.name === "ROLE_ADMIN")
                )
            );
            setCars(carsRes.data || []);
            setBookings(bookingsRes.data || []);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner size="lg" />
            </div>
        );
    }

    function tabStyle(tab) {
        const active = activeView === tab;

        return `
            relative px-6 py-4 text-base font-semibold transition-all
            ${active
                ? "text-blue-600 bg-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}
        `;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>

            {/* ===== STATS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="text-sm text-gray-500">Total Users</div>
                    <div className="text-2xl font-semibold">{users.length}</div>
                </Card>
                <Card>
                    <div className="text-sm text-gray-500">Total Cars</div>
                    <div className="text-2xl font-semibold">{cars.length}</div>
                </Card>
                <Card>
                    <div className="text-sm text-gray-500">Total Bookings</div>
                    <div className="text-2xl font-semibold">{bookings.length}</div>
                </Card>
            </div>

            {/* ===== MAIN CONTAINER ===== */}
            <div className="bg-white rounded-2xl shadow border overflow-hidden">
                {/* ===== TABS HEADER ===== */}
                <div className="flex bg-gray-50 border-b">
                    <button
                        className={tabStyle("USERS")}
                        onClick={() => setActiveView("USERS")}
                    >
                        Users
                        {activeView === "USERS" && (
                            <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-600 rounded-t" />
                        )}
                    </button>

                    <button
                        className={tabStyle("CARS")}
                        onClick={() => setActiveView("CARS")}
                    >
                        Cars
                        {activeView === "CARS" && (
                            <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-600 rounded-t" />
                        )}
                    </button>

                    <button
                        className={tabStyle("BOOKINGS")}
                        onClick={() => setActiveView("BOOKINGS")}
                    >
                        Bookings
                        {activeView === "BOOKINGS" && (
                            <span className="absolute left-0 right-0 bottom-0 h-1 bg-blue-600 rounded-t" />
                        )}
                    </button>
                </div>

                {/* ===== TAB CONTENT ===== */}
                <div className="p-6">
                    {activeView === "USERS" && (
                        <ManageUser users={users} reload={loadAll} />
                    )}

                    {activeView === "CARS" && (
                        <ManageAllCars cars={cars} reload={loadAll} />
                    )}

                    {activeView === "BOOKINGS" && (
                        <ManageAllBookings
                            bookings={bookings}
                            reload={loadAll}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
