import { Link } from "react-router-dom";

export default function CarCard({ car }) {
    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition">
            <div className="mb-3">
                <h2 className="text-lg font-semibold">
                    {car.make} {car.model}
                </h2>
                <p className="text-sm text-gray-500">{car.year}</p>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
                <p>Type: <span className="font-medium">{car.carType}</span></p>
                <p>Transmission: <span className="font-medium">{car.transmission}</span></p>
                <p>Fuel: <span className="font-medium">{car.fuelType}</span></p>
                <p>Seats: <span className="font-medium">{car.seats}</span></p>
            </div>

            <div className="mt-3">
                <p className="text-xl font-bold text-blue-600">
                    ₹{car.pricePerDay}
                    <span className="text-sm text-gray-500"> / day</span>
                </p>
            </div>

            <Link to={`/cars/${car.id}`}>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                    View Details
                </button>
            </Link>
        </div>
    )
}
