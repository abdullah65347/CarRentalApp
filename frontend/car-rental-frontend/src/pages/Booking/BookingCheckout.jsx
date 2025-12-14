import { useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { validateBooking } from "../../utils/validators";

import BookingSummary from "../../components/booking/BookingSummary";
import Button from "../../components/ui/Button";
import DateHeader from "../../components/booking/DateHeader";
import DateRangePicker from "../../components/booking/DateRangePicker";
import LocationPicker from "../../components/LocationPicker";
import { useToast } from "../../context/ToastContext";

export default function BookingCheckout({ car, locations }) {
    const toast = useToast();

    /* -------------------- STATE -------------------- */
    const [pickupLocationId, setPickupLocationId] = useState("");
    const [dropoffLocationId, setDropoffLocationId] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // null | "PICKUP" | "RETURN"
    const [openPicker, setOpenPicker] = useState(null);

    const [loading, setLoading] = useState(false);

    /* -------------------- HELPERS -------------------- */
    function toOffsetDateTime(value) {
        if (!value) return null;
        return new Date(value).toISOString();
    }

    const pickupLocation = locations.find(l => l.id === pickupLocationId);
    const dropoffLocation = locations.find(l => l.id === dropoffLocationId);

    /* -------------------- BOOKING -------------------- */
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
        } catch (e) {
            toast.show("Booking failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ================= LEFT ================= */}
            <div className="md:col-span-2 space-y-6">
                {/* LOCATION PICKER */}
                <LocationPicker
                    pickupLocationId={pickupLocationId}
                    dropoffLocationId={dropoffLocationId}
                    locations={locations}
                    onPickupChange={setPickupLocationId}
                    onDropoffChange={setDropoffLocationId}
                />

                {/* DATE HEADER */}
                <DateHeader
                    pickupDate={startDate}
                    returnDate={endDate}
                    onOpen={setOpenPicker}
                />

                {/* DATE PICKER */}
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
            </div>

            {/* ================= RIGHT ================= */}
            <div className="space-y-4">
                <BookingSummary
                    car={car}
                    pickupLocation={pickupLocation}
                    dropoffLocation={dropoffLocation}
                    startDatetime={startDate}
                    endDatetime={endDate}
                    totalPrice={car.pricePerDay}
                />

                <Button loading={loading} onClick={confirmBooking}>
                    Confirm Booking
                </Button>
            </div>
        </div>
    );
}
