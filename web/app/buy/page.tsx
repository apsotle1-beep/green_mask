"use client";

import Navbar from "@/components/Navbar";
import ProductCarousel from "@/components/ProductCarousel";
import Accordion from "@/components/Accordion";
import BuyForm from "@/components/BuyForm";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function BuyPage() {
    const [showBuyForm, setShowBuyForm] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (type: "increase" | "decrease") => {
        setQuantity((prev) => type === "increase" ? prev + 1 : Math.max(1, prev - 1));
    };

    return (
        <main className="min-h-screen bg-botanic-deep text-white selection:bg-matcha selection:text-botanic-deep">
            <Navbar />

            {/* Buy Form Modal Overlay */}
            <AnimatePresence>
                {showBuyForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setShowBuyForm(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg my-8"
                        >
                            <BuyForm quantity={quantity} onClose={() => setShowBuyForm(false)} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left Column: Image Carousel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="md:sticky md:top-32">
                            <ProductCarousel />
                        </div>
                    </motion.div>

                    {/* Right Column: Product Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col space-y-8"
                    >
                        {/* Header */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                Green Mask Stick<span className="text-lg align-top ml-1">TM</span>
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-light text-matcha">$30.00</span>
                                <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider bg-white/10 rounded-full text-white/70">
                                    Free Shipping
                                </span>
                            </div>
                            <p className="text-lg text-white/70 leading-relaxed max-w-lg">
                                The viral deep-cleaning solution, engineered for your skin. Detoxify, moisturize, and reveal your natural glow with the power of organic green tea extract.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-4 w-full">
                                {/* Quantity Selector */}
                                <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/10 p-1">
                                    <button
                                        onClick={() => handleQuantityChange("decrease")}
                                        className="w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors text-xl font-medium"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-bold text-white text-lg">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange("increase")}
                                        className="w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors text-xl font-medium"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowBuyForm(true)}
                                    className="flex-1 bg-matcha hover:bg-[#86b535] text-botanic-deep font-bold text-lg py-4 rounded-full transition-all shadow-[0_0_20px_rgba(150,201,61,0.2)] hover:shadow-[0_0_30px_rgba(150,201,61,0.4)] md:transform md:active:scale-[0.98]"
                                >
                                    Add to Cart
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-white/40">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v12.59l1.95-1.95a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0l-3.25-3.25a.75.75 0 111.06-1.06l1.95 1.95V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
                                </svg>
                                <span>30-Day Money Back Guarantee</span>
                            </div>
                        </div>

                        {/* Details Accordion */}
                        <div className="pt-8">
                            <Accordion title="Key Benefits" defaultOpen>
                                <ul className="space-y-2 list-disc list-inside">
                                    <li>Deeply cleanses pores and removes dirt</li>
                                    <li>Adjusts water and oil balance within the skin</li>
                                    <li>Replenishes skin moisture and nourishment</li>
                                    <li>Contains green tea extract and Vitamin E</li>
                                </ul>
                            </Accordion>
                            <Accordion title="Ingredients">
                                <p>
                                    Water, Propylene Glycol, Glycerin, Titanium Dioxide, Kaolin, Isoceteth-20, Butylene Glycol, Sodium Hydroxide, Stearic Acid, Tea Extract, Disodium EDTA, Chromium Oxide Green, Dipotassium Glycyrrhizinate, Tocopherol (Vitamin E).
                                </p>
                            </Accordion>
                            <Accordion title="How to Use">
                                <ol className="space-y-2 list-decimal list-inside">
                                    <li>Spin out the paste and apply to the face.</li>
                                    <li>Apply evenly to the face and verify it covers the area properly.</li>
                                    <li>Leave it for about 10 minutes.</li>
                                    <li>After it dries, rinse with water.</li>
                                </ol>
                            </Accordion>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
