"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";

export default function ImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalFrames = 240;

  const { scrollYProgress } = useScroll();

  // Map scroll (0 to 1) to frame index (0 to 239)
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  useEffect(() => {
    const loadImages = async () => {
      const imgs: HTMLImageElement[] = [];
      const promises: Promise<void>[] = [];

      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        // Assuming filenames are ezgif-frame-001.jpg, etc.
        const fileName = `ezgif-frame-${i.toString().padStart(3, "0")}.jpg`;
        img.src = `/frames/${fileName}`;
        
        const promise = new Promise<void>((resolve) => {
          img.onload = () => {
            setLoadedCount((prev) => prev + 1);
            resolve();
          };
          img.onerror = () => resolve(); // validation?
        });
        
        imgs.push(img);
        promises.push(promise);
      }

      setImages(imgs);
      // We don't necessarily need to wait for all to start showing something, 
      // but simpler for now.
    };

    loadImages();
  }, []);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !images[index] || !images[index].complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];

    // High DPI scaling
    const dpr = window.devicePixelRatio || 1;
    // We want the canvas to cover the screen
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale context to ensure correct drawing operations
    ctx.scale(dpr, dpr);
    
    // Maintain Aspect Ratio (Cover)
    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasAspect > imgAspect) {
      drawWidth = width;
      drawHeight = width / imgAspect;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * imgAspect;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }

    // Clear and draw
    // ctx.clearRect(0, 0, width, height); // Not strictly needed if we cover
    ctx.fillStyle = "#020804"; // Fallback/bg color to match site
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const index = Math.round(latest);
    if (index >= 0 && index < totalFrames) {
      requestAnimationFrame(() => renderFrame(index));
    }
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        // Force re-render of current frame
        const current = frameIndex.get();
        renderFrame(Math.round(current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images]);

  return (
    <div className="fixed inset-0 z-0 bg-botanic-deep pointer-events-none sticky-canvas-container">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover block"
        style={{ width: "100%", height: "100%" }}
      />
      {loadedCount < 20 && (
        <div className="absolute inset-0 flex items-center justify-center text-white/50 bg-botanic-deep z-50">
          Loading... {Math.round((loadedCount / totalFrames) * 100)}%
        </div>
      )}
    </div>
  );
}
