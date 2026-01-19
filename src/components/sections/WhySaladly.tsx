"use client";

import { motion } from "framer-motion";

const features = [
    {
        icon: "🥬",
        title: "Fresh Ingredients",
        description:
            "Hand-picked vegetables and greens sourced from local organic farms every morning.",
    },
    {
        icon: "⏱️",
        title: "Same-Day Delivery",
        description:
            "Order by 2 PM and get your fresh salad delivered by dinnertime, guaranteed.",
    },
    {
        icon: "💪",
        title: "Nutritionist Approved",
        description:
            "Every recipe is crafted with our team of certified nutritionists for optimal health.",
    },
    {
        icon: "🧼",
        title: "Hygienic Preparation",
        description:
            "FSSAI certified kitchen with strict hygiene protocols and regular quality checks.",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export default function WhySaladly() {
    return (
        <section id="why-saladly" className="section-padding bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-dark text-sm font-medium rounded-full mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text mb-4">
                        Why <span className="text-gradient">Saladly</span>?
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        We&apos;re committed to delivering not just salads, but a healthier
                        lifestyle to your doorstep.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="group card-base card-hover p-6 md:p-8 text-center"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 mx-auto mb-5 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-display font-bold text-text mb-3">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-text-muted leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">✓</span>
                        </div>
                        <div>
                            <p className="font-semibold text-text">FSSAI Certified</p>
                            <p className="text-sm text-text-muted">Food Safety</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🌱</span>
                        </div>
                        <div>
                            <p className="font-semibold text-text">100% Organic</p>
                            <p className="text-sm text-text-muted">Farm Fresh</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🚚</span>
                        </div>
                        <div>
                            <p className="font-semibold text-text">Free Delivery</p>
                            <p className="text-sm text-text-muted">On Every Order</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
