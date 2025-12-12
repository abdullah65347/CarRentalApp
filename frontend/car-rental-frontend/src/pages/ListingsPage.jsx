import React, { useEffect, useState } from 'react'
import api from '../api/apiClient'
import { Link } from 'react-router-dom'

export default function ListingsPage() {
    const [cars, setCars] = useState([])

    useEffect(() => {
        api.get('/cars').then(res => setCars(res.data)).catch(() => setCars([]))
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Cars</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cars.map(c => (
                    <Link to={`/cars/${c.id}`} key={c.id} className="block p-4 bg-white rounded shadow">
                        <div className="font-semibold">{c.make} {c.model}</div>
                        <div className="text-sm text-gray-600">₹{c.pricePerDay} / day</div>
                    </Link>
                ))}
            </div>
        </div>
    )
}