import { useRef } from "react";

export default function CarImageCarousel({
    items = [],
    renderItem,
    itemWidth = 260,
    gap = 24,
}) {
    const ref = useRef(null);
    const SCROLL_AMOUNT = itemWidth + gap;

    const scroll = (dir) => {
        ref.current?.scrollBy({
            left: dir * SCROLL_AMOUNT,
            behavior: "smooth",
        });
    };

    if (!items.length) return null;

    return (
        <div className="relative w-full">
            {/* LEFT */}
            <button onClick={() => scroll(-1)} className="carousel-btn left" aria-label="Previous">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-700">
                    <path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <button onClick={() => scroll(1)} className="carousel-btn right" aria-label="Next">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-700">
                    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* CONTENT */}
            <div
                ref={ref}
                className="flex gap-6 overflow-x-auto scroll-smooth px-6 no-scrollbar"
            >
                {items.map((item, idx) => (
                    <div
                        key={item.id || idx}
                        style={{ minWidth: itemWidth }}
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>
        </div>
    );
}
