"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Section = ({
    className,
    children,
    opacityValue = 1
}: {
    className?: string;
    children: React.ReactNode;
    opacityValue?: any;
}) => (
    <section className={`min-h-[100vh] flex flex-col justify-center px-6 relative z-10 ${className}`}>
        <motion.div style={{ opacity: opacityValue }}>
            {children}
        </motion.div>
    </section>
);

export default function ScrollSections() {
    return (
        <div className="relative z-10 w-full pointer-events-none">
            {/* 0-15% Hero */}
            <div id="overview" className="h-[100vh] flex items-center justify-center text-center">
                <div className="max-w-3xl space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-bold tracking-tighter text-white"
                    >
                        The Mask. Reinvented.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl md:text-2xl text-white/60 tracking-wide font-light"
                    >
                        Detoxify. Moisturize. Mess-free.
                    </motion.p>
                </div>
            </div>

            {/* Spacer to allow scrolling through animation */}
            <div className="h-[50vh]" />

            {/* 15-40% Mechanism */}
            <div id="benefits" className="h-[120vh] flex items-center">
                <div className="max-w-xl pl-6 md:pl-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: "-20% 0px -20% 0px" }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Precision Application.</h2>
                        <div className="space-y-2 text-white/70 text-lg">
                            <p>No dirty fingers. No wasted product.</p>
                            <p>The innovative rotating head design allows for precise, even coverage in seconds.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 40-65% Formula Explosion */}
            <div id="formula" className="h-[150vh] flex items-center justify-end">
                <div className="max-w-xl pr-6 md:pr-20 text-right">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ margin: "-20% 0px -20% 0px" }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        <h3 className="text-matcha font-medium tracking-widest text-sm uppercase">100% Organic</h3>
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Powered by Nature.</h2>
                        <div className="space-y-2 text-white/70 text-lg">
                            <p>Premium Green Tea Extract reduces redness and fights oxidative stress.</p>
                            <p>Natural Kaolin Clay acts as a magnet for toxins, pulling impurities from deep within pores.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 65-85% Texture */}
            <div id="reviews" className="h-[120vh] flex items-center">
                <div className="max-w-xl pl-6 md:pl-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ margin: "-20% 0px -20% 0px" }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Instant Clarity.</h2>
                        <div className="space-y-2 text-white/70 text-lg">
                            <p>Dissolves blackheads and controls oil production without stripping moisture.</p>
                            <p>Balances skin pH for a soft, hydrated, and luminous finish.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 85-100% CTA */}
            <div className="h-[100vh] flex items-center justify-center text-center pointer-events-auto">
                <div className="max-w-xl space-y-8 p-10 bg-botanic-secondary/30 backdrop-blur-sm rounded-3xl border border-white/5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl font-medium text-white mb-2">Your new ritual awaits.</h2>
                        <h3 className="text-5xl font-bold text-white mb-6">Simple. Effective. Essential.</h3>

                        <Link href="/buy" className="bg-matcha text-botanic-deep font-bold text-xl px-12 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(150,201,61,0.4)] inline-block">
                            Shop Green Mask Stick
                        </Link>
                        <p className="mt-4 text-sm text-white/40">Free shipping on all orders over $50</p>
                    </motion.div>
                </div>
            </div>

            {/* Extra spacer for end scroll */}
            <div className="h-[50vh]" />
        </div>
    );
}
