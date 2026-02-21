import { useEffect, useState } from "react";
import { Star, Fuel, Users, Gauge } from "lucide-react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { BACKEND_BASE_URL } from "../../config/env";

export default function CarCard({ car, onView, index = 0 }) {
    const [image, setImage] = useState(null);

    useEffect(() => {
        api.get(ENDPOINTS.CARIMAGES.IMAGES(car.id))
            .then(res => {
                const primary = res.data.find(img => img.isPrimary);
                if (primary) setImage(BACKEND_BASE_URL + primary.url);
            })
            .catch(() => { });
    }, [car.id]);

    return (
        <div className="bg-white rounded-2xl overflow-hidden card-hover hover:card-hover transition-shadow duration-300 group">

            {/* IMAGE */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image || "/car-placeholder.png"}
                    alt={car.make}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* CONTENT */}
            <div className="p-5">

                {/* Brand + Name */}
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {car.model}
                </p>

                <h3 className="text-xl font-semibold text-foreground mt-1">
                    {car.make}
                </h3>

                {/* FEATURES */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-2">

                    <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        {car.seats}
                    </div>

                    <div className="flex items-center gap-1">
                        <Fuel className="h-4 w-4 text-gray-400" />
                        {car.carType}
                    </div>

                    <div className="flex items-center gap-1">
                        <Gauge className="h-4 w-4 text-gray-400" />
                        {car.transmission}
                    </div>
                </div>

                {/* Price + Button */}
                <div className="flex items-center justify-between my-2 py-2 px-2 border-t border-gray-400">
                    <div>
                        <span className="text-xl font-bold text-foreground">
                            ₹{car.pricePerDay}
                        </span>
                        <span className="text-sm text-gray-500"> /day</span>
                    </div>

                    <button
                        onClick={() => onView(car)}
                        className="px-4 py-2 text-sm font-medium rounded-xl text-white transition btn-dark-gradient "
                    >
                        View Details
                    </button>
                </div>

            </div>
        </div>
    );
}
