"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// Product data
const products: Record<number, {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: "veg" | "non-veg";
}> = {
    1: { id: 1, name: "Lean Protein Veg Meal", price: 199, originalPrice: 299, image: "/images/lean-protein-veg-meal.jpeg", category: "veg" },
    2: { id: 2, name: "Power Protein Veg Meal", price: 229, originalPrice: 329, image: "/images/power-protein-veg-meal.jpeg", category: "veg" },
    3: { id: 3, name: "Lean Protein Chicken Meal", price: 199, originalPrice: 299, image: "/images/lean-protein-chicken-meal.jpeg", category: "non-veg" },
    4: { id: 4, name: "Power Protein Chicken Meal", price: 229, originalPrice: 329, image: "/images/power-protein-chicken-meal.jpeg", category: "non-veg" },
};

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    order_id?: string;
    handler: (response: RazorpayResponse) => void;
    prefill: {
        name: string;
        email?: string;
        contact: string;
    };
    notes?: Record<string, string>;
    theme: {
        color: string;
    };
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
}

interface RazorpayInstance {
    open: () => void;
    close: () => void;
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get order details from URL params
    const productId = parseInt(searchParams.get("product") || "1");
    const quantity = parseInt(searchParams.get("quantity") || "1");
    const mealType = searchParams.get("mealType") || "dinner";
    const deliveryDate = searchParams.get("date") || searchParams.get("startDate") || new Date().toISOString().split("T")[0];
    const customerName = searchParams.get("name") || "";
    const customerPhone = searchParams.get("phone") || "";
    const address = searchParams.get("address") || "";
    const flatNo = searchParams.get("flatNo") || "";
    const floor = searchParams.get("floor") || "";
    const building = searchParams.get("building") || "";
    const landmark = searchParams.get("landmark") || "";
    const addressType = searchParams.get("addressType") || "home";

    // Subscription params
    const isSubscription = searchParams.get("type") === "subscription";
    const subscriptionPlan = parseInt(searchParams.get("plan") || "1");
    const pricePerMeal = parseInt(searchParams.get("pricePerMeal") || "199");
    const totalMeals = parseInt(searchParams.get("totalMeals") || "1");
    const totalFromUrl = parseInt(searchParams.get("totalPrice") || "0");
    const schedule = searchParams.get("schedule") || "mon-sun";

    const product = products[productId] || products[1];

    const [isProcessing, setIsProcessing] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [needsAddress, setNeedsAddress] = useState(!customerName || !customerPhone);
    const [formData, setFormData] = useState({
        name: customerName,
        phone: customerPhone,
        flatNo: flatNo,
        floor: floor,
        building: building,
        landmark: landmark,
    });

    // Calculate amounts based on order type
    const subtotal = isSubscription ? totalFromUrl : product.price * quantity;
    const originalTotal = isSubscription ? (299 * totalMeals) : (product.originalPrice * quantity);
    const discount = originalTotal - subtotal;
    const deliveryFee = 0;
    const total = subtotal;

