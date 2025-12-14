import { useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";

export default function ManageAllBookings({ bookings, reload }) {
    const { show } = useToast();

    const [cancellingId, setCancellingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(false);

    function formatDateTime(value) {
        if (!value) return "—";
        return new Date(value).toLocaleString();
    }

    function statusBadge(status) {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    }

    function openCancelModal(booking) {
        setSelectedBooking(booking);
    }

    function closeModal() {
        setSelectedBooking(null);
        setLoading(false);
    }

    async function confirmCancel() {
        try {
            setLoading(true);
            setCancellingId(selectedBooking.id);

            await api.put(
                ENDPOINTS.BOOKINGS.CANCEL(selectedBooking.id)
            );

            show("Booking cancelled successfully", "success");
            reload();
            closeModal();
        } catch {
            show("Failed to cancel booking", "error");
            setLoading(false);
            setCancellingId(null);
        }
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="text-gray-500 text-center py-10">
                No bookings found
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {bookings.map(b => (
                    <div
                        key={b.id}
                        className="bg-white border rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition flex justify-between"
                    >
                        {/* LEFT: DETAILS */}
                        <div className="space-y-1 text-sm text-gray-700">
                            <div className="text-lg font-semibold text-gray-900">
                                {b.car?.make} {b.car?.model}
                                <span className="ml-2 text-sm text-gray-500">
                                    ({b.car?.plateNumber})
                                </span>
                            </div>

                            <div>
                                <span className="font-medium">User:</span>{" "}
                                {b.user?.name}
                                <span className="text-gray-500">
                                    {" "}— {b.user?.email}
                                </span>
                            </div>

                            <div>
                                <span className="font-medium">Booking ID:</span>{" "}
                                {b.id}
                            </div>

                            <div className="flex gap-6">
                                <div>
                                    <span className="font-medium">From:</span>{" "}
                                    {formatDateTime(b.startDatetime)}
                                </div>
                                <div>
                                    <span className="font-medium">To:</span>{" "}
                                    {formatDateTime(b.endDatetime)}
                                </div>
                            </div>

                            <div>
                                <span className="font-medium">Total Price:</span>{" "}
                                ₹{b.totalPrice}
                            </div>
                        </div>

                        {/* RIGHT: STATUS + ACTION */}
                        <div className="flex flex-col items-end justify-between">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                                    b.status
                                )}`}
                            >
                                {b.status}
                            </span>

                            {b.status === "PENDING" && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    loading={cancellingId === b.id}
                                    onClick={() => openCancelModal(b)}
                                    className="mt-4"
                                >
                                    Cancel Booking
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* CONFIRM CANCEL MODAL */}
            <Modal
                open={!!selectedBooking}
                title="Cancel Booking"
                onClose={closeModal}
                onConfirm={confirmCancel}
                confirmText="Yes, Cancel Booking"
                cancelText="No, Keep Booking"
                variant="danger"
                loading={loading}
            >
                <div className="space-y-2 text-sm text-gray-700">
                    <p>
                        Are you sure you want to cancel this booking?
                    </p>

                    <div className="bg-gray-50 rounded-lg p-3 text-xs">
                        <div className="font-medium text-gray-900">
                            {selectedBooking?.car?.make}{" "}
                            {selectedBooking?.car?.model}
                        </div>
                        <div>
                            Booking ID: {selectedBooking?.id}
                        </div>
                        <div>
                            User: {selectedBooking?.user?.name}
                        </div>
                    </div>

                    <p className="text-xs text-red-600">
                        This action cannot be undone.
                    </p>
                </div>
            </Modal>
        </>
    );
}
