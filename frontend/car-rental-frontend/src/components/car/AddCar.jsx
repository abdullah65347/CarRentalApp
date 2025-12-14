import { useEffect, useState, useContext } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import { validateCar } from "../../utils/validators";
import { useToast } from "../../context/ToastContext";
import { AuthContext } from "../../context/AuthContext";

export default function AddCar({ open, onClose, onSaved }) {
    const { show } = useToast();
    const { user } = useContext(AuthContext);

    const isAdmin = user?.roles?.includes("ROLE_ADMIN");

    const [locations, setLocations] = useState([]);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        ownerId: "",
        make: "",
        model: "",
        year: "",
        plateNumber: "",
        seats: "",
        carType: "SEDAN",
        transmission: "MANUAL",
        fuelType: "PETROL",
        pricePerDay: "",
        location: "",
        description: "",
        status: "ACTIVE",
    });

    // ✅ auto-fill ownerId for OWNER
    useEffect(() => {
        if (!isAdmin && user?.id) {
            setForm(prev => ({ ...prev, ownerId: user.id }));
        }
    }, [isAdmin, user]);

    function updateField(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function addCar() {
        const error = validateCar(form);
        if (error) {
            show(error, "error");
            return;
        }

        try {
            setSaving(true);

            await api.post(ENDPOINTS.CARS.CREATE, {
                ...form,
                year: Number(form.year),
                seats: Number(form.seats),
                pricePerDay: Number(form.pricePerDay),
            });

            show("Car added successfully", "success");
            onSaved();
            onClose();
        } catch {
            show("Failed to add car", "error");
        } finally {
            setSaving(false);
        }
    }

    useEffect(() => {
        loadLocations();
    }, []);

    async function loadLocations() {
        try {
            const res = await api.get(ENDPOINTS.LOCATIONS.LIST);
            setLocations(res.data);
        } catch {
            show("Failed to load locations", "error");
        }
    }

    return (
        <Modal
            open={open}
            title="Add New Car"
            onClose={onClose}
            onConfirm={addCar}
            confirmText="Add Car"
            cancelText="Cancel"
            loading={saving}
            size="lg"
        >
            <div className="space-y-6">

                {/* INFO */}
                <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    Fill the details to add a new car for rental.
                </div>

                {/* FORM */}
                <div className="space-y-4">

                    {isAdmin && (
                        <div>
                            <Field label="Owner ID">
                                <input
                                    type="number"
                                    value={form.ownerId}
                                    onChange={e =>
                                        updateField("ownerId", e.target.value)
                                    }
                                    className="input"
                                    placeholder="Enter owner user ID"
                                />
                            </Field>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Make">
                            <input
                                className="input"
                                value={form.make}
                                onChange={e => updateField("make", e.target.value)}
                            />
                        </Field>

                        <Field label="Model">
                            <input
                                className="input"
                                value={form.model}
                                onChange={e => updateField("model", e.target.value)}
                            />
                        </Field>

                        <Field label="Year">
                            <input
                                type="number"
                                className="input"
                                value={form.year}
                                onChange={e => updateField("year", e.target.value)}
                            />
                        </Field>

                        <Field label="Plate Number">
                            <input
                                className="input"
                                value={form.plateNumber}
                                onChange={e =>
                                    updateField("plateNumber", e.target.value)
                                }
                            />
                        </Field>

                        <Field label="Seats">
                            <input
                                type="number"
                                className="input"
                                value={form.seats}
                                onChange={e => updateField("seats", e.target.value)}
                            />
                        </Field>

                        <Field label="Car Type">
                            <select
                                className="input"
                                value={form.carType}
                                onChange={e =>
                                    updateField("carType", e.target.value)
                                }
                            >
                                <option>SEDAN</option>
                                <option>MUV</option>
                                <option>SUV</option>
                                <option>HATCHBACK</option>
                            </select>
                        </Field>

                        <Field label="Transmission">
                            <select
                                className="input"
                                value={form.transmission}
                                onChange={e =>
                                    updateField("transmission", e.target.value)
                                }
                            >
                                <option>MANUAL</option>
                                <option>AUTO</option>
                            </select>
                        </Field>

                        <Field label="Fuel Type">
                            <select
                                className="input"
                                value={form.fuelType}
                                onChange={e =>
                                    updateField("fuelType", e.target.value)
                                }
                            >
                                <option>PETROL</option>
                                <option>DIESEL</option>
                                <option>ELECTRIC</option>
                            </select>
                        </Field>

                        <Field label="Price per Day">
                            <input
                                type="number"
                                className="input"
                                value={form.pricePerDay}
                                onChange={e =>
                                    updateField("pricePerDay", e.target.value)
                                }
                            />
                        </Field>

                        <Field label="Location">
                            <select
                                className="input"
                                value={form.locationId}
                                onChange={e => updateField("locationId", e.target.value)}
                                required
                            >
                                <option value="">Select location</option>

                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <Field label="Status">
                        <select
                            className="input"
                            value={form.status}
                            onChange={e =>
                                updateField("status", e.target.value)
                            }
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </Field>

                    <Field label="Description">
                        <textarea
                            rows="3"
                            className="input"
                            value={form.description}
                            onChange={e =>
                                updateField("description", e.target.value)
                            }
                        />
                    </Field>
                </div>
            </div>
        </Modal>
    );
}

/* ---------- Helper ---------- */
function Field({ label, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
        </div>
    );
}
