import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { BACKEND_BASE_URL } from "../../config/env";
import { validateBooking } from "../../utils/validators";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../../components/location/LocationPicker";
import DateHeader from "../../components/booking/DateHeader";
import DateRangePicker from "../../components/booking/DateRangePicker";
import BookingSummary from "../../components/booking/BookingSummary";
import { Users, Settings2, Zap, Car } from "lucide-react";

export default function BookingCheckout({ car, locations }) {
    const toast = useToast();

    const [pickupLocationId, setPickupLocationId] = useState("");
    const [dropoffLocationId, setDropoffLocationId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openPicker, setOpenPicker] = useState(null);
    const [loading, setLoading] = useState(false);
    const [carImage, setCarImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!car?.id) return;
        api.get(ENDPOINTS.CARIMAGES.IMAGES(car.id))
            .then(res => {
                const primary = res.data.find(img => img.isPrimary);
                if (primary) setCarImage(BACKEND_BASE_URL + primary.url);
            })
            .catch(() => { });
    }, [car?.id]);

    const pickupLocation = locations.find(l => l.id === pickupLocationId);
    const dropoffLocation = locations.find(l => l.id === dropoffLocationId);

    const rentalDays = useMemo(() => {
        if (!startDate || !endDate) return 0;
        return Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    }, [startDate, endDate]);

    const totalPrice = useMemo(() => {
        if (rentalDays <= 0) return 0;
        return rentalDays * car.pricePerDay;
    }, [rentalDays, car.pricePerDay]);

    function toOffsetDateTime(value) {
        if (!value) return null;
        return new Date(value).toISOString();
    }

    async function confirmBooking() {
        const error = validateBooking({ pickupLocationId, dropoffLocationId, startDatetime: startDate, endDatetime: endDate });
        if (error) { toast.show(error); return; }

        try {
            setLoading(true);
            const availabilityRes = await api.get(ENDPOINTS.AVAILABILITY.CHECK, {
                params: { carId: car.id, start: toOffsetDateTime(startDate), end: toOffsetDateTime(endDate) }
            });
            if (!availabilityRes.data) { toast.show("Car is not available for selected time"); return; }
            await api.post(ENDPOINTS.BOOKINGS.CREATE, {
                carId: car.id, pickupLocationId, dropoffLocationId,
                startDatetime: toOffsetDateTime(startDate), endDatetime: toOffsetDateTime(endDate),
            });
            toast.show("Booking created successfully");
            navigate("/me/bookings");
        } catch (e) {
            toast.show(e.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    }

    function formatDateTime(value) {
        if (!value) return "-";
        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true,
        });
    }

    const specs = [
        { icon: <Users size={14} />, label: `${car?.seats} Seats` },
        { icon: <Car size={14} />, label: car?.carType },
        { icon: <Settings2 size={14} />, label: car?.transmission },
        { icon: <Zap size={14} />, label: car?.fuelType || "Petrol" },
    ];

    return (
        <div className="min-h-screen relative" style={{ backgroundColor: "#f8f9fc" }}>

            {/* Decorative top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500" />

            {/* Subtle grid/dot texture overlay */}
            <div
                className="pointer-events-none fixed inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            {/* Top accent blob */}
            <div
                className="pointer-events-none fixed top-0 left-0 w-[600px] h-[400px] opacity-[0.07]"
                style={{
                    background: "radial-gradient(ellipse at top left, #6366f1, transparent 70%)",
                }}
            />
            <div
                className="pointer-events-none fixed bottom-0 right-0 w-[500px] h-[400px] opacity-[0.06]"
                style={{
                    background: "radial-gradient(ellipse at bottom right, #3b82f6, transparent 70%)",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                {/* HEADING */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Complete Your Booking</h1>
                    <p className="text-gray-400 mt-1.5 text-sm">Select your pickup location and travel dates to confirm</p>
                </motion.div>

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT */}
                    <div className="lg:col-span-8 space-y-5">

                        {/* CAR HERO CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row">

                                {/* IMAGE */}
                                <div className="md:w-1/2 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 flex items-center justify-center ">

                                    <img
                                        src={carImage || "/car-placeholder.png"}
                                        alt={car?.make}
                                        className="w-full h-full object-cover scale md:scale-135 transition duration-500"
                                    />
                                </div>

                                {/* CONTENT */}
                                <div className="md:w-1/2 p-8 flex flex-col justify-between">

                                    {/* Top: Title + Price */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
                                                {car?.make} {car?.model}
                                            </h2>

                                            <p className="text-gray-400 text-sm mt-1">
                                                {car?.year || "2024"} · {car?.color || "Available Now"}
                                            </p>
                                        </div>

                                    </div>
                                    {/* Price moved here */}
                                    <div className="bg-gray-50 border w-44 border-gray-100 rounded-xl px-4 py-1.5 my-4">
                                        <span>Price : </span>
                                        <span className="text-indigo-600 font-semibold text-lg">
                                            ₹{car?.pricePerDay}
                                        </span>
                                        <span className="text-gray-400 text-m"> / day</span>
                                    </div>

                                    {/* Specs */}
                                    <div className="flex flex-wrap gap-3">
                                        {specs.map((s, i) => (
                                            <span
                                                key={i}
                                                className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl"
                                            >
                                                <span className="text-indigo-500 text-base">
                                                    {s.icon}
                                                </span>
                                                {s.label}
                                            </span>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </motion.div>

                        {/* LOCATION CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-semibold text-gray-900">Pickup & Dropoff</h2>
                            </div>
                            <LocationPicker
                                pickupLocationId={pickupLocationId}
                                dropoffLocationId={dropoffLocationId}
                                locations={locations}
                                onPickupChange={setPickupLocationId}
                                onDropoffChange={setDropoffLocationId}
                            />
                        </motion.div>

                        {/* DATE CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                        >
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-semibold text-gray-900">Travel Dates</h2>
                            </div>

                            <DateHeader
                                pickupDate={startDate}
                                returnDate={endDate}
                                onOpen={setOpenPicker}
                            />

                            <AnimatePresence>
                                {openPicker && (
                                    <DateRangePicker
                                        title={openPicker === "PICKUP" ? "Pick-up date" : "Return date"}
                                        value={openPicker === "PICKUP" ? startDate : endDate}
                                        minDate={openPicker === "RETURN" ? startDate : null}
                                        onSave={(val) => {
                                            if (openPicker === "PICKUP") {
                                                setStartDate(val);
                                                setOpenPicker("RETURN");
                                            } else {
                                                setEndDate(val);
                                                setOpenPicker(null);
                                            }
                                        }}
                                        onClose={() => setOpenPicker(null)}
                                    />
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* RIGHT SUMMARY */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <BookingSummary
                                car={car}
                                pickupLocation={pickupLocation}
                                dropoffLocation={dropoffLocation}
                                startDate={formatDateTime(startDate)}
                                endDate={formatDateTime(endDate)}
                                rentalDays={rentalDays}
                                totalPrice={totalPrice}
                                onConfirm={confirmBooking}
                                loading={loading}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}