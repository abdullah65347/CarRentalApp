import { useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";

export default function ManageUser({ users, reload }) {
    const { show } = useToast();

    const [savingId, setSavingId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState(null);
    const [loading, setLoading] = useState(false);

    function roleBadge(role) {
        return role === "ROLE_OWNER"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700";
    }

    function initials(name = "") {
        return name
            .split(" ")
            .map(w => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    /* ---------- MODAL HANDLERS ---------- */

    function openConfirm(user, role) {
        setSelectedUser(user);
        setNewRole(role);
    }

    function closeModal() {
        setSelectedUser(null);
        setNewRole(null);
        setLoading(false);
    }

    async function confirmRoleChange() {
        try {
            setLoading(true);
            setSavingId(selectedUser.id);

            await api.put(
                ENDPOINTS.ADMIN.UPDATE_ROLES(selectedUser.id, newRole)
            );

            show("Role updated successfully", "success");
            reload();
            closeModal();
        } catch {
            show("Failed to update role", "error");
            setLoading(false);
            setSavingId(null);
        }
    }

    /* ---------- UI ---------- */

    return (
        <>
            <div className="space-y-3">
                {users.map(user => {
                    const currentRole = user.roles[0]?.name;

                    return (
                        <div
                            key={user.id}
                            className="bg-white border rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                {/* USER INFO */}
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                                        {initials(user.name)}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {user.name}
                                            </span>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${roleBadge(
                                                    currentRole
                                                )}`}
                                            >
                                                {currentRole.replace("ROLE_", "")}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>

                                {/* ROLE CAPSULE DESIGN */}
                                <div className="flex border rounded-lg overflow-hidden w-40">
                                    {["ROLE_USER", "ROLE_OWNER"].map(role => {
                                        const isActive = currentRole === role;

                                        return (
                                            <button
                                                key={role}
                                                disabled={savingId === user.id || isActive}
                                                onClick={() =>
                                                    openConfirm(user, role)
                                                }
                                                className={`
                                                    flex-1 py-2 text-sm font-medium transition
                                                    ${isActive
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-white text-gray-700 hover:bg-gray-100"}
                                                    disabled:opacity-60
                                                `}
                                            >
                                                {role.replace("ROLE_", "")}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {savingId === user.id && (
                                <div className="text-xs text-blue-600 mt-2 text-right">
                                    Saving…
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* CONFIRM ROLE CHANGE MODAL */}
            <Modal
                open={!!selectedUser}
                title="Confirm Role Change"
                onClose={closeModal}
                onConfirm={confirmRoleChange}
                confirmText="Confirm Change"
                cancelText="Cancel"
                loading={loading}
            >
                <div className="space-y-3 text-sm text-gray-700">
                    <p>
                        Are you sure you want to change the role for this user?
                    </p>

                    <div className=" bg-gray-50 rounded-lg p-3 text-s">
                        <div className=" font-medium text-gray-900">
                            {selectedUser?.name}
                        </div>
                        <div>{selectedUser?.email}</div>
                        <div className="mt-2">
                            New role:{" "}
                            <span className="font-semibold">
                                {newRole?.replace("ROLE_", "")}
                            </span>
                        </div>
                    </div>


                </div>
            </Modal>
        </>
    );
}
