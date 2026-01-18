"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId") || "ORD" + Date.now();
    const paymentMethod = searchParams.get("method") || "online";

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <div className="container-custom py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-lg mx-auto text-center"
                >
                    {/* Success Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="w-12 h-12 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </motion.svg>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-3xl font-display font-bold text-text mb-2"
                    >
                        Order Placed Successfully! 🎉
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-text-muted mb-8"
                    >
                        {paymentMethod === "cod"
                            ? "Your order has been confirmed. Pay on delivery."
                            : "Payment received! Your order is being prepared with love."
                        }
                    </motion.p>

                    {/* Order Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-card p-6 mb-6"
                    >
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <span className="text-sm text-text-muted">Order ID</span>
                            <span className="font-mono font-semibold text-text">{orderId}</span>
                        </div>
                        <div className="flex items-center justify-between py-4 border-b border-gray-100">
                            <span className="text-sm text-text-muted">Payment Method</span>
                            <span className="font-medium text-text">
                                {paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Paid Online"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                            <span className="text-sm text-text-muted">Status</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                ✓ Confirmed
                            </span>
                        </div>
                    </motion.div>

                    {/* What's Next */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-primary-50 rounded-2xl p-6 mb-8"
                    >
                        <h3 className="font-semibold text-primary mb-4">What happens next?</h3>
                        <div className="space-y-3 text-sm text-left">
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                                <p className="text-text-muted">Our kitchen starts preparing your fresh, healthy meal</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                                <p className="text-text-muted">You'll receive a confirmation on WhatsApp</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                                <p className="text-text-muted">Delivery partner will contact you before arrival</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-3"
                    >
                        <Link
                            href="/"
                            className="block w-full py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
                        >
                            Continue Shopping
                        </Link>
                        <a
                            href="https://wa.me/918208747937"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Track on WhatsApp
                        </a>
                    </motion.div>

                    {/* Support */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-sm text-text-muted mt-8"
                    >
                        Need help? Call us at{" "}
                        <a href="tel:+918208747937" className="text-primary hover:underline">
                            +91 82087 47937
                        </a>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
