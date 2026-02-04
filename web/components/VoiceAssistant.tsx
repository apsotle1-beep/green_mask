"use client";

import { useGeminiLive } from "@/hooks/use-gemini-live";
import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceAssistantProps {
    quantity: number;
    setQuantity: (q: number) => void;
    onCheckout: () => void;
}

const PRODUCT_INFO = `
Product: Green Mask Stick
Price: PKR 720
Description: The viral deep-cleaning solution. Contains organic green tea extract, kaolin clay, vitamin E.
Features: Rotating head for mess-free application, dissolves blackheads, controls oil, balances pH. 7-Day return policy. Cash on Delivery only.
Usage: Spin out paste, apply evenly, leave for 10 minutes, rinse.
`;

export default function VoiceAssistant({ quantity, setQuantity, onCheckout }: VoiceAssistantProps) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const handleToolCall = useCallback(async (name: string, args: any) => {
        console.log("Handling tool:", name, args);
        if (name === "update_order_quantity") {
            setQuantity(args.quantity);
            return { status: "updated", quantity: args.quantity };
        }
        if (name === "ask_checkout") {
            onCheckout();
            return { status: "checkout_opened" };
        }
        return { error: "Unknown tool" };
    }, [setQuantity, onCheckout]);

    const { connect, disconnect, isActive } = useGeminiLive({
        apiKey,
        onToolCall: handleToolCall,
        systemInstruction: `You are a helpful sales assistant for the Green Mask Stick. 
    Current product info: ${PRODUCT_INFO}.
    Current user cart quantity: ${quantity}.
    Currency is PKR.
    When the user wants to add items, use the update_order_quantity tool. confirm the action to the user verbally. 
    If the user asks to checkout or buy, use the ask_checkout tool.
    Be concise, friendly, and enthusiastic. Speak in a natural, conversational tone.
    The user can speak to you to order.
    `,
    });

    const toggle = () => {
        if (isActive) {
            disconnect();
        } else {
            connect();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="mb-2 bg-black/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10"
                    >
                        Listening...
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={toggle}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${isActive ? "bg-red-500 hover:bg-red-600" : "bg-matcha hover:bg-[#86b535]"
                    }`}
            >
                {/* Pulse Effect when Active */}
                {isActive && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                )}

                {/* Icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-8 h-8 text-white transition-transform ${isActive ? "scale-110" : "scale-100"}`}
                >
                    {isActive ? (
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        // Stop icon for variety? Or just keep Mic but Red? 
                        // Let's us a waveform or simply the mic.
                    ) : (
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    )}
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
            </button>
        </div>
    );
}
