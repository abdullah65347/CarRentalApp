import { useRef } from "react";
import CarCard from "./CarCard";

export default function CarCardCarousel({ cars }) {
    const ref = useRef(null);
    const CARD_WIDTH = 260 + 24;

    const scroll = dir =>
        ref.current.scrollBy({ left: dir * CARD_WIDTH, behavior: "smooth" });

    return (
        <div className="relative w-full">
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

            <div
                ref={ref}
                className="p-4 flex gap-6 overflow-x-auto scroll-smooth px-9 no-scrollbar"
            >
                {cars.map(car => (
                    <div key={car.id} className="min-w-[260px] max-w-[260px]">
                        <CarCard car={car} />
                    </div>
                ))}
            </div>
        </div>
    );
}
