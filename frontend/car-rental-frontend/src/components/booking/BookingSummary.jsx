import Card from "../ui/Card";

export default function BookingSummary({
    car,
    pickupLocation,
    dropoffLocation,
    startDatetime,
    endDatetime,
    totalPrice,
}) {
    return (
        <Card>
            <h3 className="section-title">Booking Summary</h3>

            <div className="space-y-2 text-sm">
                <div>
                    <strong>Car:</strong> {car.make} {car.model}
                </div>

                <div>
                    <strong>Pickup:</strong> {pickupLocation?.name}
                </div>

                <div>
                    <strong>Dropoff:</strong> {dropoffLocation?.name}
                </div>

                <div>
                    <strong>From:</strong> {startDatetime}
                </div>

                <div>
                    <strong>To:</strong> {endDatetime}
                </div>

                <div className="pt-2 text-lg font-semibold">
                    Total: {totalPrice}
                </div>
            </div>
        </Card>
    );
}
