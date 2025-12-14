import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Spinner from "../../components/ui/Spinner";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(ENDPOINTS.BOOKINGS.MY)
            .then(res => setBookings(res.data || []))
            .catch(() => setBookings([]))
            .finally(() => setLoading(false));
    }, []);

    // format ISO datetime → readable
    function formatDateTime(value) {
        if (!value) return "—";
        return new Date(value).toLocaleString();
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

            {bookings.length === 0 && (
                <div className="text-gray-500 text-center">
                    No bookings found
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map(b => (
                    <div
                        key={b.id}
                        className="bg-white rounded-xl shadow border p-5"
                    >
                        {/* CAR HEADER */}
                        <div className="mb-3">
                            <h2 className="text-lg font-semibold">
                                {b.car?.make} {b.car?.model}
                            </h2>
                            <div className="text-sm text-gray-500">
                                Plate No: {b.car?.plateNumber}
                            </div>
                        </div>

                        {/* BOOKING DETAILS */}
                        <div className="text-sm text-gray-700 space-y-1">
                            <div>
                                <span className="font-medium">Booking ID:</span>{" "}
                                {b.id}
                            </div>
                            <div>
                                <span className="font-medium">From:</span>{" "}
                                {formatDateTime(b.startDatetime)}
                            </div>
                            <div>
                                <span className="font-medium">To:</span>{" "}
                                {formatDateTime(b.endDatetime)}
                            </div>
                            <div>
                                <span className="font-medium">Total Price:</span>{" "}
                                ₹{b.totalPrice}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="text-sm">
                                <span className="font-medium">Status:</span>{" "}
                                <span
                                    className={
                                        b.status === "COMPLETED"
                                            ? "text-green-600"
                                            : b.status === "CANCELLED"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                    }
                                >
                                    {b.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
