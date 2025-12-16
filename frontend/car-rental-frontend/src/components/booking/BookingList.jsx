import Spinner from "../ui/Spinner";
import BookingCard from "./BookingCard";


export default function BookingList({
    title,
    bookings,
    loading,
    showUser = false,
}) {
    if (loading) {
        return (
            <div className="flex justify-center mt-10">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">{title}</h1>

            {bookings.length === 0 && (
                <div className="text-gray-500 text-center">
                    No bookings found
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map(b => (
                    <BookingCard
                        key={b.id}
                        booking={b}
                        showUser={showUser}
                    />
                ))}
            </div>
        </div>
    );
}
