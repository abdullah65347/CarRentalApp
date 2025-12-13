import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import BookingCheckout from "./BookingCheckout";

export default function CarCheckoutPage() {
    const { id } = useParams();

    const [car, setCar] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const carRes = await api.get(ENDPOINTS.CARS.BY_ID(id));
                const locRes = await api.get(ENDPOINTS.LOCATIONS.LIST);

                setCar(carRes.data);
                setLocations(locRes.data);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!car) return <div>Car not found</div>;

    return <BookingCheckout car={car} locations={locations} />;
}
