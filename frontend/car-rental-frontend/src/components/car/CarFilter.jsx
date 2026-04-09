import React, { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Calendar } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import DateRangePicker from "../booking/DateRangePicker";

const CHIP_LABELS = {
    ALL: "Any",
    AUTO: "Automatic",
    MANUAL: "Manual",
    "4": "4 Seats",
    "5": "5 Seats",
    "7": "7 Seats",
    PETROL: "Petrol",
    DIESEL: "Diesel",
    EV: "Electric",
};

const TRANSMISSIONS = ["ALL", "AUTO", "MANUAL"];
const SEATS = ["ALL", "4", "5", "7"];
const FUELS = ["ALL", "PETROL", "DIESEL", "EV"];

function Chip({ selected, children, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm transition border
        ${selected
                    ? "bg-indigo-50 border-indigo-500 text-indigo-600 font-medium"
                    : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300"
                }`}
        >
            {children}
        </button>
    );
}

export default function CarFilter({
    search, setSearch,
    type, setType,
    priceRange, setPriceRange,
    transmission, setTransmission,
    seats, setSeats,
    fuelType, setFuelType,
    showFilterModal, setShowFilterModal,
    pickupDate,
    dropoffDate,
    setPickupDate,
    setDropoffDate
}) {

    const [localTransmission, setLocalTransmission] = useState(transmission);
    const [localSeats, setLocalSeats] = useState(seats);
    const [localFuel, setLocalFuel] = useState(fuelType);
    const [openPicker, setOpenPicker] = useState(null);

    const activeFilters = [
        localTransmission !== "ALL",
        localSeats !== "ALL",
        localFuel !== "ALL",
    ].filter(Boolean).length;

    const apply = () => {
        setTransmission(localTransmission);
        setSeats(localSeats);
        setFuelType(localFuel);
        setShowFilterModal(false);
    };

    const reset = () => {
        setLocalTransmission("ALL");
        setLocalSeats("ALL");
        setLocalFuel("ALL");
        setPickupDate("");
        setDropoffDate("");
    };

    function formatDate(value) {
        if (!value) return "";
        return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <>
            {/* TOP BAR */}
            <div className="bg-white border border-gray-200 rounded-[20px] p-5 shadow-sm mb-7">

                <div className="flex flex-wrap gap-3 items-center">

                    {/* SEARCH */}
                    <div className="flex-1 min-w-[200px] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by model, brand..."
                            className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white"
                        />
                    </div>

                    {/* DATE PICKER UI */}
                    <div className="flex flex-col md:flex-row gap-3 relative">

                        {/* PICKUP */}
                        <div
                            onClick={() => setOpenPicker("PICKUP")}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-pointer min-w-[180px]"
                        >
                            <Calendar className="h-4 w-4 text-black" />
                            <input
                                readOnly
                                value={formatDate(pickupDate)}
                                placeholder="Pick-up date"
                                className="bg-transparent text-sm outline-none w-full cursor-pointer"
                            />
                        </div>

                        {/* DROPOFF */}
                        <div
                            onClick={() => setOpenPicker("RETURN")}
                            className="flex items-center gap-2 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-pointer min-w-[180px]"
                        >
                            <Calendar className="h-4 w-4 text-black" />
                            <input
                                readOnly
                                value={formatDate(dropoffDate)}
                                placeholder="Drop-off date"
                                className="bg-transparent text-sm outline-none w-full cursor-pointer"
                            />
                        </div>

                        {/* DATE RANGE PICKER */}
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

                    {/* TYPE */}
                    <div className="relative">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className={`appearance-none bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 pr-8 text-sm cursor-pointer
                ${type !== "ALL" ? "border-indigo-500 text-indigo-600" : ""}
              `}
                        >
                            <option value="ALL">All Types</option>
                            <option value="SUV">SUV</option>
                            <option value="SEDAN">Sedan</option>
                            <option value="MUV">MUV</option>
                            <option value="HATCHBACK">Hatchback</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {/* PRICE */}
                    <div className="relative">
                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className={`appearance-none bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 pr-8 text-sm cursor-pointer
                ${priceRange !== "ALL" ? "border-indigo-500 text-indigo-600" : ""}
              `}
                        >
                            <option value="ALL">Any Price</option>
                            <option value="1000-2000">₹1,000 – ₹2,000</option>
                            <option value="2000-4000">₹2,000 – ₹4,000</option>
                            <option value="4000-6000">₹4,000 – ₹6,000</option>
                            <option value="6000-8000">₹6,000 – ₹8,000</option>
                            <option value="8000-10000">₹8,000 – ₹10,000</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {/* FILTER BUTTON */}
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-3 rounded-xl transition"
                    >
                        Filters
                        {activeFilters > 0 && (
                            <span className="bg-white text-indigo-500 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                {activeFilters}
                            </span>
                        )}
                    </button>

                </div>
            </div>

            {/* MODAL */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md shadow-xl">

                        {/* HEADER */}
                        <div className="flex justify-between items-center px-6 py-5 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Advanced Filters
                            </h2>
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="p-2 rounded-md bg-gray-100 hover:bg-indigo-50"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-5">

                            {/* Transmission */}
                            <div>
                                <p className="text-xs uppercase text-gray-400 mb-2 font-semibold">
                                    Transmission
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {TRANSMISSIONS.map(opt => (
                                        <Chip
                                            key={opt}
                                            selected={localTransmission === opt}
                                            onClick={() => setLocalTransmission(opt)}
                                        >
                                            {CHIP_LABELS[opt]}
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                            {/* Seats */}
                            <div>
                                <p className="text-xs uppercase text-gray-400 mb-2 font-semibold">
                                    Seating Capacity
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {SEATS.map(opt => (
                                        <Chip
                                            key={opt}
                                            selected={localSeats === opt}
                                            onClick={() => setLocalSeats(opt)}
                                        >
                                            {CHIP_LABELS[opt]}
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                            {/* Fuel */}
                            <div>
                                <p className="text-xs uppercase text-gray-400 mb-2 font-semibold">
                                    Fuel Type
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {FUELS.map(opt => (
                                        <Chip
                                            key={opt}
                                            selected={localFuel === opt}
                                            onClick={() => setLocalFuel(opt)}
                                        >
                                            {CHIP_LABELS[opt]}
                                        </Chip>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end gap-3 px-6 py-4 border-t">

                            <button
                                onClick={reset}
                                className="px-4 py-2 border rounded-xl text-gray-500 hover:bg-gray-100"
                            >
                                Reset
                            </button>

                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="px-4 py-2 border rounded-xl hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={apply}
                                className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl"
                            >
                                Apply
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}