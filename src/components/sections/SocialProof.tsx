"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Review {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    review: string;
    date: string;
    verified: boolean;
}

const reviews: Review[] = [
    {
        id: 1,
        name: "Priya Sharma",
        avatar: "👩",
        rating: 5,
        review:
            "The freshness is unmatched! I've tried many salad delivery services but Saladly stands out. The portions are generous and the dressings are divine.",
        date: "2 days ago",
        verified: true,
    },
    {
        id: 2,
        name: "Rahul Verma",
        avatar: "👨",
        rating: 5,
        review:
            "As a fitness enthusiast, finding high-protein meals was always a challenge. Saladly's Power Protein Bowl is now my post-workout go-to!",
        date: "1 week ago",
        verified: true,
    },
    {
        id: 3,
        name: "Anjali Patel",
        avatar: "👩‍🦱",
        rating: 5,
        review:
            "Love the subscription plan! Saves me so much time on meal prep. The quality is consistent and delivery is always on time.",
        date: "2 weeks ago",
        verified: true,
    },
    {
        id: 4,
        name: "Karan Singh",
        avatar: "🧑",
        rating: 4,
        review:
            "Great variety of options for both veg and non-veg. The app makes ordering super easy. Would love to see more dressing options!",
        date: "3 weeks ago",
        verified: true,
    },
];

const stats = [
    { value: "1000+", label: "Happy Customers" },
    { value: "50,000+", label: "Salads Delivered" },
    { value: "4.9★", label: "Average Rating" },
    { value: "99%", label: "On-Time Delivery" },
];

export default function SocialProof() {
    return (
        <section id="reviews" className="section-padding bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-dark text-sm font-medium rounded-full mb-4">
                        Customer Love
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text mb-4">
                        Trusted by <span className="text-gradient">1000+</span> Healthy Eaters
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Don&apos;t just take our word for it. See what our customers have to
                        say about their Saladly experience.
                    </p>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16"
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-surface-secondary rounded-2xl"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-text-muted">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="card-base p-6 md:p-8"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                                        {review.avatar}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-text">{review.name}</h4>
                                            {review.verified && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-text-muted">{review.date}</p>
                                    </div>
                                </div>
                                {/* Rating */}
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-200"
                                                }`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>

                            {/* Review Text */}
                            <p className="text-text-muted leading-relaxed">&quot;{review.review}&quot;</p>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 md:mt-16 text-center"
                >
                    <p className="text-sm text-text-muted mb-6">
                        Certified & Trusted by Leading Organizations
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        <div className="flex items-center gap-3 text-text-muted">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                                🏛️
                            </div>
                            <span className="font-medium">FSSAI Certified</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-muted">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                                🌿
                            </div>
                            <span className="font-medium">100% Organic</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-muted">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                                ✓
                            </div>
                            <span className="font-medium">ISO 22000</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-muted">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                                🛡️
                            </div>
                            <span className="font-medium">Hygiene Rated</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