    // Load Razorpay script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setRazorpayLoaded(true);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Handle payment
    const handlePayment = async () => {

        if (!razorpayLoaded || !window.Razorpay) {
            alert("Payment gateway is loading. Please try again.");
            return;
        }

        setIsProcessing(true);

        try {
            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: total * 100, // Razorpay expects amount in paise
                currency: "INR",
                name: "Saladly",
                description: `${product.name} x ${quantity}`,
                image: "/images/logo.png",
                handler: function (response: RazorpayResponse) {
                    // Payment successful
                    router.push(`/order-success?orderId=${response.razorpay_payment_id}&method=online`);
                },
                prefill: {
                    name: customerName,
                    contact: customerPhone,
                },
                notes: {
                    product: product.name,
                    quantity: quantity.toString(),
                    deliveryDate: deliveryDate,
                    mealType: mealType,
                    address: `${flatNo}, ${floor}, ${building}, ${address}`,
                },
                theme: {
                    color: "#22C55E",
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container-custom py-4 flex items-center justify-between">
                    <Link href={`/trial?product=${productId}`} className="flex items-center gap-2 text-text hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">Back</span>
                    </Link>
                    <h1 className="text-lg font-display font-bold text-text">Checkout</h1>
                    <div className="w-16"></div>
                </div>
            </header>

            <main className="container-custom py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* Left Column - Order Details */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Delivery Address Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-card p-5"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-display font-bold text-text flex items-center gap-2">
                                        <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">1</span>
                                        Delivery Address
                                    </h2>
                                    <Link href={`/trial?product=${productId}`} className="text-sm text-primary hover:underline">
                                        Change
                                    </Link>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-xl">{addressType === "home" ? "🏠" : "💼"}</span>
                                        <div>
                                            <p className="font-medium text-text">{customerName}</p>
                                            <p className="text-sm text-text-muted mt-1">
                                                {flatNo && `${flatNo}, `}{floor && `${floor}, `}{building}
                                            </p>
                                            <p className="text-sm text-text-muted">{address}</p>
                                            {landmark && <p className="text-sm text-text-muted">Near: {landmark}</p>}
                                            <p className="text-sm text-text-muted mt-2">📞 +91 {customerPhone}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Order Details Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl shadow-card p-5"
                            >
                                <h2 className="font-display font-bold text-text flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">2</span>
                                    Order Details
                                    {isSubscription && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded">Subscription</span>}
                                </h2>

                                {/* Product */}
                                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                        <div className={`absolute -top-1 -right-1 w-5 h-5 rounded border-2 flex items-center justify-center ${product.category === "veg" ? "border-green-600 bg-white" : "border-red-600 bg-white"
                                            }`}>
                                            <div className={`w-2.5 h-2.5 rounded-full ${product.category === "veg" ? "bg-green-600" : "bg-red-600"
                                                }`} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-text">{product.name}</h3>
                                        {isSubscription ? (
                                            <>
                                                <p className="text-sm text-text-muted mt-1">{totalMeals} Meals @ ₹{pricePerMeal}/meal</p>
                                                <p className="text-sm text-text-muted capitalize">Meal Type: {mealType}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm text-text-muted mt-1">Qty: {quantity}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="font-bold text-text">₹{isSubscription ? pricePerMeal : product.price}</span>
                                            <span className="text-sm text-text-muted line-through">₹{isSubscription ? 299 : product.originalPrice}</span>
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">per meal</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="mt-4 p-4 border border-gray-200 rounded-xl">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-muted">📅 {isSubscription ? "Start Date" : "Delivery Date"}</span>
                                        <span className="font-medium text-text">{new Date(deliveryDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-2">
                                        <span className="text-text-muted">🍽️ Meal Type</span>
                                        <span className="font-medium text-text capitalize">{mealType} {mealType === "both" ? "(Lunch & Dinner)" : mealType === "lunch" ? "(by 12 PM)" : "(by 7 PM)"}</span>
                                    </div>
                                    {isSubscription && (
                                        <>
                                            <div className="flex items-center justify-between text-sm mt-2">
                                                <span className="text-text-muted">📦 Plan</span>
                                                <span className="font-medium text-text">{subscriptionPlan} Meals</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm mt-2">
                                                <span className="text-text-muted">🔄 Schedule</span>
                                                <span className="font-medium text-text capitalize">{schedule.replace("-", " to ")}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </motion.div>

                            {/* Payment Method Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl shadow-card p-5"
                            >
                                <h2 className="font-display font-bold text-text flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">3</span>
                                    Payment Method
                                </h2>

                                {/* Online Payment - Only Option */}
                                <div className="p-4 rounded-xl border-2 border-primary bg-primary-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-text">Pay Online</p>
                                            <p className="text-xs text-text-muted">UPI, Cards, Net Banking, Wallets</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Image src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" width={30} height={20} className="object-contain" />
                                            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                                            <div className="w-8 h-5 bg-red-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Razorpay Badge */}
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-text-muted">
                                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    Secured by Razorpay
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Price Summary */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl shadow-card p-5 sticky top-24"
                            >
                                <h2 className="font-display font-bold text-text mb-4">Price Details</h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Price ({isSubscription ? `${totalMeals} meals` : `${quantity} item${quantity > 1 ? "s" : ""}`})</span>
                                        <span className="text-text">₹{originalTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{discount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Delivery Charges</span>
                                        <span className="text-green-600">FREE</span>
                                    </div>

                                    <hr className="my-3" />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-text">Total Amount</span>
                                        <span className="text-primary">₹{total.toLocaleString()}</span>
                                    </div>

                                    <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg text-center">
                                        🎉 You save ₹{discount.toLocaleString()} on this order!
                                    </p>
                                </div>

                                {/* Pay Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full mt-6 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Pay ₹{total}
                                        </>
                                    )}
                                </button>

                                {/* Trust Badges */}
                                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-text-muted">
                                    <span className="flex items-center gap-1">
                                        🔒 Secure
                                    </span>
                                    <span className="flex items-center gap-1">
                                        ✓ 100% Safe
                                    </span>
                                    <span className="flex items-center gap-1">
                                        ⚡ Instant
                                    </span>
                                </div>
                            </motion.div>

                            {/* Cancellation Policy */}
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                                <p className="font-medium mb-1">📋 Cancellation Policy</p>
                                <p>Cancel Lunch by 7 AM, Dinner by 2 PM (same day). Canceled meals will be carried forward.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-10 h-10 text-primary animate-spin mx-auto" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="mt-3 text-text-muted">Loading checkout...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
