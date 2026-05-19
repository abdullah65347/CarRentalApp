import { ShieldCheck, Clock, MapPin, Headphones, Star, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: ShieldCheck,
        title: "Fully Insured",
        description: "Every vehicle comes with comprehensive insurance coverage so you drive worry-free.",
        accent: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description: "Book anytime, any day. Our platform never sleeps so you can plan on your schedule.",
        accent: "text-yellow-600",
        bg: "bg-yellow-50",
    },
    {
        icon: MapPin,
        title: "50+ Locations",
        description: "Pick up and drop off at convenient spots across the city — wherever you need us.",
        accent: "text-green-600",
        bg: "bg-green-50",
    },
    {
        icon: Headphones,
        title: "Live Support",
        description: "Our support team is on call around the clock to handle anything that comes up.",
        accent: "text-purple-600",
        bg: "bg-purple-50",
    },
    {
        icon: Star,
        title: "Top-Rated Fleet",
        description: "Every car is rated and reviewed by real customers. Only the best make our list.",
        accent: "text-orange-500",
        bg: "bg-orange-50",
    },
    {
        icon: CreditCard,
        title: "Transparent Pricing",
        description: "No hidden charges. What you see at booking is exactly what you pay.",
        accent: "text-rose-600",
        bg: "bg-rose-50",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-20 bg-gray-950">
            <div className="container mx-auto px-4 md:px-10 lg:px-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-14"
                >
                    <p className="text-sm font-semibold text-yellow-500 uppercase tracking-widest mb-3">
                        Why Us
                    </p>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            Built for drivers,
                            <br />
                            <span className="text-yellow-400">not just bookings</span>
                        </h2>

                    </div>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            viewport={{ once: true }}
                            className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-colors duration-300"
                        >
                            <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                                <f.icon className={`h-5 w-5 ${f.accent}`} />
                            </div>
                            <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}