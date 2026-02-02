"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

const IMAGES = [
  "/images/product/product-1.jpg",
  "/images/product/product-2.jpg",
  "/images/product/product-3.jpg",
  "/images/product/product-4.jpg",
];

export default function ProductCarousel() {
  const [index, setIndex] = useState(0);

  const nextImage = () => {
    setIndex((prev) => (prev + 1) % IMAGES.length);
  };

  const prevImage = () => {
    setIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
  };

  return (
    <div className="relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl bg-botanic-secondary/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={IMAGES[index]}
            alt={`Green Mask Stick View ${index + 1}`}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
          className="bg-botanic-deep/50 backdrop-blur-md hover:bg-botanic-deep/80 p-2 rounded-full text-white transition-colors"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
          className="bg-botanic-deep/50 backdrop-blur-md hover:bg-botanic-deep/80 p-2 rounded-full text-white transition-colors"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={clsx(
              "w-2 h-2 rounded-full transition-all duration-300",
              i === index ? "bg-botanic-deep w-6" : "bg-botanic-deep/30 hover:bg-botanic-deep/50"
            )}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
