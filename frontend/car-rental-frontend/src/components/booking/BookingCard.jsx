export default function BookingCard({
    booking,
    showUser = false,
    actions = null,
}) {
    function formatDateTime(value) {
        return value ? new Date(value).toLocaleString() : "—";
    }

    function statusBadge(status) {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    }

    return (
        <div className="bg-white border rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition flex justify-between">
            {/* LEFT */}
            <div className="space-y-1 text-sm text-gray-700">
                <div className="text-lg font-semibold text-gray-900">
                    {booking.car?.make} {booking.car?.model}
                    <span className="ml-2 text-sm text-gray-500">
                        ({booking.car?.plateNumber})
                    </span>
                </div>

                {showUser && booking.user && (
                    <div>
                        <span className="font-medium">User:</span>{" "}
                        {booking.user.name}
                        <span className="text-gray-500">
                            {booking.user.email === null ? " " : " - " + booking.user.email}
                        </span>
                    </div>
                )}

                <div>
                    <span className="font-medium">Booking ID:</span>{" "}
                    {booking.id}
                </div>

                <div className="flex gap-6">
                    <div>
                        <span className="font-medium">From:</span>{" "}
                        {formatDateTime(booking.startDatetime)}
                    </div>
                    <div>
                        <span className="font-medium">To:</span>{" "}
                        {formatDateTime(booking.endDatetime)}
                    </div>
                </div>

                <div>
                    <span className="font-medium">Total Price:</span>{" "}
                    ₹{booking.totalPrice}
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end justify-between">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                        booking.status
                    )}`}
                >
                    {booking.status}
                </span>

                {actions}
            </div>
        </div>
    );
}
