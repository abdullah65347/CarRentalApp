import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { ENDPOINTS } from "../api/endpoints";
import api from "../api/apiClient";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import OwnerDashboard from "./Owner/OwnerDashboard";
import ManageCar from "./Owner/ManageCar";

export default function Profile() {
    const toast = useToast();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [editingCar, setEditingCar] = useState(null);  // NEW

    useEffect(() => {
        api.get(ENDPOINTS.AUTH.ME)
            .then(res => setUser(res.data))
            .catch(() => toast.show("Failed to load profile"))
            .finally(() => setLoading(false));
    }, []);

    function logout() {
        localStorage.removeItem("access_token");
        toast.show("Logged out successfully");
        window.location.href = "/auth/login";
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return <div className="text-center mt-10">Profile not available</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">My Profile</h1>

            {/* USER INFO */}
            <Card>
                <h2 className="section-title">Account Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <div className="text-gray-500">Name</div>
                        <div className="font-medium">{user.name}</div>
                    </div>

                    <div>
                        <div className="text-gray-500">Email</div>
                        <div className="font-medium">{user.email}</div>
                    </div>

                    <div>
                        <div className="text-gray-500">User ID</div>
                        <div className="font-medium">{user.id}</div>
                    </div>
                </div>
            </Card>

            {/* EDIT CAR MODAL */}
            {editingCar && (
                <ManageCar
                    car={editingCar}
                    onClose={() => setEditingCar(null)}
                    onSaved={() => setEditingCar(null)}
                />
            )}

            {/* ACTIONS */}
            <Card>
                <h2 className="section-title">Actions</h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="danger" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </Card>
        </div>
    );
}
