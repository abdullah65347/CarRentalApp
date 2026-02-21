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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Available Cars</h1>

            {!loading && cars.length === 0 && (
                <p>No cars available.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cars.map(car => (
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
        </div>
    )
}
