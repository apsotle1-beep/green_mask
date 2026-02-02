"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

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
                <Link href="/" className="text-xl font-bold tracking-tight text-white/95">
                    Green Mask<span className="text-[0.6em] align-top">TM</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    <Link href="/#overview" className="hover:text-white transition-colors">Overview</Link>
                    <Link href="/#formula" className="hover:text-white transition-colors">Formula</Link>
                    <Link href="/#benefits" className="hover:text-white transition-colors">Benefits</Link>
                    <Link href="/#reviews" className="hover:text-white transition-colors">Reviews</Link>
                    <Link href="/buy" className="hover:text-white transition-colors">Shop</Link>
                </div>

                <Link href="/buy" className="bg-matcha hover:bg-[#86b535] text-botanic-deep font-semibold px-5 py-2 rounded-full text-sm transition-all shadow-[0_0_15px_rgba(150,201,61,0.3)] hover:shadow-[0_0_25px_rgba(150,201,61,0.5)]">
                    Get the Glow
                </Link>
            </div>
        </motion.nav>
    );
}
