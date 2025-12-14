import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import ManageCar from "./ManageCar";
import AddCar from "../../components/car/AddCar";

export default function OwnerDashboard() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        try {
            setLoading(true);
            const res = await api.get(ENDPOINTS.CARS.MY);
            setCars(res.data);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
            </div>
        );
    }

    const activeCars = cars.filter(c => c.status === "ACTIVE").length;

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Owner Dashboard
                    </h1>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="text-sm text-gray-500">Total Cars</div>
                    <div className="text-3xl font-semibold text-gray-900">
                        {cars.length}
                    </div>
                </Card>

                <Card>
                    <div className="text-sm text-gray-500">Active Cars</div>
                    <div className="text-3xl font-semibold text-green-600">
                        {activeCars}
                    </div>
                </Card>

                <Card>
                    <div className="text-sm text-gray-500">Inactive Cars</div>
                    <div className="text-3xl font-semibold text-red-600">
                        {cars.length - activeCars}
                    </div>
                </Card>
            </div>

            <div>
                <Button onClick={() => setShowAdd(true)} className="flex">
                    <div>+</div>
                    <div>Add Car</div>
                </Button>
            </div>
            {/* CAR LIST */}
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        My Cars
                    </h2>
                </div>

                {cars.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No cars added yet
                    </div>
                ) : (
                    <div className="divide-y">
                        {cars.map(car => (
                            <div
                                key={car.id}
                                className="py-4 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg transition"
                            >
                                {/* LEFT */}
                                <div>
                                    <div className="font-medium text-gray-900">
                                        {car.make} {car.model}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        ₹{car.pricePerDay} / day
                                        <span className="mx-2">•</span>
                                        <span
                                            className={
                                                car.status === "ACTIVE"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }
                                        >
                                            {car.status}
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setSelectedCar(car)}
                                >
                                    Manage
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
            <AddCar
                open={showAdd}
                onClose={() => setShowAdd(false)}
                onSaved={loadCars}
            />

            {/* MANAGE CAR MODAL */}
            {selectedCar && (
                <ManageCar
                    car={selectedCar}
                    onClose={() => setSelectedCar(null)}
                    onSaved={loadCars}
                />
            )}
        </div>
    );
}
