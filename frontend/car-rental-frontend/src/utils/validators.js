export function validateBooking({
    pickupLocationId,
    dropoffLocationId,
    startDatetime,
    endDatetime,
}) {
    if (!pickupLocationId) return "Pickup location is required";
    if (!dropoffLocationId) return "Dropoff location is required";
    if (!startDatetime || !endDatetime) return "Start and end date are required";

    const start = new Date(startDatetime);
    const end = new Date(endDatetime);

    if (start >= end) return "End date must be after start date";

    return null;
}

export function validateCar(car) {
    if (!car.make) return "Make is required";
    if (!car.model) return "Model is required";
    if (!car.pricePerDay || car.pricePerDay <= 0) return "Invalid price";
    if (!car.locationId) return "Location is required";
    if (car.seats > 9) return "Seats must be less than 9"
    return null;
}
