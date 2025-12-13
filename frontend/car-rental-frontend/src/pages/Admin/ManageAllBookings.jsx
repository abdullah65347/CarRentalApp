import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";

export default function ManageAllBookings() {
    // const [bookings, setBookings] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     loadBookings();
    // }, []);

    // async function loadBookings() {
    //     const res = await api.get("/bookings");
    //     setBookings(res.data);
    //     setLoading(false);
    // }

    // if (loading) return <Spinner size="lg" />;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Manage All Bookings</h1>

            {/* <Card>
                <div className="divide-y">
                    {bookings.map(b => (
                        <div key={b.id} className="py-3">
                            <div className="font-medium">Booking {b.id}</div>
                            <div className="text-sm text-gray-500">{b.status}</div>
                        </div>
                    ))}
                </div>
            </Card> */}
        </div>
    );
}
