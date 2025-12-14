import { useEffect, useState } from "react";
import { ENDPOINTS } from "../api/endpoints";
import api from "../api/apiClient";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { useToast } from "../context/ToastContext";

const MAX_NOTES_LENGTH = 500;

export default function Profile() {
    const toast = useToast();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Quick Notes (session-based)
    const [notes, setNotes] = useState(
        localStorage.getItem("quick_notes") || ""
    );

    useEffect(() => {
        api.get(ENDPOINTS.AUTH.ME)
            .then(res => setUser(res.data))
            .catch(() => toast.show("Failed to load profile"))
            .finally(() => setLoading(false));
    }, []);

    function saveNotes() {
        localStorage.setItem("quick_notes", notes);
        toast.show("Notes saved");
    }

    function clearNotes() {
        setNotes("");
        localStorage.removeItem("quick_notes");
        toast.show("Notes cleared");
    }

    function logout() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("quick_notes"); // clear notes on logout
        toast.show("Logged out successfully");
        window.location.href = "/auth/login";
    }

    if (loading) {
        return (
            <div className="flex justify-center mt-16">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center mt-16 text-gray-500">
                Profile not available
            </div>
        );
    }

    const initials = user.name
        ?.split(" ")
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-8">
            {/* ===== HEADER ===== */}
            <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div
                        className="w-20 h-20 rounded-full bg-blue-100 text-blue-700
                                   flex items-center justify-center text-2xl font-semibold"
                    >
                        {initials}
                    </div>

                    <div>
                        <div className="text-2xl font-bold">
                            {user.name}
                        </div>
                        <div className="text-gray-500">
                            {user.email}
                        </div>
                    </div>
                </div>

                <Button variant="danger" onClick={logout}>
                    Logout
                </Button>
            </div>

            {/* ===== QUICK STATS ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <div className="text-sm text-gray-500">Account Type</div>
                    <div className="text-lg font-semibold">
                        {user.roles?.join(", ") || "USER"}
                    </div>
                </Card>

                <Card>
                    <div className="text-sm text-gray-500">User ID</div>
                    <div className="text-lg font-semibold truncate">
                        {user.id}
                    </div>
                </Card>

                <Card>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="text-lg font-semibold text-green-600">
                        Active
                    </div>
                </Card>
            </div>

            {/* ===== MAIN GRID ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LEFT: ACCOUNT INFO */}
                <Card className="md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">
                        Account Information
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-gray-500">Full Name</div>
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

                        <div>
                            <div className="text-gray-500">Role</div>
                            <div className="font-medium">
                                {user.roles?.join(", ") || "USER"}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* RIGHT: QUICK NOTES */}
                <Card>
                    <h2 className="text-lg font-semibold mb-3">
                        Quick Notes
                    </h2>

                    <p className="text-sm text-gray-500 mb-3">
                        Temporary notes for this session. Cleared on logout.
                    </p>

                    <textarea
                        value={notes}
                        onChange={(e) =>
                            setNotes(
                                e.target.value.slice(0, MAX_NOTES_LENGTH)
                            )
                        }
                        rows={6}
                        placeholder="Write something to remember..."
                        className="w-full border rounded-lg p-3 text-sm resize-none
                                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* CHARACTER COUNTER */}
                    <div
                        className={`text-xs mt-1 text-right ${notes.length > 450
                            ? "text-red-500"
                            : "text-gray-400"
                            }`}
                    >
                        {notes.length} / {MAX_NOTES_LENGTH}
                    </div>

                    <div className="flex justify-end gap-2 mt-3">
                        <Button variant="secondary" onClick={clearNotes}>
                            Clear
                        </Button>
                        <Button onClick={saveNotes} disabled={!notes.trim()}>
                            Save
                        </Button>
                    </div>
                </Card>
            </div>

            {/* ===== FOOTER ===== */}
            <div className="text-center text-xs text-gray-400 pt-6">
                Logged in as <span className="font-medium">{user.email}</span>
            </div>
        </div>
    );
}
