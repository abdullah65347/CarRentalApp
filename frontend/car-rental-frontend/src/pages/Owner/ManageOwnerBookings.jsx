import { useState } from "react";
import api from "../../api/apiClient";
import { ENDPOINTS } from "../../api/endpoints";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useToast } from "../../context/ToastContext";
import BookingCard from "../../components/booking/BookingCard";

export default function ManageOwnerBookings({ bookings, reload }) {
    const { show } = useToast();

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState(null);

    function closeModal() {
        setSelectedBooking(null);
        setLoading(false);
        setCancellingId(null);
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
                No bookings found for your cars
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {bookings.map(b => (
                    <BookingCard
                        key={b.id}
                        booking={b}
                        showUser
                        actions={
                            b.status === "PENDING" && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    loading={cancellingId === b.id}
                                    onClick={() => setSelectedBooking(b)}
                                    className="mt-4"
                                >
                                    Cancel Booking
                                </Button>
                            )
                        }
                    />
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
