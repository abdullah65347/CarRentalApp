import React, { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Spinner from "../../components/ui/Spinner";


export default function MyBookings() {
    const [bookings, setBookings] = useState([]);


    useEffect(() => {
        api.get(ENDPOINTS.BOOKINGS.MY)
            .then(res => setBookings(res.data))
            .catch(() => setBookings([]));
    }, []);


    async function cancelBooking(id) {
        await api.put(ENDPOINTS.BOOKINGS.CANCEL(id));
        setBookings(b => b.map(x => x.id === id ? { ...x, status: "CANCELLED" } : x));
    }


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

            <div className="space-y-4">
                {bookings.map(b => (
                    <div key={b.id} className="bg-white p-4 rounded shadow">
                        <div className="font-semibold">Booking {b.id}</div>
                        <div className="text-sm text-gray-600">Status: {b.status}</div>
                        {b.status === "PENDING" && (
                            <button
                                onClick={() => cancelBooking(b.id)}
                                className="mt-2 text-red-600">
                                Cancel
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}