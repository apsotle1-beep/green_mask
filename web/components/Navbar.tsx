"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <motion.nav
            className={clsx(
                "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-in-out border-b border-transparent",
                scrolled ? "bg-botanic-deep/70 backdrop-blur-md border-white/5" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-xl font-bold tracking-tight text-white/95">
                    Green Mask<span className="text-[0.6em] align-top">TM</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    <a href="#" className="hover:text-white transition-colors">Overview</a>
                    <a href="#" className="hover:text-white transition-colors">Formula</a>
                    <a href="#" className="hover:text-white transition-colors">Benefits</a>
                    <a href="#" className="hover:text-white transition-colors">Reviews</a>
                    <a href="#" className="hover:text-white transition-colors">Shop</a>
                </div>

                <button className="bg-matcha hover:bg-[#86b535] text-botanic-deep font-semibold px-5 py-2 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(150,201,61,0.3)] hover:shadow-[0_0_25px_rgba(150,201,61,0.5)]">
                    Get the Glow
                </button>
            </div>
        </motion.nav>
    );
}
