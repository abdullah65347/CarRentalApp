import React, { useEffect, useState } from 'react'
import api from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import CarCard from '../components/car/CarCard'

export default function CarListingsPage() {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get(ENDPOINTS.CARS.LIST)
            .then(res => {
                setCars(res.data)
            })
            .catch(err => console.log("ERROR:", err))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Available Cars</h1>

            {loading && <p>Loading cars...</p>}

            {!loading && cars.length === 0 && (
                <p>No cars available.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {cars.map(car => (
                    <CarCard key={car.id} car={car} />
                ))}
            </div>
        </div>
    )
}
