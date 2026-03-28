import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export default function LocationPicker({
    pickupLocationId,
    dropoffLocationId,
    locations,
    onPickupChange,
    onDropoffChange,
}) {
    const [openPickup, setOpenPickup] = useState(false);
    const [openDropoff, setOpenDropoff] = useState(false);

    const pickupRef = useRef(null);
    const dropoffRef = useRef(null);

    const getLocationName = (id) =>
        locations.find((l) => l.id === id)?.name || "";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickupRef.current &&
                !pickupRef.current.contains(event.target)
            ) {
                setOpenPickup(false);
            }

            if (
                dropoffRef.current &&
                !dropoffRef.current.contains(event.target)
            ) {
                setOpenDropoff(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="rounded-2xl ">
            <div className="flex flex-col md:flex-row gap-4">

                {/* PICKUP */}
                <div ref={pickupRef} className="relative flex-1">
                    <div
                        onClick={() => setOpenPickup(!openPickup)}
                        className="flex items-center justify-between gap-2 px-4 py-3 text-gray-700 bg-white rounded-xl border cursor-pointer hover:border-blue-500 transition"
                    >
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-black" />
                            <span className="text-sm">
                                {pickupLocationId
                                    ? getLocationName(pickupLocationId)
                                    : "Select pickup location"}
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                    </div>

                    {openPickup && (
                        <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg z-[9999] max-h-60 overflow-auto">
                            {locations.map((loc) => (
                                <div
                                    key={loc.id}
                                    onClick={() => {
                                        onPickupChange(loc.id);
                                        setOpenPickup(false);
                                    }}
                                    className="px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition"
                                >
                                    {loc.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DROPOFF */}
                <div ref={dropoffRef} className="relative flex-1">
                    <div
                        onClick={() => setOpenDropoff(!openDropoff)}
                        className="flex items-center justify-between gap-2 px-4 py-3 text-gray-700 bg-white rounded-xl border cursor-pointer hover:border-blue-500 transition"
                    >
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-black" />
                            <span className="text-sm">
                                {dropoffLocationId
                                    ? getLocationName(dropoffLocationId)
                                    : "Select dropoff location"}
                            </span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                    </div>

                    {openDropoff && (
                        <div className="absolute mt-2 w-full bg-white border rounded-xl shadow-lg z-[9999] max-h-60 overflow-auto">
                            {locations.map((loc) => (
                                <div
                                    key={loc.id}
                                    onClick={() => {
                                        onDropoffChange(loc.id);
                                        setOpenDropoff(false);
                                    }}
                                    className="px-4 py-3 text-sm hover:bg-blue-50 cursor-pointer transition"
                                >
                                    {loc.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
