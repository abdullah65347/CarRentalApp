import { Car } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-slate-950 to-slate-900 text-white py-14">
            <div className="mx-auto px-6 md:px-14 lg:px-28">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-blue-700 rounded-lg p-1.5">
                                <Car className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="text-lg font-bold font-display text-primary-foreground">CarRental</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Premium car rentals from trusted owners. Your journey starts here.
                        </p>
                    </div>

                    {[
                        { title: "Company", links: ["About", "Careers", "Blog", "Press"] },
                        { title: "Support", links: ["Help Center", "Safety", "Terms", "Privacy"] },
                        { title: "Explore", links: ["Cities", "Popular Cars", "Deals", "Reviews"] },
                    ].map((col) => (
                        <div key={col.title}>
                            <h4 className="text-lg font-semibold mb-4">{col.title}</h4>
                            <ul className="space-y-2">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link to="#" className="text-md text-gray-400 hover:text-gray-500 transition-colors">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t  mt-10 pt-6 text-center text-sm">
                    © {new Date().getFullYear()} CarRental. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
