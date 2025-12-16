import { useEffect, useState } from "react";
import { ENDPOINTS } from "../../api/endpoints";
import BookingList from "../../components/booking/BookingList";
import api from "../../api/apiClient";

export default function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(ENDPOINTS.BOOKINGS.MY)
            .then(res => setBookings(res.data || []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <BookingList
            title="My Bookings"
            bookings={bookings}
            loading={loading}
        />
    );
}
