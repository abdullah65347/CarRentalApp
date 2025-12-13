import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { useToast } from "../../context/ToastContext";

export default function ManageAllCars({ cars, reload }) {
    const toast = useToast();

    async function toggleStatus(car) {
        const newStatus = car.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

        if (!window.confirm(`Set car to ${newStatus}?`)) return;

        await api.put(ENDPOINTS.CARS.BY_ID(car.id), {
            ...car,
            status: newStatus,
        });

        toast.show("Car updated");
        reload();
    }

    return (
        <div className="divide-y">
            {cars.map(car => (
                <div key={car.id} className="py-3 flex justify-between">
                    <div>
                        <div className="font-medium">
                            {car.make} {car.model}
                        </div>
                        <div className="text-sm text-gray-600">
                            {car.pricePerDay} / day • {car.status}
                        </div>
                    </div>

                    <button
                        onClick={() => toggleStatus(car)}
                        className="text-blue-600"
                    >
                        Toggle
                    </button>
                </div>
            ))}
        </div>
    );
}
