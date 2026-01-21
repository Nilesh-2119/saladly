"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getUserData, saveUserData } from "@/utils/userStorage";

// Dynamic import to prevent SSR hydration issues with Google Maps
const LocationSelector = dynamic(
    () => import("@/components/ui/LocationSelector"),
    {
        ssr: false,
        loading: () => (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
                <div className="animate-pulse">
                    <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-3"></div>
                    <p className="text-sm text-text-muted">Loading map...</p>
                </div>
            </div>
        )
    }
);

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    weight: string;
    calories: number;
    protein: string;
    fat: string;
    carbs: string;
    image: string;
    category: "veg" | "non-veg";
}

// Convert decimal degrees to DMS format (e.g., 18°33'37.8"N)
function toDMS(decimal: number, isLat: boolean): string {
    const direction = isLat ? (decimal >= 0 ? 'N' : 'S') : (decimal >= 0 ? 'E' : 'W');
    const absDecimal = Math.abs(decimal);
    const degrees = Math.floor(absDecimal);
    const minutesDecimal = (absDecimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(1);
    return `${degrees}°${minutes}'${seconds}"${direction}`;
}

// Get full DMS string from coordinates
function getCoordinatesDMS(lat: number, lng: number): string {
    return `${toDMS(lat, true)} ${toDMS(lng, false)}`;
}

// Sample product data - in real app, this would come from URL params or context
const products: Record<number, Product> = {
    1: {
        id: 1,
        name: "Lean Protein Veg Meal",
        description: "Contains 250g Bowl - Paneer/Mushroom/Ripe Fruit (80g), Millets/Noodles/Pasta, Chickpeas/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings, Health and Love",
        price: 199,
        originalPrice: 299,
        weight: "250g Bowl",
        calories: 315,
        protein: "13g",
        fat: "21g",
        carbs: "25g",
        image: "/images/lean-protein-veg-meal.jpeg",
        category: "veg",
    },
    2: {
        id: 2,
        name: "Power Protein Veg Meal",
        description: "Contains 500g Bowl - Paneer/Mushroom/Ripe Fruit (120g), Millets/Noodles/Pasta, Chickpeas/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings, Health and Love",
        price: 229,
        originalPrice: 329,
        weight: "500g Bowl",
        calories: 630,
        protein: "26g",
        fat: "42g",
        carbs: "48g",
        image: "/images/power-protein-veg-meal.jpeg",
        category: "veg",
    },
    3: {
        id: 3,
        name: "Lean Protein Chicken Meal",
        description: "Contains 250g Bowl - Chicken (80g), Millets/Noodles/Pasta, Chickpeas/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings, Health and Love",
        price: 199,
        originalPrice: 299,
        weight: "250g Bowl",
        calories: 280,
        protein: "26g",
        fat: "12g",
        carbs: "24g",
        image: "/images/lean-protein-chicken-meal.jpeg",
        category: "non-veg",
    },
    4: {
        id: 4,
        name: "Power Protein Chicken Meal",
        description: "Contains 500g Bowl - Chicken (150g), Millets/Noodles/Pasta, Chickpeas/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings, Health and Love",
        price: 229,
        originalPrice: 329,
        weight: "500g Bowl",
        calories: 560,
        protein: "52g",
        fat: "24g",
        carbs: "48g",
        image: "/images/power-protein-chicken-meal.jpeg",
        category: "non-veg",
    },
};

interface LocationData {
    lat: number;
    lng: number;
    address: string;
}

export default function TrialOrderPage({
    searchParams,
}: {
    searchParams: { product?: string };
}) {
    const productId = parseInt(searchParams.product || "1");
    const product = products[productId] || products[1];
    const router = useRouter();

    // Form state
    const [quantity, setQuantity] = useState(1);
    const [deliveryDate, setDeliveryDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
    });
    const [mealType, setMealType] = useState<"lunch" | "dinner">("dinner");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState<LocationData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // Address form fields
    const [fullAddress, setFullAddress] = useState("");
    const [deliveryInstructions, setDeliveryInstructions] = useState("");
    const [addressType, setAddressType] = useState<"home" | "work">("home");
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Load saved user data on mount
    useEffect(() => {
        const savedData = getUserData();
        if (savedData) {
            if (savedData.name) setName(savedData.name);
            if (savedData.phone) setPhone(savedData.phone);
            if (savedData.fullAddress) setFullAddress(savedData.fullAddress);
            if (savedData.deliveryInstructions) setDeliveryInstructions(savedData.deliveryInstructions);
            if (savedData.addressType) setAddressType(savedData.addressType);
            if (savedData.location) {
                setLocation(savedData.location);
                setShowAddressForm(true); // Show address form when location is already saved
            }
        }
    }, []);

    // Calculate total
    const total = product.price * quantity;
    const discount = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
    );

    // Get minimum date (tomorrow - no same-day delivery)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    // Handle location selection from map
    const handleLocationSelect = (selectedLocation: LocationData) => {
        setLocation(selectedLocation);
        setShowMap(false);
        setShowAddressForm(true);
    };

    // Handle form submission
    const handleSubmit = async (action: "cart" | "buy") => {
        // Check if location is selected
        if (!location) {
            alert("Please select your delivery location on the map and click 'Confirm Location'");
            return;
        }

        // For Buy Now, check if address form is completed
        if (action === "buy") {
            if (!name || !phone) {
                alert("Please fill in your Full Name and Contact Number in the address form");
                return;
            }
            if (phone.length < 10) {
                alert("Please enter a valid 10-digit phone number");
                return;
            }
            if (!location || !fullAddress) {
                alert("Please complete the delivery address form with Full Address");
                return;
            }
        }

        setIsSubmitting(true);

        if (action === "buy") {
            // Save user data to localStorage for future visits
            saveUserData({
                name,
                phone,
                fullAddress,
                deliveryInstructions,
                addressType,
                location: location ? {
                    lat: location.lat,
                    lng: location.lng,
                    address: location.address
                } : undefined
            });

            // Redirect immediately to checkout (order created after payment)
            const checkoutParams = new URLSearchParams({
                product: productId.toString(),
                quantity: quantity.toString(),
                mealType: mealType,
                date: deliveryDate,
                name: name,
                phone: phone,
                address: location.address,
                lat: location.lat.toString(),
                lng: location.lng.toString(),
                fullAddress: fullAddress,
                instructions: deliveryInstructions,
                addressType: addressType,
                coordinates: getCoordinatesDMS(location.lat, location.lng),
                mapLink: `https://www.google.com/maps/place/${location.lat},${location.lng}`,
            });

            window.location.assign(`/checkout?${checkoutParams.toString()}`);
        } else {
            // Add to cart (simulated)
            await new Promise((resolve) => setTimeout(resolve, 500));
            alert("Added to cart successfully!");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-primary text-white sticky top-0 z-50">
                <div className="container-custom py-4 flex items-center justify-between">
                    <Link href="/#menu" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold">Trial Order</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <a href="https://wa.me/918208747937" target="_blank" rel="noopener noreferrer">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </a>
                        <button className="p-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Info bar */}
                <div className="bg-primary-dark py-2 px-4 text-center text-sm">
                    <span className="mr-4">🔒 Cancel: Lunch by 7AM, Dinner by 2PM (same day)</span>
                    <span>⏱️ Expiry: Double the meal count in days</span>
                </div>
            </header>

            <main className="container-custom py-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Product Card */}
                    <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Product Image */}
                            <div className="relative w-full md:w-64 h-64 md:h-48 flex-shrink-0">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="rounded-xl object-cover"
                                    priority
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQQBBAMBAAAAAAAAAAAAAQACAwQFBhESIRMxQVH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAMBAQEAAAAAAAAAAAAAAAECAwARIf/aAAwDAQACEQMRAD8AxSjDQfHC+2HPZYZKZWjxZzLw24O/iIiaqMmejLp/Z/9k="
                                />
                                {/* Veg/Non-Veg Badge */}
                                <div
                                    className={`absolute top-3 right-3 w-6 h-6 rounded-sm border-2 flex items-center justify-center ${product.category === "veg"
                                        ? "border-green-600"
                                        : "border-red-600"
                                        }`}
                                >
                                    <div
                                        className={`w-3 h-3 rounded-full ${product.category === "veg" ? "bg-green-600" : "bg-red-600"
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                                <h1 className="text-xl md:text-2xl font-display font-bold text-primary mb-2">
                                    {product.name}
                                </h1>
                                <p className="text-sm text-text-muted mb-4 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Nutrition */}
                                <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-4">
                                    <span>🔥 ~{product.calories} kcal</span>
                                    <span>💪 {product.protein} Protein</span>
                                    <span>🧈 {product.fat} Fat</span>
                                    <span>🌾 {product.carbs} Carbs</span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-text">₹{product.price}</span>
                                    <span className="text-lg text-text-muted line-through">₹{product.originalPrice}</span>
                                    <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded">
                                        {discount}% OFF
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Form */}
                    <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-6">
                        <h2 className="text-lg font-display font-bold text-text mb-6">
                            Order Details
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    <span className="px-2 py-0.5 bg-primary text-white text-xs rounded mr-2">Quantity</span>
                                    Number of Dinner meals (default: 1)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="input-field"
                                />
                            </div>

                            {/* Delivery Date */}
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    <span className="px-2 py-0.5 bg-accent text-white text-xs rounded mr-2">Delivery Date</span>
                                    Select your delivery date
                                </label>
                                {/* <p className="text-xs text-primary mb-1">Open All Day</p> */}
                                <input
                                    type="date"
                                    min={minDate}
                                    value={deliveryDate}
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                    className="input-field"
                                />
                            </div>

                            {/* Meal Type */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-text mb-2">
                                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded mr-2">Meal Type</span>
                                    Choose Lunch or Dinner
                                </label>
                                <select
                                    value={mealType}
                                    onChange={(e) => setMealType(e.target.value as "lunch" | "dinner")}
                                    className="input-field"
                                >
                                    <option value="lunch">Lunch (Delivery by 11 AM to 2PM)</option>
                                    <option value="dinner">Dinner (Delivery by 7PM to 9PM)</option>
                                </select>
                            </div>
                        </div>

                        <p className="text-xs text-text-muted mt-4">
                            *Be Assured, you can cancel and reschedule your Meals anytime via website or mobile app.
                        </p>
                    </div>

                    {/* Delivery Address Section */}
                    <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-6">
                        <h2 className="text-lg font-display font-bold text-text mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                                📍
                            </span>
                            Delivery Address
                        </h2>

                        <div className="space-y-5">
                            {/* Delivery Location */}
                            <div>
                                <label className="block text-sm font-medium text-text mb-2">
                                    Delivery Location <span className="text-red-500">*</span>
                                </label>

                                {/* Map Selector - Show when no location or changing */}
                                {(showMap || !location) && (
                                    <LocationSelector
                                        onLocationSelect={handleLocationSelect}
                                    />
                                )}

                                {/* Address Form - Show after location is selected */}
                                {location && !showMap && showAddressForm && (
                                    <div className="border border-gray-200 rounded-2xl overflow-hidden">
                                        {/* Form Header */}
                                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                            <h3 className="font-semibold text-text">Add Delivery Address</h3>
                                            <button
                                                onClick={() => { setShowMap(true); setShowAddressForm(false); }}
                                                className="text-primary text-sm hover:underline"
                                            >
                                                Change Location
                                            </button>
                                        </div>

                                        {/* Map Preview */}
                                        <div className="p-4 bg-green-50 border-b border-gray-200">
                                            <div className="flex items-start gap-2">
                                                <span className="text-primary">📍</span>
                                                <div className="flex-1">
                                                    <p className="text-sm text-green-700 line-clamp-2">{location.address}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="p-4 space-y-4">
                                            {/* Row 1: Full Name + Contact Number */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-primary font-medium mb-1">
                                                        Full Name<span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        placeholder="e.g. Nilesh Kale"
                                                        className="input-field text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-primary font-medium mb-1">
                                                        Contact Number<span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                                        placeholder="9876543210"
                                                        className="input-field text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Full Address */}
                                            <div>
                                                <label className="block text-xs text-primary font-medium mb-1">
                                                    Full Address<span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={fullAddress}
                                                    onChange={(e) => setFullAddress(e.target.value)}
                                                    placeholder="e.g. Flat 101, Blue Heights Society, Kharadi"
                                                    className="input-field text-sm"
                                                />
                                            </div>

                                            {/* Delivery Instructions */}
                                            <div>
                                                <label className="block text-xs text-primary font-medium mb-1">
                                                    Delivery Instructions <span className="text-gray-400">(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={deliveryInstructions}
                                                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                                                    placeholder="e.g. Ring the bell twice, hand over to security if unavailable"
                                                    className="input-field text-sm"
                                                />
                                            </div>

                                            {/* Address Type */}
                                            <div>
                                                <label className="block text-xs text-primary font-medium mb-2">
                                                    Address Type<span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="addressType"
                                                            value="home"
                                                            checked={addressType === "home"}
                                                            onChange={() => setAddressType("home")}
                                                            className="w-4 h-4 text-primary"
                                                        />
                                                        <span className="flex items-center gap-1 text-sm">
                                                            🏠 Home
                                                        </span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="addressType"
                                                            value="work"
                                                            checked={addressType === "work"}
                                                            onChange={() => setAddressType("work")}
                                                            className="w-4 h-4 text-primary"
                                                        />
                                                        <span className="flex items-center gap-1 text-sm">
                                                            💼 Work
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Save Button */}
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    onClick={() => setShowAddressForm(false)}
                                                    className="flex-1 py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 text-sm font-medium"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => setShowAddressForm(false)}
                                                    className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold"
                                                >
                                                    Save Address
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Saved Address Display */}
                                {location && !showMap && !showAddressForm && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{addressType === "home" ? "🏠" : "💼"}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-green-800 mb-1">
                                                    {addressType === "home" ? "Home" : "Work"} Address
                                                </p>
                                                <p className="text-sm text-green-700">
                                                    {fullAddress}
                                                </p>
                                                <p className="text-sm text-green-600">{location.address}</p>
                                                {deliveryInstructions && (
                                                    <p className="text-xs text-green-500 mt-1 italic">"{deliveryInstructions}"</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setShowAddressForm(true)}
                                                className="text-sm text-primary font-medium hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-2xl shadow-card p-4 md:p-6 mb-24 md:mb-6">
                        <h2 className="text-lg font-display font-bold text-text mb-4">
                            Order Summary
                        </h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-muted">{product.name} × {quantity}</span>
                                <span>₹{product.price * quantity}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span>-₹{(product.originalPrice - product.price) * quantity}</span>
                            </div>
                            <div className="flex justify-between text-text-muted">
                                <span>Delivery</span>
                                <span className="text-green-600">FREE</span>
                            </div>
                            <hr className="my-3" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">₹{total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Bottom CTA */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg md:relative md:border-0 md:shadow-none md:p-0 md:bg-transparent">
                        <div className="max-w-4xl mx-auto">
                            <button
                                onClick={() => handleSubmit("buy")}
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    "Buy Now"
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
