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

export default function BookingCheckout({ car, locations }) {
    const toast = useToast();

    /* ================= STATE ================= */
    const [pickupLocationId, setPickupLocationId] = useState("");
    const [dropoffLocationId, setDropoffLocationId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [openPicker, setOpenPicker] = useState(null);
    const [loading, setLoading] = useState(false);
    const [carImage, setCarImage] = useState(null);
    const navigate = useNavigate();

    /* ================= FETCH CAR IMAGE ================= */
    useEffect(() => {
        if (!car?.id) return;

        api.get(ENDPOINTS.CARIMAGES.IMAGES(car.id))
            .then(res => {
                const primary = res.data.find(img => img.isPrimary);
                if (primary) {
                    setCarImage(BACKEND_BASE_URL + primary.url);
                }
            })
            .catch(() => { });
    }, [car?.id]);

    /* ================= DERIVED VALUES ================= */
    const pickupLocation = locations.find(l => l.id === pickupLocationId);
    const dropoffLocation = locations.find(l => l.id === dropoffLocationId);

    const rentalDays = useMemo(() => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }, [startDate, endDate]);

    const totalPrice = useMemo(() => {
        if (rentalDays <= 0) return 0;
        return rentalDays * car.pricePerDay;
    }, [rentalDays, car.pricePerDay]);

    function toOffsetDateTime(value) {
        if (!value) return null;
        return new Date(value).toISOString();
    }

    /* ================= BOOKING LOGIC ================= */
    async function confirmBooking() {
        const error = validateBooking({
            pickupLocationId,
            dropoffLocationId,
            startDatetime: startDate,
            endDatetime: endDate,
        });

        if (error) {
            toast.show(error);
            return;
        }

        try {
            setLoading(true);

            await api.post(ENDPOINTS.BOOKINGS.CREATE, {
                carId: car.id,
                pickupLocationId,
                dropoffLocationId,
                startDatetime: toOffsetDateTime(startDate),
                endDatetime: toOffsetDateTime(endDate),
            });

            toast.show("Booking created successfully");

            // Redirect after success
            navigate("/me/bookings");

        } catch (e) {
            toast.show("Booking failed");
        } finally {
            setLoading(false);
        }
    }

    function formatDateTime(value) {
        if (!value) return "-";

        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    }

    const isDisabled =
        !pickupLocation ||
        !dropoffLocation ||
        !startDate ||
        !endDate ||
        totalPrice <= 0;

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">

                {/* ================= HEADING ================= */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-3xl font-bold">Complete Your Booking</h1>
                    <p className="text-gray-500 mt-2">
                        Choose location and dates to confirm your ride
                    </p>
                </motion.div>

                {/* ================= MAIN GRID ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT SECTION */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* LOCATION */}
                        <div className="bg-white rounded-3xl shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Location
                            </h2>

                            <LocationPicker
                                pickupLocationId={pickupLocationId}
                                dropoffLocationId={dropoffLocationId}
                                locations={locations}
                                onPickupChange={setPickupLocationId}
                                onDropoffChange={setDropoffLocationId}
                            />
                        </div>

                        {/* DATE */}
                        <div className="bg-white rounded-3xl shadow-md p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Date & Time
                            </h2>

                            <DateHeader
                                pickupDate={startDate}
                                returnDate={endDate}
                                onOpen={setOpenPicker}
                            />

                            <AnimatePresence>
                                {openPicker && (
                                    <DateRangePicker
                                        title={
                                            openPicker === "PICKUP"
                                                ? "Pick-up date"
                                                : "Return date"
                                        }
                                        value={
                                            openPicker === "PICKUP"
                                                ? startDate
                                                : endDate
                                        }
                                        minDate={
                                            openPicker === "RETURN"
                                                ? startDate
                                                : null
                                        }
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
                        </div>

                        {/* CAR PREVIEW */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* IMAGE */}
                            <div className="bg-white rounded-3xl shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Car Preview
                                </h2>

                                <img
                                    src={carImage || "/car-placeholder.png"}
                                    alt={car?.make}
                                    className="w-full h-64 object-cover rounded-2xl"
                                />
                            </div>

                            {/* DETAILS */}
                            <div className="bg-white rounded-3xl shadow-md p-6">
                                <h2 className="text-lg font-semibold mb-4">
                                    Car Details
                                </h2>

                                <p className="text-xl font-bold">
                                    {car?.make} {car?.model}
                                </p>

                                <p className="text-gray-500 mt-2">
                                    ₹{car?.pricePerDay} / day
                                </p>

                                <div className="mt-4 space-y-2 text-sm text-gray-600">
                                    <div>Seats: {car?.seats}</div>
                                    <div>Type: {car?.carType}</div>
                                    <div>Transmission: {car?.transmission}</div>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* RIGHT SECTION (SUMMARY) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <BookingSummary
                                car={car}
                                carImage={carImage}
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
