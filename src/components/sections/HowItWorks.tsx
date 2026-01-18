"use client";

import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        icon: "🥗",
        title: "Choose Your Salad",
        description:
            "Browse our menu and pick your favorite salads or subscribe to a weekly/monthly plan.",
    },
    {
        number: "02",
        icon: "👨‍🍳",
        title: "We Prepare Fresh",
        description:
            "Our chefs prepare your salad with fresh ingredients every morning, just before delivery.",
    },
    {
        number: "03",
        icon: "🚚",
        title: "Delivered To Your Door",
        description:
            "Sit back and relax! Your nutritious meal arrives fresh at your doorstep on time.",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="section-padding bg-gradient-to-b from-primary-50 to-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-dark text-sm font-medium rounded-full mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text mb-4">
                        Healthy Eating Made <span className="text-gradient">Simple</span>
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Getting your daily dose of nutrition is as easy as 1-2-3
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden lg:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary via-primary to-primary-dark" />

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative text-center"
                            >
                                {/* Step Number Circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                                    className="relative z-10 w-20 h-20 mx-auto mb-6 bg-white rounded-full shadow-card flex items-center justify-center"
                                >
                                    <span className="text-4xl">{step.icon}</span>
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {step.number}
                                    </div>
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-xl font-display font-bold text-text mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-text-muted leading-relaxed max-w-xs mx-auto">
                                    {step.description}
                                </p>

                                {/* Arrow (Mobile) */}
                                {index < steps.length - 1 && (
                                    <div className="md:hidden flex justify-center my-6">
                                        <svg
                                            className="w-6 h-6 text-primary"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 md:mt-16"
                >
                    <a href="#menu" className="btn-primary text-lg px-8 py-4">
                        Start Your Health Journey
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
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
