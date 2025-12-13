import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

import ManageUser from "./ManageUsers";
import ManageAllCars from "./ManageAllCars";

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
                // api.get(ENDPOINTS.BOOKINGS.ALL),
            ]);

            setUsers(
                usersRes.data.filter(u =>
                    !u.roles.some(r => r.name === "ROLE_ADMIN")
                )
            );
            setCars(carsRes.data.content || []);
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

            {/* ===== DROPDOWN ===== */}
            <div className="flex justify-end">
                <select
                    className="input w-56"
                    value={activeView}
                    onChange={(e) => setActiveView(e.target.value)}
                >
                    <option value="USERS">Manage Users</option>
                    <option value="CARS">Manage Cars</option>
                    <option value="BOOKINGS">Manage Bookings</option>
                </select>
            </div>

            {/* ===== DYNAMIC CONTENT ===== */}
            <Card>
                {activeView === "USERS" && (
                    <ManageUser users={users} reload={loadAll} />
                )}

                {activeView === "CARS" && (
                    <ManageAllCars cars={cars} reload={loadAll} />
                )}

                {activeView === "BOOKINGS" && (
                    <ManageAllBookings bookings={bookings} reload={loadAll} />
                )}
            </Card>
        </div>
    );
}
