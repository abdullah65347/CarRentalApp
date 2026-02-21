import { Search, CalendarCheck, CarFront } from "lucide-react";
import { motion } from "framer-motion";
import { carInstructions, carInstructions2 } from "../../assets/assets";

const steps = [
    {
        icon: Search,
        title: "Search & Compare",
        description: "Browse our fleet of premium vehicles. Filter by type, price, and location to find your ideal car.",
    },
    {
        icon: CalendarCheck,
        title: "Book Instantly",
        description: "Choose your dates, confirm the booking, and get instant confirmation — no waiting required.",
    },
    {
        icon: CarFront,
        title: "Hit the Road",
        description: "Pick up your car from the designated location and enjoy your journey with full insurance coverage.",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-10 bg-secondary/50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <p className="text-sm font-medium text-blue-700 uppercase tracking-wider mb-2">Simple Process</p>
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-black">
                        How It Works
                    </h2>
                    <div className="flex justify-center mt-4">
                        <img
                            src={carInstructions}
                            alt="Car booking instructions"
                            className="max-w-full md:max-w-3xl w-full object-contain rounded-lg"
                        />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                                <step.icon className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold font-display text-black mb-2">{step.title}</h3>
                            <p className="text-md text-gray-600 leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
