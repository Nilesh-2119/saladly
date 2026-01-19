"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
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

interface LocationData {
    lat: number;
    lng: number;
    address: string;
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

// Product data
const products: Record<number, {
    id: number;
    name: string;
    description: string;
    image: string;
    category: "veg" | "non-veg";
    nutrition: { calories: string; protein: string; fat: string; carbs: string };
    contains: string;
}> = {
    1: {
        id: 1,
        name: "Lean Protein Veg Meal",
        description: "250g Bowl - Paneer/Mushroom/Ripe Fruit(80g), Millets/Noodles/Pasta, Chickpes/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings, Health and Love",
        image: "/images/lean-protein-veg-meal.jpeg",
        category: "veg",
        nutrition: { calories: "~315 kcal", protein: "13g", fat: "21g", carbs: "25g" },
        contains: "Paneer/Mushroom/Ripe Fruit(80g), Millets/Noodles/Pasta, Chickpes/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings, Health and Love"
    },
    2: {
        id: 2,
        name: "Power Protein Veg Meal",
        description: "300g Bowl with extra protein and nutrients",
        image: "/images/power-protein-veg-meal.jpeg",
        category: "veg",
        nutrition: { calories: "~420 kcal", protein: "22g", fat: "18g", carbs: "35g" },
        contains: "Paneer/Tofu/Soya, Quinoa/Millets, Mixed Greens, Roasted Chickpeas, Nuts, Dressing"
    },
    3: {
        id: 3,
        name: "Lean Protein Chicken Meal",
        description: "250g Bowl with grilled chicken",
        image: "/images/lean-protein-chicken-meal.jpeg",
        category: "non-veg",
        nutrition: { calories: "~350 kcal", protein: "28g", fat: "15g", carbs: "20g" },
        contains: "Grilled Chicken(100g), Millets/Noodles, Mixed Greens, Cherry Tomatoes, Dressing"
    },
    4: {
        id: 4,
        name: "Power Protein Chicken Meal",
        description: "300g Bowl with extra chicken protein",
        image: "/images/power-protein-chicken-meal.jpeg",
        category: "non-veg",
        nutrition: { calories: "~480 kcal", protein: "38g", fat: "18g", carbs: "28g" },
        contains: "Grilled Chicken(150g), Quinoa, Mixed Greens, Avocado, Nuts, Dressing"
    },
};

// Subscription plans
const leanPlans = [
    { meals: 60, pricePerMeal: 179, discount: "₹7200+ OFF", originalPrice: 299 },
    { meals: 30, pricePerMeal: 189, discount: "₹3300+ OFF", originalPrice: 299 },
    { meals: 20, pricePerMeal: 199, discount: "₹2000+ OFF", originalPrice: 299 },
    { meals: 10, pricePerMeal: 209, discount: "₹900+ OFF", originalPrice: 299 },
    { meals: 1, pricePerMeal: 219, discount: "₹80+ OFF", originalPrice: 299 },
];

const powerPlans = [
    { meals: 60, pricePerMeal: 189, discount: "₹8400+ OFF", originalPrice: 329 },
    { meals: 30, pricePerMeal: 199, discount: "₹3900+ OFF", originalPrice: 329 },
    { meals: 20, pricePerMeal: 209, discount: "₹2400+ OFF", originalPrice: 329 },
    { meals: 10, pricePerMeal: 219, discount: "₹1100+ OFF", originalPrice: 329 },
    { meals: 1, pricePerMeal: 229, discount: "₹100+ OFF", originalPrice: 329 },
];

const deliverySchedules = [
    { id: "mon-sun", label: "Mon-Sun", days: 7 },
    { id: "mon-sat", label: "Mon-Sat", days: 6 },
    { id: "mon-fri", label: "Mon-Fri", days: 5 },
    { id: "custom", label: "Custom", days: 0 },
];

function SubscribeContent() {
    const searchParams = useSearchParams();
    const productId = parseInt(searchParams.get("product") || "1");
    const product = products[productId] || products[1];

    // Determine plans based on product name
    const plans = product.name.toLowerCase().includes("power") ? powerPlans : leanPlans;

    // Step state - start at step 1
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    // Form state
    const [selectedPlan, setSelectedPlan] = useState(plans[0]);
    const [mealType, setMealType] = useState<"lunch" | "dinner" | "both">("lunch");
    const [quantityPerDelivery, setQuantityPerDelivery] = useState(1);
    const [deliverySchedule, setDeliverySchedule] = useState("mon-sun");
    const [customDays, setCustomDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
    const [startDate, setStartDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    });

    // User details state (same as trial page)
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState<LocationData | null>(null);
    const [showMap, setShowMap] = useState(false);
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
            }
        }
    }, []);

    // Calculate total
    const totalMeals = selectedPlan.meals * quantityPerDelivery * (mealType === "both" ? 2 : 1);
    const totalPrice = selectedPlan.pricePerMeal * totalMeals;
    const savings = (selectedPlan.originalPrice - selectedPlan.pricePerMeal) * totalMeals;

    // Get minimum date (tomorrow)
    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    // Handle location selection from map
    const handleLocationSelect = (selectedLocation: LocationData) => {
        setLocation(selectedLocation);
        setShowMap(false);
        setShowAddressForm(true);
    };

    // Handle proceed to checkout
    const handleProceed = async () => {
        // Validate user details (same as trial page)
        if (!location) {
            alert("Please select your delivery location on the map and click 'Confirm Location'");
            return;
        }
        if (!name || !phone) {
            alert("Please fill in your Full Name and Contact Number");
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

        // Generate temporary Order ID client-side (will be replaced by server-generated one)
        const tempOrderId = `S-${Date.now().toString().slice(-6)}`;

        // Fire API request in background (don't wait for response)
        fetch('/api/submit-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: new Date().toISOString(),
                paymentStatus: 'Abandoned Cart',
                name: name,
                phone: phone,
                address: fullAddress,
                coordinates: getCoordinatesDMS(location.lat, location.lng),
                mapLink: `https://www.google.com/maps/place/${location.lat},${location.lng}`,
                details: `${product.name} | ${selectedPlan.meals} Meals (₹${selectedPlan.pricePerMeal}/meal) | ${mealType} | ${quantityPerDelivery}/day | ${deliverySchedule === "custom" ? customDays.join(", ").toUpperCase() : deliverySchedule.toUpperCase()}`,
                amount: totalPrice.toString(),
                startDate: startDate,
                deliveryInstructions: deliveryInstructions
            }),
            keepalive: true // Ensures request completes even after navigation
        }).catch(err => console.error("Failed to save lead:", err));

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

        // Redirect immediately without waiting for API response
        const checkoutParams = new URLSearchParams({
            orderId: tempOrderId,
            product: productId.toString(),
            type: "subscription",
            plan: selectedPlan.meals.toString(),
            pricePerMeal: selectedPlan.pricePerMeal.toString(),
            mealType: mealType,
            quantity: quantityPerDelivery.toString(),
            schedule: deliverySchedule === "custom" ? customDays.join(",") : deliverySchedule,
            startDate: startDate,
            totalMeals: totalMeals.toString(),
            totalPrice: totalPrice.toString(),
            name: name,
            phone: phone,
            address: location.address,
            lat: location.lat.toString(),
            lng: location.lng.toString(),
            fullAddress: fullAddress,
            instructions: deliveryInstructions,
            addressType: addressType,
        });
        window.location.assign(`/checkout?${checkoutParams.toString()}`);
    };

    // Progress bar component
    const ProgressBar = () => (
        <div className="bg-white border-b border-gray-200 py-4">
            <div className="container-custom">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step < currentStep
                                    ? "bg-primary text-white"
                                    : step === currentStep
                                        ? "bg-primary text-white ring-4 ring-primary-50"
                                        : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {step < currentStep ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    step
                                )}
                            </div>
                            {step < 3 && (
                                <div className={`w-12 md:w-20 h-1 mx-1 ${step < currentStep ? "bg-primary" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-center text-sm text-text-muted mt-2">
                    Step {currentStep} of {totalSteps}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-primary text-white sticky top-0 z-50">
                <div className="container-custom py-4 flex items-center justify-between">
                    <Link href="/#menu" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-semibold">{product.name}</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="https://wa.me/918208747937" target="_blank" className="hover:opacity-80">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </Link>
                        <button className="text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Info Banner */}
            <div className="bg-gray-100 py-2 text-xs text-center flex flex-wrap justify-center gap-4 px-4">
                <span className="flex items-center gap-1">
                    🔒 Cancel: Lunch by 7AM, Dinner by 2PM (same day)
                </span>
                <span className="flex items-center gap-1">
                    ⏰ Expiry: Double the meal count in days
                </span>
            </div>

            {/* Progress Bar */}
            <ProgressBar />

            <main className="container-custom py-6">
                <div className="max-w-3xl mx-auto">
                    {/* Product Card - Always visible */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-card p-5 mb-6"
                    >
                        <div className="flex gap-4">
                            <div className="relative w-28 h-28 md:w-36 md:h-36 flex-shrink-0">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="rounded-xl object-cover"
                                />
                                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded border-2 flex items-center justify-center ${product.category === "veg" ? "border-green-600 bg-white" : "border-red-600 bg-white"
                                    }`}>
                                    <div className={`w-3 h-3 rounded-full ${product.category === "veg" ? "bg-green-600" : "bg-red-600"}`} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h2 className="font-display font-bold text-lg text-text">{product.name}</h2>
                                <p className="text-sm text-primary mt-1">Contains</p>
                                <p className="text-xs text-text-muted mt-1 line-clamp-3">{product.contains}</p>
                                <p className="text-xs text-text-muted mt-2">{product.nutrition.calories} | {product.nutrition.protein} Protein | {product.nutrition.fat} Fat | {product.nutrition.carbs} Carbs</p>
                                <p className="text-sm font-medium text-text mt-2">Lunch/Dinner</p>
                                {currentStep === 1 && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xl font-bold text-text">₹{selectedPlan.pricePerMeal}</span>
                                        <span className="text-sm text-text-muted line-through">₹{selectedPlan.originalPrice}</span>
                                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">{selectedPlan.discount}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Step Content */}
                    <AnimatePresence mode="wait">
                        {/* Step 1: Meal Selection */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                {/* Meal Count Selection */}
                                <div className="bg-white rounded-2xl shadow-card p-5">
                                    <h3 className="font-display font-bold text-text mb-4 flex items-center gap-2">
                                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Step 1 of 3</span>
                                        You can still increase number of meals you would want to subscribe for.
                                    </h3>

                                    {/* Large Number Display */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={selectedPlan.meals}
                                            readOnly
                                            className="w-full py-4 px-6 text-3xl font-bold text-center border-2 border-gray-200 rounded-xl bg-gray-50 text-text focus:outline-none"
                                        />
                                    </div>

                                    {/* Quick Select Buttons */}
                                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                                        {plans.map((plan) => (
                                            <button
                                                key={plan.meals}
                                                onClick={() => setSelectedPlan(plan)}
                                                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${selectedPlan.meals === plan.meals
                                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                    : "bg-gray-100 text-text-muted hover:bg-gray-200"
                                                    }`}
                                            >
                                                {plan.meals}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Price per meal info */}
                                    <p className="text-center text-sm text-text-muted mt-3">
                                        ₹{selectedPlan.pricePerMeal}/meal • <span className="text-green-600 font-medium">{selectedPlan.discount}</span>
                                    </p>
                                </div>

                                {/* Meal Type Selection */}
                                <div className="bg-white rounded-2xl shadow-card p-5">
                                    <h3 className="font-display font-bold text-text mb-4 flex items-center gap-2">
                                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Step 1 of 3</span>
                                        Please choose Lunch, Dinner or Both
                                    </h3>

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex flex-wrap gap-3">
                                            {(["lunch", "dinner", "both"] as const).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setMealType(type)}
                                                    className={`px-6 py-3 rounded-lg font-medium transition-all ${mealType === type
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-text hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {type.charAt(0).toUpperCase() + type.slice(1)} {mealType === type && "✓"}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-text-muted">Quantity per delivery</span>
                                            <div className="flex items-center border rounded-lg">
                                                <button
                                                    onClick={() => setQuantityPerDelivery(Math.max(1, quantityPerDelivery - 1))}
                                                    className="px-3 py-2 text-primary hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-2 font-medium">{quantityPerDelivery}</span>
                                                <button
                                                    onClick={() => setQuantityPerDelivery(Math.min(5, quantityPerDelivery + 1))}
                                                    className="px-3 py-2 text-primary hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Delivery Schedule */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="bg-white rounded-2xl shadow-card p-5">
                                    <h3 className="font-display font-bold text-text mb-4 flex items-center gap-2">
                                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Step 2 of 3</span>
                                        How often do you want your deliveries?
                                    </h3>
                                    {/* <p className="text-sm text-primary mb-4">Open All Day</p> */}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {deliverySchedules.map((schedule) => (
                                            <button
                                                key={schedule.id}
                                                onClick={() => setDeliverySchedule(schedule.id)}
                                                className={`px-4 py-3 rounded-lg font-medium transition-all ${deliverySchedule === schedule.id
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-text hover:bg-gray-200"
                                                    }`}
                                            >
                                                {schedule.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Days Selector */}
                                    {deliverySchedule === "custom" && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="mt-4 pt-4 border-t border-gray-200"
                                        >
                                            <p className="text-sm font-medium text-text mb-3">Select your delivery days:</p>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {[
                                                    { id: "mon", label: "Mon" },
                                                    { id: "tue", label: "Tue" },
                                                    { id: "wed", label: "Wed" },
                                                    { id: "thu", label: "Thu" },
                                                    { id: "fri", label: "Fri" },
                                                    { id: "sat", label: "Sat" },
                                                    { id: "sun", label: "Sun" },
                                                ].map((day) => (
                                                    <button
                                                        key={day.id}
                                                        onClick={() => {
                                                            setCustomDays(prev =>
                                                                prev.includes(day.id)
                                                                    ? prev.filter(d => d !== day.id)
                                                                    : [...prev, day.id]
                                                            );
                                                        }}
                                                        className={`w-12 h-12 rounded-full font-medium text-sm transition-all ${customDays.includes(day.id)
                                                            ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                            : "bg-gray-100 text-text hover:bg-gray-200"
                                                            }`}
                                                    >
                                                        {day.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {customDays.length === 0 && (
                                                <p className="text-xs text-red-500 mt-2 text-center">Please select at least one day</p>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Start Date */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="bg-white rounded-2xl shadow-card p-5">
                                    <h3 className="font-display font-bold text-text mb-4 flex items-center gap-2">
                                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Step 3 of 3</span>
                                        When do you want to start?
                                    </h3>
                                    <p className="text-sm text-primary mb-2">*Tomorrow</p>

                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={getMinDate()}
                                        className="w-full p-4 border border-gray-300 rounded-xl text-text focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />

                                    <p className="text-sm text-primary mt-4">
                                        *Be Assured, you can cancel and reschedule your Meals anytime via website or mobile app.
                                    </p>
                                </div>

                                {/* Delivery Address Section (same as trial page) */}
                                <div className="bg-white rounded-2xl shadow-card p-5">
                                    <h3 className="font-display font-bold text-text mb-4 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                                            📍
                                        </span>
                                        Delivery Address
                                    </h3>

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
                                                        <h4 className="font-semibold text-text">Add Delivery Address</h4>
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
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-white rounded-2xl shadow-card p-5">
                                    <h3 className="font-display font-bold text-text mb-3">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Plan</span>
                                            <span className="font-medium">{selectedPlan.meals} Meals @ ₹{selectedPlan.pricePerMeal}/meal</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Meal Type</span>
                                            <span className="font-medium capitalize">{mealType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Quantity/Delivery</span>
                                            <span className="font-medium">{quantityPerDelivery}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Schedule</span>
                                            <span className="font-medium">
                                                {deliverySchedules.find(s => s.id === deliverySchedule)?.label}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Start Date</span>
                                            <span className="font-medium">{new Date(startDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="flex justify-between">
                                            <span className="text-text-muted">Total Meals</span>
                                            <span className="font-bold">{totalMeals}</span>
                                        </div>
                                        <div className="flex justify-between text-lg">
                                            <span className="font-bold text-text">Total</span>
                                            <span className="font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-green-600 text-center mt-2">You save ₹{savings.toLocaleString()}!</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-6">
                        {currentStep > 1 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="flex-1 py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary-50 transition-colors"
                            >
                                Back
                            </button>
                        )}
                        {currentStep < totalSteps ? (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                onClick={handleProceed}
                                className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
                            >
                                Buy Now
                            </button>
                        )}
                    </div>

                    {/* Footer Note */}
                    <p className="text-xs text-text-muted text-center mt-6">
                        Please remember you can add or cancel order as late as 7AM for Lunch and 2PM for Dinner. Early orders can be booked or rescheduled at any time.
                    </p>
                </div>
            </main >
        </div >
    );
}

export default function SubscribePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-10 h-10 text-primary animate-spin mx-auto" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="mt-3 text-text-muted">Loading subscription...</p>
                </div>
            </div>
        }>
            <SubscribeContent />
        </Suspense>
    );
}
