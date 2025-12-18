// src/components/booking/LocationPicker.jsx

export default function LocationPicker({
    pickupLocationId,
    dropoffLocationId,
    locations,
    onPickupChange,
    onDropoffChange,
}) {
    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PICKUP */}
                <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                        Pick up location
                    </div>

                    <select
                        value={pickupLocationId}
                        onChange={(e) => onPickupChange(e.target.value)}
                        className="
                            w-full rounded-xl border px-4 py-3
                            bg-gray-50 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                        "
                    >
                        <option value="">Select pickup location</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* DROPOFF */}
                <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                        Drop off location
                    </div>

                    <select
                        value={dropoffLocationId}
                        onChange={(e) => onDropoffChange(e.target.value)}
                        className="
                            w-full rounded-xl border px-4 py-3
                            bg-gray-50 text-sm
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                        "
                    >
                        <option value="">Select dropoff location</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
