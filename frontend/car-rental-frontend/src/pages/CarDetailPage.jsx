import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/apiClient'


export default function CarDetailPage() {
    const { id } = useParams()
    const [car, setCar] = useState(null)


    useEffect(() => {
        api.get(`/cars/${id}`).then(res => setCar(res.data)).catch(() => setCar(null))
    }, [id])

    if (!car) return <div>Loading...</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
                <div className="bg-white rounded shadow p-4">Image carousel placeholder</div>
                <div className="mt-4 bg-white rounded shadow p-4">
                    <h2 className="text-xl font-semibold">{car.make} {car.model}</h2>
                    <p className="text-gray-600">{car.description}</p>
                </div>
            </div>
            <aside className="bg-white rounded shadow p-4">
                <div className="text-2xl font-bold">₹{car.pricePerDay} / day</div>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Book Now</button>
            </aside>
        </div>
    )
}