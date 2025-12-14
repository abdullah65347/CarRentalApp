export default function DateHeader({
    pickupDate,
    returnDate,
    onOpen,
}) {
    function format(val) {
        if (!val) return "Select date & time";
        return new Date(val).toLocaleString();
    }

    return (
        <div className="flex gap-6 bg-white p-4 rounded-xl shadow">
            {/* PICKUP */}
            <button
                onClick={() => onOpen("PICKUP")}
                className="flex-1 text-left border rounded-xl p-3 hover:bg-gray-50"
            >
                <div className="font-semibold text-indigo-700">
                    Pick-Up Date
                </div>
                <div className="text-sm text-gray-500">
                    {format(pickupDate)}
                </div>
            </button>

            {/* RETURN */}
            <button
                onClick={() => onOpen("RETURN")}
                className="flex-1 text-left border rounded-xl p-3 hover:bg-gray-50"
            >
                <div className="font-semibold text-indigo-700">
                    Return Date
                </div>
                <div className="text-sm text-gray-500">
                    {format(returnDate)}
                </div>
            </button>
        </div>
    );
}
