import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import CarCardCarousel from "../components/car/carImageCarousel";
import carInstructions from "../assets/images/car-instructions.png";


export default function HomePage() {
    const [cars, setCars] = useState([]);
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
        <div className="space-y-12">
            {/* HERO SECTION */}
            <section className="bg-white rounded shadow p-8 flex flex-col md:flex-row items-center justify-between gap-6">
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
            </section>

            {/* FEATURED CARS */}
            <section className="w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Featured Cars</h2>
                    <Link to="/cars" className="text-blue-600 text-sm">View all</Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-gray-500">No cars available right now</div>
                ) : (
                    <CarCardCarousel cars={cars} />
                )}
            </section>

            <section className="bg-white rounded shadow p-8">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    How It Works
                </h2>

                <div className="flex justify-center">
                    <img
                        src={carInstructions}
                        alt="Car booking instructions"
                        className="max-w-full md:max-w-3xl w-full object-contain rounded-lg"
                    />
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded shadow p-4">
                    <div className="font-semibold mb-1">Easy Booking</div>
                    <p className="text-sm text-gray-600">
                        Book cars in just a few steps with clear pricing.
                    </p>
                </div>

                <div className="bg-white rounded shadow p-4">
                    <div className="font-semibold mb-1">Flexible Locations</div>
                    <p className="text-sm text-gray-600">
                        Choose convenient pickup and drop-off locations.
                    </p>
                </div>

                <div className="bg-white rounded shadow p-4">
                    <div className="font-semibold mb-1">Secure & Reliable</div>
                    <p className="text-sm text-gray-600">
                        JWT-secured platform with trusted car owners.
                    </p>
                </div>
            </section>
        </div>
    );
}
