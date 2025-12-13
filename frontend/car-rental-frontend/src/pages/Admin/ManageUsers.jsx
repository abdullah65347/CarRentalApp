import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import { useState } from "react";
import { useToast } from "../../context/ToastContext";

export default function ManageUser({ users, reload }) {
    const toast = useToast();
    const [savingId, setSavingId] = useState(null);

    async function updateUserRoles(userId, newRole) {
        if (!window.confirm(`Change role to ${newRole}?`)) {
            toast.show("Cancelled");
            return;
        }

        try {
            setSavingId(userId);
            await api.put(ENDPOINTS.ADMIN.UPDATE_ROLES(userId, newRole));
            toast.show("Role updated");
            reload();
        } catch {
            toast.show("Failed to update role");
        } finally {
            setSavingId(null);
        }
    }

    return (
        <div className="divide-y">
            {users.map(user => (
                <div
                    key={user.id}
                    className="py-3 flex items-center justify-between"
                >
                    <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500">
                            {user.roles.map(r => r.name).join(", ")}
                        </div>
                    </div>

                    <select
                        className="input"
                        defaultValue={user.roles[0].name}
                        disabled={savingId === user.id}
                        onChange={(e) =>
                            updateUserRoles(user.id, e.target.value)
                        }
                    >
                        <option value="ROLE_USER">USER</option>
                        <option value="ROLE_OWNER">OWNER</option>
                    </select>
                </div>
            ))}
        </div>
    );
}
