import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import CarCard from "../components/car/CarCard";
import Spinner from "../components/ui/Spinner";
import CarDetailModal from "../components/car/CarDetailModal";
import CarFilter from "../components/car/CarFilter";
import { useLocation } from "react-router-dom";

export default function CarListingPage() {

    // ---------------- STATE ----------------
    const [cars, setCars] = useState([]);
    const [allCars, setAllCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(true);

    const [pickupDate, setPickupDate] = useState("");
    const [dropoffDate, setDropoffDate] = useState("");

    const location = useLocation();

    // filters
    const [search, setSearch] = useState("");
    const [type, setType] = useState("ALL");
    const [priceRange, setPriceRange] = useState("ALL");
    const [transmission, setTransmission] = useState("ALL");
    const [seats, setSeats] = useState("ALL");
    const [fuelType, setFuelType] = useState("ALL");
    const [showFilterModal, setShowFilterModal] = useState(false);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const carsPerPage = 8;

    // ---------------- FETCH ALL CARS ----------------
    useEffect(() => {
        api.get(ENDPOINTS.CARS.LIST)
            .then(res => {
                setAllCars(res.data);
                setCars(res.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // ---------------- GET DATES FROM HERO ----------------
    useEffect(() => {
        if (location.state) {
            setPickupDate(location.state.pickupDate || "");
            setDropoffDate(location.state.dropoffDate || "");
        }
    }, [location.state]);

    // ---------------- AVAILABILITY FILTER (MAIN LOGIC) ----------------
    useEffect(() => {

        // if no dates → show all cars
        if (!pickupDate || !dropoffDate) {
            setCars(allCars);
            return;
        }

        setLoading(true);

        api.get(ENDPOINTS.AVAILABILITY.AVAILABLE_CARS_LIST, {
            params: {
                start: pickupDate,
                end: dropoffDate
            }
        })
            .then(res => {
                const availableIds = res.data;

                const filtered = allCars.filter(car =>
                    availableIds.includes(car.id)
                );

                setCars(filtered);
            })
            .catch(console.error)
            .finally(() => setLoading(false));

    }, [pickupDate, dropoffDate, allCars]);

    // ---------------- UI FILTERS ONLY ----------------
    const filteredCars = cars.filter((car) => {

        const matchesSearch =
            car.make.toLowerCase().includes(search.toLowerCase()) ||
            car.model.toLowerCase().includes(search.toLowerCase());

        const matchesType = type === "ALL" || car.carType === type;
        const matchesTransmission = transmission === "ALL" || car.transmission === transmission;
        const matchesSeats = seats === "ALL" || car.seats === Number(seats);
        const matchesFuel = fuelType === "ALL" || car.fuelType === fuelType;

        let matchesPrice = true;
        if (priceRange !== "ALL") {
            const [min, max] = priceRange.split("-").map(Number);
            matchesPrice = car.pricePerDay >= min && car.pricePerDay <= max;
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

    // ---------------- PAGINATION ----------------
    const indexOfLast = currentPage * carsPerPage;
    const indexOfFirst = indexOfLast - carsPerPage;
    const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredCars.length / carsPerPage);

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    // ---------------- UI ----------------
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <CarFilter
                search={search} setSearch={setSearch}
                type={type} setType={setType}
                priceRange={priceRange} setPriceRange={setPriceRange}
                transmission={transmission} setTransmission={setTransmission}
                seats={seats} setSeats={setSeats}
                fuelType={fuelType} setFuelType={setFuelType}
                showFilterModal={showFilterModal}
                setShowFilterModal={setShowFilterModal}

                pickupDate={pickupDate}
                dropoffDate={dropoffDate}
                setPickupDate={setPickupDate}
                setDropoffDate={setDropoffDate}
            />

            <h1 className="text-2xl font-bold mb-6">Available Cars</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentCars.map(car => (
                    <CarCard key={car.id} car={car} onView={setSelectedCar} />
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-8 gap-2">

                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 border rounded ${currentPage === i + 1
                            ? "bg-indigo-500 text-white"
                            : ""
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <CarDetailModal
                open={!!selectedCar}
                car={selectedCar}
                onClose={() => setSelectedCar(null)}
            />
        </div>
    );
}