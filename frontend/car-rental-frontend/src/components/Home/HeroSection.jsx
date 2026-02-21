import { Search, MapPin, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { heroCar } from "../../assets/assets";
import Button from "../ui/Button";
import DateRangePicker from "../booking/DateRangePicker";
import { useState } from "react";

export default function HeroSection() {
    const [pickupLocation, setPickupLocation] = useState("");
    const [dropoffLocation, setDropoffLocation] = useState("");
    const [pickupDate, setPickupDate] = useState("");
    const [dropoffDate, setDropoffDate] = useState("");
    const [openPicker, setOpenPicker] = useState(null);

    function formatDate(value) {
        if (!value) return "";
        return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }
    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={heroCar}
                    alt="Luxury car at golden hour"
                    className="w-full h-full object-cover"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, rgba(17,24,39,0.8), rgba(17,24,39,0.5), transparent)",
                    }}
                />
            </div>

            {/* Content */}
            <div className="container px-6 md:px-10 lg:px-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mt-14 md:mt-0"
                >
                    <h1 className="text-4xl md:text-6xl font-bold font-display text-white leading-tight mb-4">
                        Find Your Perfect
                        <span className="block text-yellow-500">Ride Today</span>
                    </h1>
                    <p className="text-lg text-gray-300 mb-8 max-w-lg">
                        Discover premium cars from trusted owners. Book instantly and hit the road with confidence.
                    </p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="bg-gray-100 rounded-2xl p-3 shadow-lg flex flex-col gap-3"
                    >
                        {/* LOCATION ROW */}
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex items-center gap-2 px-4 py-3 flex-1 bg-white rounded-xl">
                                <MapPin className="h-4 w-4 text-black" />
                                <input
                                    type="text"
                                    placeholder="Pick-up location"
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    className="bg-transparent text-sm outline-none w-full"
                                />
                            </div>

                            <div className="flex items-center gap-2 px-4 py-3 flex-1 bg-white rounded-xl">
                                <MapPin className="h-4 w-4 text-black" />
                                <input
                                    type="text"
                                    placeholder="Drop-off location"
                                    value={dropoffLocation}
                                    onChange={(e) => setDropoffLocation(e.target.value)}
                                    className="bg-transparent text-sm outline-none w-full"
                                />
                            </div>
                        </div>

                        {/* DATE ROW */}
                        <div className="flex flex-col md:flex-row gap-3 relative">
                            <div
                                onClick={() => setOpenPicker("PICKUP")}
                                className="flex items-center gap-2 px-4 py-3 flex-1 bg-white rounded-xl cursor-pointer"
                            >
                                <Calendar className="h-4 w-4 text-black" />
                                <input
                                    readOnly
                                    value={formatDate(pickupDate)}
                                    placeholder="Pick-up date"
                                    className="bg-transparent text-sm outline-none w-full cursor-pointer"
                                />
                            </div>

                            <div
                                onClick={() => setOpenPicker("RETURN")}
                                className="flex items-center gap-2 px-4 py-3 flex-1 bg-white rounded-xl cursor-pointer"
                            >
                                <Calendar className="h-4 w-4 text-black" />
                                <input
                                    readOnly
                                    value={formatDate(dropoffDate)}
                                    placeholder="Drop-off date"
                                    className="bg-transparent text-sm outline-none w-full cursor-pointer"
                                />
                            </div>

                            {/* DATE PICKER */}
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
                                                ? pickupDate
                                                : dropoffDate
                                        }
                                        minDate={
                                            openPicker === "RETURN"
                                                ? pickupDate
                                                : null
                                        }
                                        onSave={(val) => {
                                            if (openPicker === "PICKUP") {
                                                setPickupDate(val);
                                                setOpenPicker("RETURN");
                                            } else {
                                                setDropoffDate(val);
                                                setOpenPicker(null);
                                            }
                                        }}
                                        onClose={() => setOpenPicker(null)}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* BUTTON */}
                        <Button size="lg" className="btn-dark-gradient rounded-xl">
                            <Search className="h-4 w-4" />
                            Search
                        </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex gap-8 mt-10"
                    >
                        {[
                            { value: "500+", label: "Cars Available" },
                            { value: "10K+", label: "Happy Customers" },
                            { value: "50+", label: "Locations" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-2xl lg:text-3xl font-bold font-display text-gray-200">{stat.value}</p>
                                <p className="text-xs lg:text-sm text-yellow-100">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
