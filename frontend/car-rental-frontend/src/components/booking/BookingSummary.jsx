import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight, Shield, Clock } from "lucide-react";

export default function BookingSummary({
    car,
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

    return (
        <aside className="space-y-4">


            {/* BOOKING DETAILS */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Booking Details</h3>

                <div className="space-y-3">
                    {/* Pickup */}
                    <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin size={13} className="text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">Pickup</p>
                            <p className="text-sm font-medium text-gray-800 truncate">{pickupLocation?.name || "—"}</p>
                        </div>
                    </div>

                    {/* Connector */}
                    <div className="ml-3.5 w-px h-4 bg-gray-100" />

                    {/* Dropoff */}
                    <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin size={13} className="text-rose-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400 mb-0.5">Dropoff</p>
                            <p className="text-sm font-medium text-gray-800 truncate">{dropoffLocation?.name || "—"}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-50 my-1" />

                    {/* Dates */}
                    <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Calendar size={13} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-400 mb-1">Travel Period</p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                                    {startDate !== "-" ? startDate : "Not set"}
                                </span>
                                <ArrowRight size={11} className="text-gray-300 flex-shrink-0" />
                                <span className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">
                                    {endDate !== "-" ? endDate : "Not set"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {rentalDays > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                                <Clock size={13} className="text-violet-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Duration</p>
                                <p className="text-sm font-medium text-gray-800">{rentalDays} {rentalDays === 1 ? "day" : "days"}</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* PRICE BREAKDOWN */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Price Breakdown</h3>

                <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Daily Rate</span>
                        <span className="font-medium text-gray-700">₹{car?.pricePerDay || 0}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Duration</span>
                        <span className="font-medium text-gray-700">{rentalDays || 0} day{rentalDays !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Taxes & Fees</span>
                        <span className="font-medium text-emerald-600 text-xs">Included</span>
                    </div>
                </div>

                {/* Total */}
                <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 px-4 py-3 flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Total Amount</span>
                    <span className="text-xl font-bold text-indigo-700">₹{totalPrice || 0}</span>
                </div>
            </motion.div>

            {/* TRUST BADGE */}
            <div className="flex items-center gap-2 px-1">
                <Shield size={13} className="text-gray-300 flex-shrink-0" />
                <p className="text-xs text-gray-400">Secure booking · Free cancellation within 24h</p>
            </div>

            {/* CONFIRM BUTTON */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                whileHover={!isDisabled && !loading ? { scale: 1.01, y: -1 } : {}}
                onClick={onConfirm}
                disabled={isDisabled || loading}
                className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${isDisabled || loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-200"
                    }`}
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Confirm Booking
                        <ArrowRight size={15} />
                    </>
                )}
            </motion.button>

        </aside>
    );
}