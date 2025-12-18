import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";

export default function CarCard({ car }) {
    const navigate = useNavigate();
    const API_BASE =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

    const [image, setImage] = useState(null);

    useEffect(() => {
        api.get(ENDPOINTS.CARIMAGES.IMAGES(car.id))
            .then(res => {
                const primary = res.data.find(img => img.isPrimary);
                if (primary) setImage(API_BASE + primary.url);
            })
            .catch(() => { });
    }, [car.id]);

    return (
        <div
            onClick={() => navigate(`/cars/${car.id}`)}
            className="group cursor-pointer rounded-xl overflow-hidden bg-gradient-to-b from-white to-gray-50
        shadow-lg card-hover">
            {/* IMAGE */}
            <div className="relative h-[180px]
                        bg-gray-100
                        flex items-center justify-center
                        overflow-hidden
             ">
                <img
                    src={image || "/car-placeholder.png"}
                    alt={car.make}
                    className="w-full h-full object-contain object-center image-zoom"
                />

                {/* PRICE BADGE */}
                <div className="
            absolute top-3 right-3
            bg-gray-900/85 text-white
            text-xs px-3 py-1.5
            rounded-full
            backdrop-blur
        ">
                    ₹ {car.pricePerDay} / day
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-3">
                <div>
                    <p className="text-xs text-gray-500">{car.model}</p>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {car.make}
                    </h2>
                </div>

                {/* DIVIDER */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* FEATURES */}
                <div className="flex justify-between text-xs text-gray-600">
                    <span>{car.carType}</span>
                    <span>{car.transmission}</span>
                    <span>{car.seats} Seats</span>
                </div>

                {/* CTA */}
                <button
                    className="
                mt-2 w-full
                py-2 rounded-lg
                text-sm font-medium
                bg-gradient-to-r from-gray-900 to-gray-800
                text-white
                transition
                hover:translate-x-1
            "
                >
                    View Details →
                </button>
            </div>
        </div>

    );
}
