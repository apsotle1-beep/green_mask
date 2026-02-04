"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import pakistanData from "../data/pakistan_data.json";

interface BuyFormProps {
    onClose?: () => void;
    quantity: number;
}

export default function BuyForm({ onClose, quantity }: BuyFormProps) {
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        city: "",
        area: "",
        address: "",
        landmark: "", // Mashoor Jagah
        quantity: quantity, // Initialize from prop
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Search State
    const [citySearch, setCitySearch] = useState("");
    const [areaSearch, setAreaSearch] = useState("");
    const [isCityOpen, setIsCityOpen] = useState(false);
    const [isAreaOpen, setIsAreaOpen] = useState(false);

    // Derived Data
    const cities = useMemo(() => pakistanData.map((d) => d.city), []);

    const filteredCities = useMemo(() => {
        return cities.filter((c) =>
            c.toLowerCase().includes(citySearch.toLowerCase())
        );
    }, [cities, citySearch]);

    const areas = useMemo(() => {
        const selectedCityData = pakistanData.find((d) => d.city === formData.city);
        return selectedCityData ? selectedCityData.areas : [];
    }, [formData.city]);

    const filteredAreas = useMemo(() => {
        return areas.filter((a) =>
            a.toLowerCase().includes(areaSearch.toLowerCase())
        );
    }, [areas, areaSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCitySelect = (city: string) => {
        setFormData((prev) => ({ ...prev, city, area: "" })); // Reset area on city change
        setCitySearch("");
        setIsCityOpen(false);
    };

    const handleAreaSelect = (area: string) => {
        setFormData((prev) => ({ ...prev, area }));
        setAreaSearch("");
        setIsAreaOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Basic Validation
        if (!formData.name || !formData.phone || !formData.city || !formData.area || !formData.address) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        // Generate Order ID
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const payload = {
            orderId,
            ...formData,
            submittedAt: new Date().toISOString(),
        };

        try {
            // Send to Local API
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSuccess(true);
                // Optional: Reset form or close modal after delay
                setTimeout(() => {
                    if (onClose) onClose();
                }, 2000);
            } else {
                setError("Failed to submit order. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
                <p className="text-gray-600">Your order has been placed successfully.</p>
                <button
                    onClick={onClose}
                    className="mt-6 text-green-600 font-medium hover:underline"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg mx-auto w-full relative">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Customer Ka Address Add Karain</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Order Summary */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-matcha/20 rounded-lg flex items-center justify-center text-matcha">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">Green Mask Stick™</p>
                            <p className="text-sm text-gray-500">PKR 720 x {formData.quantity}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-bold text-matcha">PKR {(720 * formData.quantity).toLocaleString()}</p>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        Contact Details
                    </div>

                    <input
                        type="text"
                        name="name"
                        placeholder="Customer Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-matcha focus:ring-2 focus:ring-matcha/20 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-matcha focus:ring-2 focus:ring-matcha/20 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-matcha focus:ring-2 focus:ring-matcha/20 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                        required
                    />
                    <input
                        type="tel"
                        name="whatsapp"
                        placeholder="Customer Whatsapp Number"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-matcha focus:ring-2 focus:ring-matcha/20 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    />
                </div>

                {/* Address Details */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                        <div className="bg-gray-100 p-2 rounded-full">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        Address Details
                    </div>

                    {/* City Selection */}
                    <div className="relative">
                        <div
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white cursor-pointer flex justify-between items-center"
                            onClick={() => setIsCityOpen(!isCityOpen)}
                        >
                            <span className={formData.city ? "text-gray-800" : "text-gray-400"}>
                                {formData.city || "City"}
                            </span>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${isCityOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <AnimatePresence>
                            {isCityOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-hidden flex flex-col"
                                >
                                    <div className="p-2 border-b border-gray-100">
                                        <div className="flex items-center px-3 bg-gray-50 rounded-lg">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Search City..."
                                                className="w-full p-2 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                                                value={citySearch}
                                                onChange={(e) => setCitySearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto flex-1">
                                        {filteredCities.map((city) => (
                                            <div
                                                key={city}
                                                onClick={() => handleCitySelect(city)}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm"
                                            >
                                                {city}
                                            </div>
                                        ))}
                                        {filteredCities.length === 0 && (
                                            <div className="px-4 py-3 text-gray-400 text-sm text-center">No city found</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Area Selection */}
                    <div className="relative">
                        <div
                            className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-white flex justify-between items-center ${!formData.city ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={() => formData.city && setIsAreaOpen(!isAreaOpen)}
                        >
                            <span className={formData.area ? "text-gray-800" : "text-gray-400"}>
                                {formData.area || "Sector / Block / Area Name"}
                            </span>
                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${isAreaOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        <AnimatePresence>
                            {isAreaOpen && formData.city && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-hidden flex flex-col"
                                >
                                    <div className="p-2 border-b border-gray-100">
                                        <div className="flex items-center px-3 bg-gray-50 rounded-lg">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            <input
                                                type="text"
                                                placeholder="Search Area..."
                                                className="w-full p-2 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                                                value={areaSearch}
                                                onChange={(e) => setAreaSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto flex-1">
                                        {filteredAreas.map((area) => (
                                            <div
                                                key={area}
                                                onClick={() => handleAreaSelect(area)}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm"
                                            >
                                                {area}
                                            </div>
                                        ))}
                                        {filteredAreas.length === 0 && (
                                            <div className="px-4 py-3 text-gray-400 text-sm text-center">No area found</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <textarea
                        name="address"
                        placeholder="Full Address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-matcha focus:ring-2 focus:ring-matcha/20 outline-none transition-all placeholder:text-gray-400 text-gray-800 resize-none"
                        required
                    />

                    <input
                        type="text"
                        name="landmark"
                        placeholder="Mashoor Jagah (Optional)"
                        value={formData.landmark}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-matcha focus:ring-2 focus:ring-matcha/20 outline-none transition-all placeholder:text-gray-400 text-gray-800"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-botanic-deep hover:bg-botanic-deep/90 text-white font-bold text-lg py-4 rounded-full transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                >
                    {loading ? "Placing Order..." : "Done"}
                </button>
            </form>
        </div>
    );
}
