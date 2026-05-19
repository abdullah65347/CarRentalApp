import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Arjun Mehta",
        location: "Mumbai",
        rating: 5,
        text: "Booked a sedan for a weekend trip and the whole process took under 5 minutes. The car was in perfect condition. Will definitely use again.",
        initials: "AM",
        color: "bg-blue-600",
    },
    {
        name: "Priya Sharma",
        location: "Bangalore",
        rating: 5,
        text: "Finally a rental service that doesn't feel sketchy. Transparent pricing, clean cars, and support that actually picks up the phone.",
        initials: "PS",
        color: "bg-yellow-500",
    },
    {
        name: "Rohan Verma",
        location: "Hyderabad",
        rating: 4,
        text: "Great fleet of cars. I rented an SUV for a family trip to Coorg. Pickup was smooth and the vehicle was exactly as shown.",
        initials: "RV",
        color: "bg-gray-700",
    },
    {
        name: "Sneha Pillai",
        location: "Chennai",
        rating: 5,
        text: "The instant booking confirmation is a game changer. No calls, no back and forth. Just book and go.",
        initials: "SP",
        color: "bg-rose-500",
    },
];

function StarRow({ count }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    );
}

export default function Testimonials() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container mx-auto px-4 md:px-10 lg:px-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
                        Reviews
                    </p>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            10,000+ happy <br />
                            <span className="text-yellow-500">customers</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-3xl font-black text-gray-900">4.9</p>
                                <StarRow count={5} />
                                <p className="text-xs text-gray-400 mt-1">Average rating</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            {/* Quote icon */}
                            <Quote className="h-6 w-6 text-gray-200 fill-gray-200" />

                            {/* Text */}
                            <p className="text-sm text-gray-600 leading-relaxed flex-1">"{t.text}"</p>

                            {/* Footer */}
                            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                                <div
                                    className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                                >
                                    {t.initials}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-gray-400">{t.location}</p>
                                        <StarRow count={t.rating} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}