"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-green-50" />

            {/* Decorative Elements */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-6"
                        >
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-primary-dark text-sm font-medium">
                                Free Delivery on All Order
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text leading-tight mb-6">
                            Fresh, Healthy{" "}
                            <span className="text-gradient">Salads</span>
                            <br />
                            Delivered Daily
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-text-muted max-w-lg mx-auto lg:mx-0 mb-8">
                            Nutritious, hygienic & delicious salads made fresh every morning.
                            Fuel your body with the goodness it deserves.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                href="#menu"
                                className="btn-primary text-lg px-8 py-4"
                            >
                                Order Now
                                <svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                    />
                                </svg>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-primary-200 border-2 border-white flex items-center justify-center text-xs font-bold text-primary-dark"
                                        >
                                            {["👩", "👨", "👩‍🦱", "🧑"][i - 1]}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm text-text-muted">
                                    <strong className="text-text">2000+</strong> Happy Customers
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-sm text-text-muted ml-1">4.7/5 Rating</span>
                            </div>
                        </motion.div>

                        {/* Service Areas */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">📍</span>
                                <span className="text-sm font-semibold text-text">Delivering only in these areas</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {["Kharadi", "Ubale Nagar", "Mundhwa", "Keshavnagar", "Wadgaon sheri", "Magarpatta", "Amanora", "Viman Nagar", "Wagholi", "Kalyani Nagar", "Koregaon Park", "Yerwada"].map((area) => (
                                    <span key={area} className="px-2 py-0.5 bg-primary-50 text-primary-dark text-xs rounded-full">
                                        {area}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            {/* Main Image */}
                            <div className="relative z-10 animate-float">
                                <Image
                                    src="/images/power-protein-veg-meal.jpeg"
                                    alt="Fresh healthy salad bowl"
                                    width={500}
                                    height={500}
                                    className="rounded-3xl shadow-2xl"
                                    priority
                                />
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -left-4 top-1/4 z-20 bg-white rounded-2xl shadow-card p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🥬</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted">Made with</p>
                                        <p className="font-semibold text-text">Fresh Veggies</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute -right-4 bottom-1/4 z-20 bg-white rounded-2xl shadow-card p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">⚡</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted">Delivery</p>
                                        <p className="font-semibold text-text">as per your schedule</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Background Circle */}
                            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                                <div className="w-[90%] h-[90%] rounded-full bg-gradient-to-br from-primary-200 to-primary-100 opacity-50" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <Link href="#why-saladly" className="flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors">
                    <span className="text-sm">Scroll to explore</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </Link>
            </motion.div> */}
        </section>
    );
}
