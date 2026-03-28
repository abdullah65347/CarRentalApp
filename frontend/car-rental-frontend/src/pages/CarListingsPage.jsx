import React, { useEffect, useState } from 'react'
import api from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import CarCard from '../components/car/CarCard'
import Spinner from '../components/ui/Spinner'
import CarDetailModal from '../components/car/CarDetailModal'

export default function CarListingsPage() {
    const [cars, setCars] = useState([])
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("");
    const [type, setType] = useState("ALL");
    const [priceRange, setPriceRange] = useState("ALL");
    const [transmission, setTransmission] = useState("ALL");
    const [seats, setSeats] = useState("ALL");
    const [fuelType, setFuelType] = useState("ALL");
    const [showFilterModal, setShowFilterModal] = useState(false);

    useEffect(() => {
        api.get(ENDPOINTS.CARS.LIST)
            .then(res => {
                setCars(res.data)
            })
            .catch(err => console.log("ERROR:", err))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    const filteredCars = cars.filter((car) => {
        const matchesSearch =
            car.make.toLowerCase().includes(search.toLowerCase()) ||
            car.model.toLowerCase().includes(search.toLowerCase());

        const matchesType =
            type === "ALL" || car.carType === type;

        const matchesTransmission =
            transmission === "ALL" || car.transmission === transmission;

        const matchesSeats =
            seats === "ALL" || car.seats === Number(seats);

        const matchesFuel =
            fuelType === "ALL" || car.fuelType === fuelType;

        let matchesPrice = true;

        if (priceRange !== "ALL") {
            const [min, max] = priceRange.split("-").map(Number);
            matchesPrice =
                car.pricePerDay >= min &&
                car.pricePerDay <= max;
        }

        return (
            matchesSearch &&
            matchesType &&
            matchesTransmission &&
            matchesSeats &&
            matchesFuel &&
            matchesPrice
        );
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl p-6 shadow mb-8 space-y-4">

                {/* TOP ROW */}
                <div className="flex flex-col md:flex-row gap-4 items-center">

                    {/* SEARCH INPUT */}
                    <div className="flex-1 flex items-center border rounded-xl px-4 py-3">
                        <input
                            type="text"
                            placeholder="Search cars..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full outline-none text-sm"
                        />
                    </div>

                    {/* TYPE DROPDOWN */}
                    <div className="relative">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="px-4 py-3 rounded-xl border text-sm bg-gray-50"
                        >
                            <option value="ALL">All Types</option>
                            <option value="SUV">SUV</option>
                            <option value="SEDAN">Sedan</option>
                            <option value="MUV">MUV</option>
                            <option value="HATCHBACK">Hatchback</option>
                        </select>
                    </div>

                    {/* PRICE RANGE SLIDER */}
                    <div className="flex flex-col w-48">
                        <select
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="px-4 py-3 rounded-xl border text-sm bg-gray-50"
                        >
                            <option value="ALL">All Prices</option>
                            <option value="1000-2000">₹1000 - ₹2000</option>
                            <option value="2000-4000">₹2000 - ₹4000</option>
                            <option value="4000-6000">₹4000 - ₹6000</option>
                            <option value="6000-8000">₹6000 - ₹8000</option>
                            <option value="8000-10000">₹8000 - ₹10000</option>
                        </select>
                    </div>

                    {/* FILTER BUTTON */}
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="px-5 py-3 bg-orange-500 text-white rounded-xl"
                    >
                        Filters
                    </button>
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-6">Available Cars</h1>

            {!loading && cars.length === 0 && (
                <p>No cars available.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCars.map(car => (
                    <CarCard
                        key={car.id}
                        car={car}
                        onView={setSelectedCar} />
                ))}
            </div>
            <CarDetailModal
                open={!!selectedCar}
                car={selectedCar}
                onClose={() => setSelectedCar(null)}
            />

            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-10">

                        {/* Header */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold">
                                Filter Cars
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Refine your search to find the perfect ride
                            </p>
                        </div>

                        {/* Filters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Car Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Car Type
                                </label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                >
                                    <option value="ALL">All Types</option>
                                    <option value="SUV">SUV</option>
                                    <option value="SEDAN">Sedan</option>
                                    <option value="MUV">MUV</option>
                                    <option value="HATCHBACK">Hatchback</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Price Range
                                </label>
                                <select
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                >
                                    <option value="ALL">All Prices</option>
                                    <option value="1000-2000">₹1000 - ₹2000</option>
                                    <option value="2000-4000">₹2000 - ₹4000</option>
                                    <option value="4000-6000">₹4000 - ₹6000</option>
                                    <option value="6000-8000">₹6000 - ₹8000</option>
                                    <option value="8000-10000">₹8000 - ₹10000</option>
                                </select>
                            </div>

                            {/* Transmission */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Transmission
                                </label>
                                <select
                                    value={transmission}
                                    onChange={(e) => setTransmission(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                >
                                    <option value="ALL">All</option>
                                    <option value="AUTO">Automatic</option>
                                    <option value="MANUAL">Manual</option>
                                </select>
                            </div>

                            {/* Seats */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Seats
                                </label>
                                <select
                                    value={seats}
                                    onChange={(e) => setSeats(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                >
                                    <option value="ALL">All</option>
                                    <option value="4">4 Seats</option>
                                    <option value="5">5 Seats</option>
                                    <option value="7">7 Seats</option>
                                </select>
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Fuel Type
                                </label>
                                <select
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                                >
                                    <option value="ALL">All</option>
                                    <option value="PETROL">Petrol</option>
                                    <option value="DIESEL">Diesel</option>
                                    <option value="EV">Electric</option>
                                </select>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center mt-10 pt-6 border-t">

                            <button
                                onClick={() => {
                                    setType("ALL");
                                    setPriceRange("ALL");
                                    setTransmission("ALL");
                                    setSeats("ALL");
                                    setFuelType("ALL");
                                }}
                                className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
                            >
                                Reset
                            </button>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="px-8 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
