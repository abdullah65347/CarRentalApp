import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import ManageCar from "./ManageCar";


export default function OwnerDashboard() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        loadCars();
    }, []);

    async function loadCars() {
        try {
            setLoading(true);
            const res = await api.get(ENDPOINTS.CARS.MY);
            setCars(res.data.content);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Owner Dashboard</h1>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="text-sm text-gray-500">Total Cars</div>
                    <div className="text-2xl font-semibold">{cars.length}</div>
                </Card>

                <Card>
                    <div className="text-sm text-gray-500">Active Cars</div>
                    <div className="text-2xl font-semibold">
                        {cars.filter(c => c.status === "ACTIVE").length}
                    </div>
                </Card>
            </div>

            {/* CAR LIST */}
            <Card>
                <h2 className="section-title">My Cars</h2>

                {cars.length === 0 && (
                    <div className="text-gray-500">No cars added yet</div>
                )}

                <div className="divide-y">
                    {cars.map(car => (
                        <div
                            key={car.id}
                            className="py-3 flex items-center justify-between"
                        >
                            <div>
                                <div className="font-medium">
                                    {car.make} {car.model}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {car.pricePerDay} / day • {car.status}
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                onClick={() => setSelectedCar(car)}
                            >
                                Manage
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* MANAGE MODAL */}
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
