import { useEffect, useState } from "react";
import api from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";
import CarDetailModal from "../components/car/CarDetailModal";
import HeroSection from "../components/Home/HeroSection";
import FeaturedSection from "../components/Home/FeaturedSection";
import HowItWorks from "../components/Home/HowItWorks";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import Testimonials from "../components/Home/Testimonials";
import CTABanner from "../components/Home/Ctabanner";

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

                <FeaturedSection
                    cars={cars}
                    loading={loading}
                    setSelectedCar={setSelectedCar}
                />

                <HowItWorks />
                <WhyChooseUs />
                <Testimonials />
                <CTABanner />
            </div>

            <CarDetailModal
                open={!!selectedCar}
                car={selectedCar}
                onClose={() => setSelectedCar(null)}
            />
        </>
    );
}
