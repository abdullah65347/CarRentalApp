import { useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import AddCar from "../../components/car/AddCar";

export default function ManageAllCars({ cars, reload }) {
    const { show } = useToast();

    const [selectedCar, setSelectedCar] = useState(null);
    const [newStatus, setNewStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    async function loadCars() {
        try {
            setLoading(true);
            const res = await api.get(ENDPOINTS.CARS.MY);
            setCars(res.data);
        } finally {
            setLoading(false);
        }
    }

    function statusBadge(status) {
        return status === "ACTIVE"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700";
    }

    function openConfirm(car, status) {
        setSelectedCar(car);
        setNewStatus(status);
    }

    function closeModal() {
        setSelectedCar(null);
        setNewStatus(null);
        setLoading(false);
    }

    async function confirmUpdate() {
        try {
            setLoading(true);
            await api.put(ENDPOINTS.CARS.BY_ID(selectedCar.id), {
                ...selectedCar,
                status: newStatus,
            });

            show(`Car ${newStatus.toLowerCase()} successfully`, "success");
            reload();
            closeModal();
        } catch {
            show("Failed to update car status", "error");
            setLoading(false);
        }
    }

    if (!cars || cars.length === 0) {
        return (
            <div className="text-gray-500 text-center py-10">
                No cars found
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div>
                    <Button onClick={() => setShowAdd(true)} className="flex">
                        <div>+</div>
                        <div>Add Car</div>
                    </Button>
                </div>
                {cars.map(car => (
                    <div
                        key={car.id}
                        className="bg-white border rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition flex justify-between"
                    >
                        {/* LEFT */}
                        <div className="space-y-1 text-sm text-gray-700">
                            <div className="text-lg font-semibold text-gray-900">
                                {car.make} {car.model}
                                <span className="ml-2 text-sm text-gray-500">
                                    ({car.plateNumber})
                                </span>
                            </div>

                            <div>
                                <span className="font-medium">Car ID:</span>{" "}
                                {car.id}
                            </div>

                            <div>
                                <span className="font-medium">Price / Day:</span>{" "}
                                ₹{car.pricePerDay}
                            </div>

                            <div>
                                <span className="font-medium">Seats:</span>{" "}
                                {car.seats} •{" "}
                                <span className="font-medium">Type:</span>{" "}
                                {car.carType}
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col items-end justify-between">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                                    car.status
                                )}`}
                            >
                                {car.status}
                            </span>

                            {car.status === "ACTIVE" ? (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() =>
                                        openConfirm(car, "INACTIVE")
                                    }
                                >
                                    Deactivate
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() =>
                                        openConfirm(car, "ACTIVE")
                                    }
                                >
                                    Activate
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <AddCar
                open={showAdd}
                onClose={() => setShowAdd(false)}
                onSaved={loadCars}
            />

            {/* CONFIRM MODAL */}
            <Modal
                open={!!selectedCar}
                title="Confirm Action"
                onClose={closeModal}
                onConfirm={confirmUpdate}
                confirmText={
                    newStatus === "ACTIVE" ? "Activate Car" : "Deactivate Car"
                }
                variant={newStatus === "ACTIVE" ? "primary" : "danger"}
                loading={loading}
            >
                <p className="text-gray-700">
                    Are you sure you want to{" "}
                    <span className="font-semibold">
                        {newStatus?.toLowerCase()}
                    </span>{" "}
                    this car?
                </p>

                <p className="mt-2 text-sm text-gray-500">
                    {selectedCar?.make} {selectedCar?.model} (
                    {selectedCar?.plateNumber})
                </p>
            </Modal>
        </>
    );
}
