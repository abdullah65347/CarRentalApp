import { useEffect, useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { validateCar } from "../../utils/validators";
import { useToast } from "../../context/ToastContext";


export default function ManageCar({ car, onClose, onSaved }) {
    const toast = useToast();

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
            toast.show(error);
            return;
        }

        try {
            setSaving(true);
            await api.put(ENDPOINTS.CARS.BY_ID(car.id), form);
            toast.show("Car updated successfully");
            onClose();
            onSaved();
        } catch {
            toast.show("Failed to update car");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal open title="Manage Car" onClose={onClose}>
            <div className="space-y-3">
                <div>
                    <label className="label">Price Per Day</label>
                    <input
                        type="number"
                        value={form.pricePerDay}
                        onChange={e => updateField("pricePerDay", e.target.value)}
                        className="input"
                    />
                </div>

                <div>
                    <label className="label">Status</label>
                    <select
                        value={form.status}
                        onChange={e => updateField("status", e.target.value)}
                        className="input"
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                    <Button variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button loading={saving} onClick={saveCar}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
