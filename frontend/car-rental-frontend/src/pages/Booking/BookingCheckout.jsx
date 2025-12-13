import { useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { useToast } from "../../context/ToastContext";
import { validateBooking } from "../../utils/validators";
import Card from "../../components/ui/Card";
import DateRangePicker from "../../components/booking/DateRangePicker";
import BookingSummary from "../../components/booking/BookingSummary";
import Button from "../../components/ui/Button";

export default function BookingCheckout({ car, locations }) {
    const toast = useToast();

    const [pickupLocationId, setPickupLocationId] = useState("");
    const [dropoffLocationId, setDropoffLocationId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);

    function toOffsetDateTime(value) {
        if (!value) return null;
        return new Date(value).toISOString(); // OffsetDateTime compatible
    }

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

    const pickupLocation = locations.find(l => l.id === pickupLocationId);
    const dropoffLocation = locations.find(l => l.id === dropoffLocationId);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="md:col-span-2 space-y-4">
                <Card>
                    <h3 className="section-title">Select Locations</h3>

                    <label className="label">Pickup Location</label>
                    <select
                        value={pickupLocationId}
                        onChange={(e) => setPickupLocationId(e.target.value)}
                        className="input mb-3"
                    >
                        <option value="">Select pickup</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>

                    <label className="label">Dropoff Location</label>
                    <select
                        value={dropoffLocationId}
                        onChange={(e) => setDropoffLocationId(e.target.value)}
                        className="input"
                    >
                        <option value="">Select dropoff</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                </Card>

                <Card>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={setStartDate}
                        onEndChange={setEndDate}
                    />
                </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
                <BookingSummary
                    car={car}
                    pickupLocation={pickupLocation}
                    dropoffLocation={dropoffLocation}
                    startDatetime={startDate}
                    endDatetime={endDate}
                    totalPrice={car.pricePerDay}
                />

                <Button
                    loading={loading}
                    onClick={confirmBooking}
                >
                    Confirm Booking
                </Button>
            </div>
        </div>
    );
}
