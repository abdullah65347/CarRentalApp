import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";

import ManageCar from "./ManageCar";
import AddCar from "../../components/car/AddCar";
import ManageOwnerBookings from "./ManageOwnerBookings";

export default function OwnerDashboard() {
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeView, setActiveView] = useState("CARS");

    const [selectedCar, setSelectedCar] = useState(null);
    const [showAddCar, setShowAddCar] = useState(false);

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        try {
            setLoading(true);

            const [carsRes, bookingsRes] = await Promise.all([
                api.get(ENDPOINTS.CARS.MY),
                api.get(ENDPOINTS.BOOKINGS.OWNER),
            ]);

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

    const totalCars = cars.length;
    const activeCars = cars.filter(c => c.status === "ACTIVE").length;

    function tabStyle(tab) {
        const active = activeView === tab;

        return `
            relative px-6 py-4 text-base font-semibold transition-all
            ${active
                ? "text-blue-600 bg-white"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }
        `;
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Owner Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                    Manage your cars and bookings
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="text-sm text-gray-500">Total Cars</div>
                    <div className="text-2xl font-semibold">
                        {totalCars}
                    </div>
                </Card>

                <Card>
                    <div className="text-sm text-gray-500">Active Cars</div>
                    <div className="text-2xl font-semibold text-green-600">
                        {activeCars}
                    </div>
                </Card>

                <Card>
                    <div className="text-sm text-gray-500">Total Bookings</div>
                    <div className="text-2xl font-semibold">
                        {bookings.length}
                    </div>
                </Card>
            </div>

            {/* MAIN CONTAINER */}
            <div className="bg-white rounded-2xl shadow border overflow-hidden">
                {/* TABS HEADER */}
                <div className="flex bg-gray-50 border-b">
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

                {/* TAB CONTENT */}
                <div className="p-6">
                    {/* ===== CARS TAB ===== */}
                    {activeView === "CARS" && (
                        <>
                            <div className="flex justify-end mb-4">
                                <Button onClick={() => setShowAddCar(true)}>
                                    + Add Car
                                </Button>
                            </div>

                            {cars.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    No cars added yet
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {cars.map(car => (
                                        <div
                                            key={car.id}
                                            className="py-4 px-2 flex items-center justify-between hover:bg-gray-50 rounded-lg transition"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {car.make} {car.model}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ₹{car.pricePerDay} / day
                                                    <span className="mx-2">•</span>
                                                    <span
                                                        className={
                                                            car.status === "ACTIVE"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                        }
                                                    >
                                                        {car.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setSelectedCar(car)}
                                            >
                                                Manage
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {/* ===== BOOKINGS TAB ===== */}
                    {activeView === "BOOKINGS" && (
                        <ManageOwnerBookings
                            bookings={bookings}
                            reload={loadAll}
                        />
                    )}
                </div>
            </div>

            {/* ADD CAR MODAL */}
            <AddCar
                open={showAddCar}
                onClose={() => setShowAddCar(false)}
                onSaved={loadAll}
            />

            {/* MANAGE CAR MODAL */}
            {selectedCar && (
                <ManageCar
                    car={selectedCar}
                    onClose={() => setSelectedCar(null)}
                    onSaved={loadAll}
                />
            )}
        </div>
    );
}
