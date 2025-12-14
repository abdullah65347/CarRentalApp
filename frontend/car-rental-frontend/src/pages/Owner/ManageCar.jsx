import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import { validateCar } from "../../utils/validators";
import { useToast } from "../../context/ToastContext";

export default function ManageCar({ car, onClose, onSaved }) {
    const { show } = useToast();

    const [form, setForm] = useState(car);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(car);
    }, [car]);

    function updateField(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function saveCar() {
        const error = validateCar(form);
        if (error) {
            show(error, "error");
            return;
        }

        try {
            setSaving(true);
            await api.put(ENDPOINTS.CARS.BY_ID(car.id), form);
            show("Car updated successfully", "success");
            onSaved();
            onClose();
        } catch {
            show("Failed to update car", "error");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            open={!!car}
            title="Manage Car"
            onClose={onClose}
            onConfirm={saveCar}
            confirmText="Save Changes"
            cancelText="Cancel"
            loading={saving}
        >
            <div className="space-y-6">

                {/* INFO */}
                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    Update car pricing and availability.
                    <div className="mt-1 font-medium text-gray-800">
                        {car?.make} {car?.model} ({car?.plateNumber})
                    </div>
                </div>

                {/* FORM */}
                <div className="space-y-4">

                    {/* PRICE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price per day
                        </label>
                        <input
                            type="number"
                            value={form?.pricePerDay ?? ""}
                            onChange={e =>
                                updateField("pricePerDay", e.target.value)
                            }
                            className="input"
                            placeholder="Enter price per day"
                        />
                    </div>

                    {/* STATUS */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={form?.status ?? "ACTIVE"}
                            onChange={e =>
                                updateField("status", e.target.value)
                            }
                            className="input"
                        >
                            <option value="ACTIVE">Active (Available)</option>
                            <option value="INACTIVE">Inactive (Hidden)</option>
                        </select>

                        <p className="mt-1 text-xs text-gray-500">
                            {form?.status === "ACTIVE"
                                ? "Car will be visible for booking"
                                : "Car will be hidden from users"}
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );

}
