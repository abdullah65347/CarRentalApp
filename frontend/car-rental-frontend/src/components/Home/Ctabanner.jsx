import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CTABanner() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-10 lg:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden bg-gray-950 px-8 py-16 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    {/* Background decoration */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-yellow-500/10 blur-3xl" />
                        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl" />
                    </div>

                    <div className="relative z-10 text-center md:text-left">
                        <p className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-3">
                            Get Started Today
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                            Your next trip starts <br className="hidden md:block" />
                            <span className="text-yellow-400">with one search</span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-md">
                            500+ verified cars. Instant booking. No hidden fees. Join over 10,000
                            happy customers who drive smarter.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row gap-3">
                        <Link
                            to="/cars"
                            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors duration-200"
                        >
                            Browse Cars
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-colors duration-200 border border-white/10"
                        >
                            Create Account
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}