import { useEffect, useState } from "react";
import { Star, Fuel, Users, Gauge } from "lucide-react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { BACKEND_BASE_URL } from "../../config/env";
import Spinner from "../ui/Spinner";

export default function CarCard({ car, onView, index = 0 }) {
    const [image, setImage] = useState(null);
    const [loadingImage, setLoadingImage] = useState(true);

    useEffect(() => {
        setLoadingImage(true);

        api.get(ENDPOINTS.CARIMAGES.IMAGES(car.id))
            .then(res => {
                const primary = res.data.find(img => img.isPrimary);
                if (primary) {
                    setImage(BACKEND_BASE_URL + primary.url);
                }
            })
            .catch(() => { })
            .finally(() => {
                // We don't stop loading here yet
                // Wait until actual <img> loads
            });
    }, [car.id]);

    return (
        <div className="bg-white rounded-2xl overflow-hidden card-hover hover:card-hover transition-shadow duration-300 group">

            {/* IMAGE */}
            <div className="relative h-48 overflow-hidden">

                {loadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <Spinner size="md" />
                    </div>
                )}

                <img
                    src={image || "/car-placeholder.png"}
                    alt={car.make}
                    onLoad={() => setLoadingImage(false)}
                    onError={() => setLoadingImage(false)}
                    className={`w-full h-full object-cover transition-all duration-500 
${loadingImage ? "opacity-0" : "opacity-100"}`} />
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
