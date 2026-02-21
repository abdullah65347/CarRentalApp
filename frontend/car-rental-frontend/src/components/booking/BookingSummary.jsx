import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Users, Fuel, Gauge } from "lucide-react";

export default function BookingSummary({
    car,
    carImage,
    pickupLocation,
    dropoffLocation,
    startDate,
    endDate,
    rentalDays,
    totalPrice,
    onConfirm,
    loading,
}) {
    const isDisabled =
        !pickupLocation ||
        !dropoffLocation ||
        !startDate ||
        !endDate ||
        totalPrice <= 0;

    const navigate = useNavigate();

    return (
        <aside className="space-y-6">

            {/* ================= CAR PREVIEW ================= */}



            {/* ================= BOOKING DETAILS ================= */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-md p-6"
            >
                <h3 className="text-lg font-semibold mb-4">
                    Booking Details
                </h3>

                <div className="space-y-3 text-sm">

                    <div className="flex justify-between">
                        <span className="text-gray-500">Pickup</span>
                        <span className="font-medium">
                            {pickupLocation?.name || "-"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Dropoff</span>
                        <span className="font-medium">
                            {dropoffLocation?.name || "-"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">From</span>
                        <span className="font-medium">{startDate || "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">To</span>
                        <span className="font-medium">{endDate || "-"}</span>
                    </div>

                </div>
            </motion.div>


            {/* ================= PRICE BREAKDOWN ================= */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl shadow-md p-6"
            >
                <h3 className="text-lg font-semibold mb-4">
                    Price Breakdown
                </h3>

                <div className="space-y-2 text-sm">

                    <div className="flex justify-between text-gray-600">
                        <span>Daily Price</span>
                        <span>₹{car?.pricePerDay || 0}</span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                        <span>Rental Days</span>
                        <span>{rentalDays || 0}</span>
                    </div>

                    <div className="border-t pt-4 mt-4 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>

                </div>
            </motion.div>


            {/* ================= CONFIRM BUTTON ================= */}
            <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                onClick={onConfirm}
                disabled={isDisabled || loading}
                className={`w-full py-4 rounded-2xl font-semibold text-white transition ${isDisabled || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-xl"
                    }`}
            >
                {loading ? "Processing..." : "Confirm Booking"}
            </motion.button>

        </aside>
    );
}
