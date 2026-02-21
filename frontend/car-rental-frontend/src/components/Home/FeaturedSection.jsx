import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CarCard from "../car/CarCard";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import { ArrowRight, ArrowRightIcon } from "lucide-react";

export default function FeaturedSection({
    cars,
    loading,
    setSelectedCar,
}) {
    return (
        <section className="py-6">
            <div className=" px-4 lg:px-20 md:px-10">

                {/* Header Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex justify-between items-end mb-5"
                >
                    <div>
                        <p className="text-sm font-medium text-blue-700 uppercase tracking-wider mb-2">
                            Our Fleet
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-black">
                            Featured Cars
                        </h2>
                    </div>

                    <Button size="md" className=" btn-dark-gradient">
                        <Link to="/cars" className="flex gap-1">
                            View all
                            <ArrowRightIcon className="h-5 w-5" />
                        </Link>
                    </Button>
                </motion.div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Spinner />
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-black">
                        No cars available right now
                    </div>
                ) : (
                    <>
                        {/* Grid with stagger animation */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: {},
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1,
                                    },
                                },
                            }}
                            className="bg-slate-200 p-4 lg:p-14 md:p-8 sm:p-6 rounded-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {cars.slice(0, 6).map((car) => (
                                <motion.div
                                    key={car.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 },
                                    }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <CarCard
                                        car={car}
                                        onView={setSelectedCar}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Mobile View All */}
                        <Link
                            to="/cars"
                            className="mt-8 mx-auto block w-fit md:hidden btn-dark-gradient 
                            px-5 py-2.5 
                            rounded-md 
                            text-sm font-medium text-white"
                        >
                            View all cars
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
}
