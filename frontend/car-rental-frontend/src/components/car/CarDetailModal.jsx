import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Modal from "../ui/Modal";
import CarImageCarousel from "./carImageCarousel";
import { BACKEND_BASE_URL } from "../../config/env";

export default function CarDetailModal({ open, car, onClose }) {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (!car) return;

        api.get(ENDPOINTS.CARIMAGES.IMAGES(car.id))
            .then(res => {
                const primary = res.data.find(img => img.isPrimary);
                const others = res.data.filter(img => !img.isPrimary);
                setImages(primary ? [primary, ...others] : others);
            })
            .catch(() => setImages([]));
    }, [car]);

    if (!car) return null;

    const bookNow = () => {
        onClose();
        navigate(`/cars/${car.id}/checkout`);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`${car.make} ${car.model}`}
            size="xl"
            onConfirm={bookNow}
            confirmText="Book Now"
            variant="custom"
            hideCancelBtn="true"
            confirmClassName="
                px-8 py-3 rounded-xl
                bg-gradient-to-r from-gray-900 to-gray-800
                text-white font-medium
                hover:scale-105 transition
            "
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT: IMAGES */}
                <div className="space-y-3">
                    <CarImageCarousel
                        items={images}
                        itemWidth={360}
                        renderItem={(img) => (
                            <div className="h-72 mt-4 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                                <img
                                    src={BACKEND_BASE_URL + img.url}
                                    alt="Car"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    />

                    {/* MOBILE PRICE (visible only on small screens) */}
                    <div className="lg:hidden flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                        <span className="text-sm text-gray-500">Price / day</span>
                        <span className="text-xl font-bold">
                            ₹ {car.pricePerDay}
                        </span>
                    </div>
                </div>

                {/* RIGHT: DETAILS */}
                <div className="flex flex-col justify-between">

                    <div className="space-y-4">
                        {/* DESKTOP PRICE */}
                        <div className="hidden lg:flex items-center gap-4">
                            <span className="text-sm text-gray-500">Price per day</span>
                            <span className="text-2xl font-bold">
                                ₹ {car.pricePerDay}
                            </span>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                            {car.description || "No description available"}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <Spec label="Year" value={car.year} />
                            <Spec label="Fuel" value={car.fuelType} />
                            <Spec label="Seats" value={car.seats} />
                            <Spec label="Transmission" value={car.transmission} />
                            <Spec label="Type" value={car.carType} />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

/* Spec card */

function Spec({ label, value }) {
    return (
        <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    );
}
