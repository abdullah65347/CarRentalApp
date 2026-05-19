import { Search, CalendarCheck, CarFront } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Search & Compare",
        description:
            "Browse our fleet of premium vehicles. Filter by type, price, and location to find your ideal car.",
        color: "from-blue-600 to-blue-400",
        bg: "bg-blue-50",
        border: "border-blue-100",
    },
    {
        number: "02",
        icon: CalendarCheck,
        title: "Book Instantly",
        description:
            "Choose your dates, confirm the booking, and get instant confirmation — no waiting required.",
        color: "from-yellow-500 to-yellow-400",
        bg: "bg-yellow-50",
        border: "border-yellow-100",
    },
    {
        number: "03",
        icon: CarFront,
        title: "Hit the Road",
        description:
            "Pick up your car from the designated location and enjoy your journey with full insurance coverage.",
        color: "from-gray-800 to-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-100",
    },
];

export default function HowItWorks() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-10 lg:px-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <p className="text-sm font-semibold text-blue-600 uppercase tracking-widest mb-3">
                        Simple Process
                    </p>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Ready in <span className="text-yellow-500">3 steps</span>
                        </h2>
                        <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                            From search to ignition — our streamlined process gets you on the road
                            faster than you think.
                        </p>
                    </div>
                </motion.div>

                {/* Steps */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Connector line — desktop only */}
                    <div className="hidden md:block absolute top-[3.25rem] left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px">
                        <div className="w-full h-full border-t-2 border-dashed border-gray-200" />
                    </div>

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.15 }}
                            viewport={{ once: true }}
                            className={`relative rounded-2xl border ${step.border} ${step.bg} p-8 flex flex-col gap-5 group hover:shadow-lg transition-shadow duration-300`}
                        >
                            {/* Step number badge */}
                            <div className="flex items-center justify-between">
                                <div
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}
                                >
                                    <step.icon className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-5xl font-black text-gray-100 select-none leading-none">
                                    {step.number}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>

                            {/* Subtle hover arrow */}
                            <div className="mt-auto pt-4 border-t border-gray-200/60">
                                <span
                                    className={`text-xs font-semibold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}
                                >
                                    Step {step.number}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}