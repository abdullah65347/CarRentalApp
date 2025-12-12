import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <div>
            <section className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Find your next ride</h1>
                <p className="text-gray-600">Search and book cars quickly.</p>
            </section>


            <section>
                <h2 className="text-2xl font-semibold mb-4">Featured cars</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded shadow">Example Car Card — replace with API data</div>
                    <div className="p-4 bg-white rounded shadow">Example Car Card</div>
                    <div className="p-4 bg-white rounded shadow">Example Car Card</div>
                </div>
                <div className="mt-6">
                    <Link to="/cars" className="text-blue-600">Browse all cars</Link>
                </div>
            </section>
        </div>
    )
}