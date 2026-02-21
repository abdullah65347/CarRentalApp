import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import CarImageCarousel from "../components/car/carImageCarousel";
import CarCard from "../components/car/CarCard";
import CarDetailModal from "../components/car/CarDetailModal";
import carInstructions from "../assets/images/car-instructions2.png";
import HeroSection from "../components/Home/HeroSection";
import FeaturedSection from "../components/Home/FeaturedSection";
import HowItWorks from "../components/Home/HowItWorks";

export default function HomePage() {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFeaturedCars() {
            try {
                const res = await api.get(ENDPOINTS.CARS.LIST);
                setCars((res.data || []).slice(0, 10));
            } catch {
                setCars([]);
            } finally {
                setLoading(false);
            }
        }
        loadFeaturedCars();
    }, []);

    return (
        <>
            <div className="space-y-12">
                <HeroSection />
                {/* HERO SECTION */}
                {/* <section className="bg-white rounded shadow p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Find your next ride
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Book reliable cars easily with flexible pickup and drop locations.
                        </p>

                        <div className="flex gap-3">
                            <Link to="/cars">
                                <Button>Browse Cars</Button>
                            </Link>
                            <Link to="/me/bookings">
                                <Button variant="secondary">My Bookings</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="text-gray-400 text-sm">
                        Trusted • Secure • Easy to Use
                    </div>
                </section> */}

                {/* FEATURED CARS */}
                <FeaturedSection
                    cars={cars}
                    loading={loading}
                    setSelectedCar={setSelectedCar}
                />

                {/* <section className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Featured Cars</h2>
                        <Link to="/cars" className="text-blue-600 text-sm">
                            View all
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Spinner />
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="text-gray-500">
                            No cars available right now
                        </div>
                    ) : (
                        <CarImageCarousel
                            items={cars}
                            renderItem={(car) => (
                                <CarCard
                                    car={car}
                                    onView={setSelectedCar}
                                />
                            )}
                        />
                    )}
                </section> */}

                {/* HOW IT WORKS */}
                <HowItWorks />
            </div>

            <CarDetailModal
                open={!!selectedCar}
                car={selectedCar}
                onClose={() => setSelectedCar(null)}
            />
        </>
    );
}
