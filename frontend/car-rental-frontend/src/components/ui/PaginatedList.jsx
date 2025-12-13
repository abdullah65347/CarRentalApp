import Pagination from "./Pagination";

export default function PaginatedList({
    data,
    page,
    totalPages,
    onPageChange,
    renderItem,
}) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map(renderItem)}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </>
    );
}
