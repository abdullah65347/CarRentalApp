import React, { useEffect, useState } from 'react'
import api from '../api/apiClient'
import CarCard from '../components/car/carCard'
import { ENDPOINTS } from '../api/endpoints'
import PaginatedList from '../components/ui/PaginatedList'

export default function ListingsPage() {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {
        loadCars(page)
    }, [page])

    async function loadCars(pageNumber) {
        try {
            setLoading(true)
            const res = await api.get(
                `${ENDPOINTS.CARS.LIST}?page=${pageNumber}&size=9`
            )

            setCars(res.data.content)
            setTotalPages(res.data.totalPages)
        } catch (err) {
            console.log("ERROR:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Available Cars</h1>

            {loading && <p>Loading cars...</p>}

            {!loading && cars.length === 0 && (
                <p>No cars available.</p>
            )}

            {!loading && cars.length > 0 && (
                <PaginatedList
                    data={cars}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    renderItem={(car) => (
                        <CarCard key={car.id} car={car} />
                    )}
                />
            )}
        </div>
    )
}
