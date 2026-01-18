"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Plan {
    id: string;
    name: string;
    description: string;
    price: number;
    period: string;
    originalPrice?: number;
    features: string[];
    popular?: boolean;
    savings?: string;
}

const plans: Plan[] = [
    {
        id: "weekly",
        name: "Weekly Starter",
        description: "Perfect for trying out healthy eating",
        price: 1499,
        period: "week",
        originalPrice: 1749,
        features: [
            "5 meals per week",
            "Choose any salad from menu",
            "Free delivery",
            "Flexible scheduling",
            "Cancel anytime",
        ],
        savings: "Save ₹250",
    },
    {
        id: "monthly",
        name: "Monthly Health Plan",
        description: "Best value for committed health enthusiasts",
        price: 4999,
        period: "month",
        originalPrice: 6249,
        features: [
            "20 meals per month",
            "Priority delivery slots",
            "Free premium dressings",
            "Nutritionist consultation",
            "Exclusive member discounts",
            "Pause subscription anytime",
        ],
        popular: true,
        savings: "Save ₹1250",
    },
    {
        id: "corporate",
        name: "Corporate Wellness",
        description: "Healthy meals for your team",
        price: 3999,
        period: "10 meals",
        features: [
            "Bulk ordering (10+ meals)",
            "Custom menu options",
            "Meeting catering",
            "Dedicated account manager",
            "Invoice billing",
        ],
    },
];

export default function Subscription() {
    return (
        <section id="subscription" className="section-padding bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-dark text-sm font-medium rounded-full mb-4">
                        Subscription Plans
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text mb-4">
                        Subscribe & <span className="text-gradient">Save More</span>
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Join thousands of health-conscious individuals who&apos;ve made
                        Saladly a part of their daily routine.
                    </p>
                </motion.div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className={`relative card-base overflow-hidden ${plan.popular
                                    ? "ring-2 ring-primary shadow-xl scale-105 z-10"
                                    : ""
                                }`}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-primary-dark text-white text-center py-2 text-sm font-semibold">
                                    🔥 Most Popular
                                </div>
                            )}

                            <div className={`p-6 md:p-8 ${plan.popular ? "pt-14" : ""}`}>
                                {/* Plan Name */}
                                <h3 className="text-xl font-display font-bold text-text mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-sm text-text-muted mb-6">{plan.description}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-text">
                                            ₹{plan.price.toLocaleString()}
                                        </span>
                                        <span className="text-text-muted">/{plan.period}</span>
                                    </div>
                                    {plan.originalPrice && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-text-muted line-through">
                                                ₹{plan.originalPrice.toLocaleString()}
                                            </span>
                                            {plan.savings && (
                                                <span className="text-xs font-semibold text-primary bg-primary-50 px-2 py-0.5 rounded-full">
                                                    {plan.savings}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <svg
                                                className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="text-sm text-text-muted">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Link
                                    href="#lead-capture"
                                    className={`w-full text-center py-3 rounded-full font-semibold transition-all duration-300 ${plan.popular
                                            ? "btn-primary"
                                            : "bg-gray-100 text-text hover:bg-primary hover:text-white"
                                        }`}
                                >
                                    Start Healthy Today
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Guarantee Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 flex flex-col items-center gap-3"
                >
                    <div className="flex items-center gap-2 text-text-muted">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="font-medium">100% Satisfaction Guarantee</span>
                    </div>
                    <p className="text-sm text-text-muted">
                        Not happy? Get a full refund within 7 days, no questions asked.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
