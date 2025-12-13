export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex gap-2 justify-center mt-6">
            <button
                disabled={page === 0}
                onClick={() => onPageChange(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index)}
                    className={`px-3 py-1 border rounded ${page === index ? "bg-blue-600 text-white" : ""
                        }`}
                >
                    {index + 1}
                </button>
            ))}

            <button
                disabled={page === totalPages - 1}
                onClick={() => onPageChange(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}
