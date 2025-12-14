import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import AddCar from "../components/car/AddCar";

export default function CarDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const carRes = await api.get(ENDPOINTS.CARS.BY_ID(id));
                setCar(carRes.data);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!car) return <div>Car not found</div>;

    function goToCheckout() {
        navigate(`/cars/${car.id}/checkout`);
    }

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT: Car Information */}
            <div className="md:col-span-2 bg-white p-4 rounded shadow">
                <h2 className="text-2xl font-bold">
                    {car.make} {car.model}
                </h2>
                <p className="text-gray-700 mt-3">{car.description}</p>

                <ul className="mt-4 space-y-1 text-gray-700">
                    <li><strong>Year:</strong> {car.year}</li>
                    <li><strong>Fuel:</strong> {car.fuelType}</li>
                    <li><strong>Seats:</strong> {car.seats}</li>
                    <li><strong>Transmission:</strong> {car.transmission}</li>
                </ul>
            </div>

            {/* RIGHT: Price + Book Button */}
            <aside className="bg-white p-4 rounded shadow">
                <div className="text-2xl font-bold mb-4">₹{car.pricePerDay} / day</div>

                <button
                    onClick={goToCheckout}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Book Now
                </button>
            </aside>
        </div>
    );
}
