import { Calendar } from "lucide-react";

export default function DateHeader({
    pickupDate,
    returnDate,
    onOpen,
}) {
    function format(val) {
        if (!val) return "";
        return new Date(val).toLocaleString();
    }

    return (
        <div className="flex gap-4">

            {/* PICKUP */}
            <button
                onClick={() => onOpen("PICKUP")}
                className="flex items-center gap-3 flex-1 bg-gray-100 px-4 py-3 rounded-xl hover:bg-gray-200 transition"
            >
                <Calendar className="w-5 h-5 text-gray-500" />

                <div className="text-left">
                    <div className="text-sm text-gray-400">
                        Pick-up date
                    </div>
                    {pickupDate && (
                        <div className="text-sm font-medium text-gray-800">
                            {format(pickupDate)}
                        </div>
                    )}
                </div>
            </button>

            {/* RETURN */}
            <button
                onClick={() => onOpen("RETURN")}
                className="flex items-center gap-3 flex-1 bg-gray-100 px-4 py-3 rounded-xl hover:bg-gray-200 transition"
            >
                <Calendar className="w-5 h-5 text-gray-500" />

                <div className="text-left">
                    <div className="text-sm text-gray-400">
                        Drop-off date
                    </div>
                    {returnDate && (
                        <div className="text-sm font-medium text-gray-800">
                            {format(returnDate)}
                        </div>
                    )}
                </div>
            </button>

        </div>
    );
}