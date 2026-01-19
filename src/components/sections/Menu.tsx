"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// State for full menu modal will be added in component

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
    tags: string[];
    bestseller?: boolean;
}

const products: Product[] = [
    {
        id: 1,
        name: "Lean Protein Veg Meal",
        description: "Paneer/Mushroom/Ripe Fruit (80g), Millets/Noodles/Pasta, Chickpease/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings",
        price: 199,
        originalPrice: 299,
        weight: "250g Bowl",
        calories: 315,
        protein: "13g",
        fat: "21g",
        carbs: "25g",
        image: "/images/lean-protein-veg-meal.jpeg",
        category: "veg",
        tags: ["Low Calorie", "Lean"],
    },
    {
        id: 2,
        name: "Power Protein Veg Meal",
        description: "Paneer/Mushroom/Ripe Fruit (120g), Millets/Noodles/Pasta, Chickpease/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings",
        price: 229,
        originalPrice: 329,
        weight: "500g Bowl",
        calories: 630,
        protein: "26g",
        fat: "42g",
        carbs: "48g",
        image: "/images/power-protein-veg-meal.jpeg",
        category: "veg",
        tags: ["High Protein", "Power Pack"],
    },
    {
        id: 3,
        name: "Lean Protein Chicken Meal",
        description: "Chicken (80g), Millets/Noodles/Pasta, Chickpease/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings",
        price: 199,
        originalPrice: 299,
        weight: "250g Bowl",
        calories: 280,
        protein: "26g",
        fat: "12g",
        carbs: "24g",
        image: "/images/lean-protein-chicken-meal.jpeg",
        category: "non-veg",
        tags: ["Low Fat", "Lean"],
    },
    {
        id: 4,
        name: "Power Protein Chicken Meal",
        description: "Chicken (150g), Millets/Noodles/Pasta, Chickpease/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings",
        price: 229,
        originalPrice: 329,
        weight: "500g Bowl",
        calories: 560,
        protein: "52g",
        fat: "24g",
        carbs: "48g",
        image: "/images/power-protein-chicken-meal.jpeg",
        category: "non-veg",
        tags: ["High Protein", "Bestseller"],
        bestseller: true,
    },
];

const filters = [
    { id: "all", label: "All" },
    { id: "veg", label: "🥬 Vegetarian" },
    { id: "non-veg", label: "🍗 Non-Veg" },
];

export default function Menu() {
    const [activeFilter, setActiveFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [showFullMenu, setShowFullMenu] = useState(false);

    const filteredProducts = products.filter(
        (product) => activeFilter === "all" || product.category === activeFilter
    );

    const handleFilterChange = (filterId: string) => {
        setIsLoading(true);
        setActiveFilter(filterId);
        // Simulate loading for smooth transition
        setTimeout(() => setIsLoading(false), 300);
    };

    return (
        <section id="menu" className="section-padding bg-surface-secondary">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-14"
                >
                    <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-dark text-sm font-medium rounded-full mb-4">
                        Our Menu
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-text mb-4">
                        Explore Our <span className="text-gradient">Fresh Menu</span>
                    </h2>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto">
                        Choose from our carefully crafted salads, each packed with nutrition
                        and bursting with flavor.
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3 mb-10"
                >
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => handleFilterChange(filter.id)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${activeFilter === filter.id
                                ? "bg-primary text-white shadow-lg"
                                : "bg-white text-text hover:bg-gray-50"
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </motion.div>

                {/* Products Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode="wait">
                        {isLoading
                            ? // Skeleton Loaders
                            [...Array(4)].map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="card-base p-4 animate-pulse"
                                >
                                    <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                                    <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded mb-4 w-full" />
                                    <div className="flex justify-between">
                                        <div className="h-6 bg-gray-200 rounded w-1/4" />
                                        <div className="h-10 bg-gray-200 rounded w-1/3" />
                                    </div>
                                </div>
                            ))
                            : // Product Cards
                            filteredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group card-base card-hover overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                        {/* Bestseller Badge */}
                                        {product.bestseller && (
                                            <div className="absolute top-3 left-3 px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                                                Bestseller
                                            </div>
                                        )}
                                        {/* Veg/Non-Veg Badge */}
                                        <div
                                            className={`absolute top-3 right-3 w-6 h-6 rounded border-2 flex items-center justify-center bg-white ${product.category === "veg"
                                                ? "border-green-600"
                                                : "border-red-600"
                                                }`}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${product.category === "veg" ? "bg-green-600" : "bg-red-600"}`} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        {/* Weight Badge */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-text-muted bg-gray-100 px-2 py-1 rounded-full">
                                                {product.weight}
                                            </span>
                                            <div className="flex gap-1">
                                                {product.tags.slice(0, 1).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 bg-primary-50 text-primary-dark text-xs font-medium rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <h3 className="font-display font-bold text-text text-lg mb-2">
                                            {product.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-xs text-text-muted mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        {/* Nutrition Info - Full Macros */}
                                        <div className="grid grid-cols-4 gap-1 text-center mb-4 p-2 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-text-muted">Cal</p>
                                                <p className="text-sm font-semibold text-text">~{product.calories}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-muted">Protein</p>
                                                <p className="text-sm font-semibold text-primary">{product.protein}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-muted">Fat</p>
                                                <p className="text-sm font-semibold text-text">{product.fat}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-text-muted">Carbs</p>
                                                <p className="text-sm font-semibold text-text">{product.carbs}</p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-2xl font-bold text-primary">
                                                ₹{product.price}
                                            </span>
                                            <span className="text-sm text-text-muted line-through">
                                                ₹{product.originalPrice}
                                            </span>
                                        </div>

                                        {/* CTA Buttons - Trial & Subscribe */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/trial?product=${product.id}`}
                                                className="flex-1 py-2 border-2 border-primary text-primary text-sm font-semibold rounded-full hover:bg-primary-50 transition-colors text-center"
                                            >
                                                Trial +
                                            </Link>
                                            <Link
                                                href={`/subscribe?product=${product.id}`}
                                                className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-full transition-colors text-center"
                                            >
                                                Subscribe +
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <button onClick={() => setShowFullMenu(true)} className="btn-outline">
                        View Full Menu
                        <svg
                            className="w-4 h-4 ml-2"
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
                    </button>

                    {/* WhatsApp CTA for customized orders */}
                    <div className="mt-6">
                        <a
                            href="https://wa.me/919011020539?text=Hi!%20I%20want%20to%20order%20a%20customized%20meal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            For customized orders, WhatsApp us
                        </a>
                    </div>
                </motion.div>

                {/* Full Menu Modal */}
                <AnimatePresence>
                    {showFullMenu && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                            onClick={() => setShowFullMenu(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowFullMenu(false)}
                                    className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <Image
                                    src="/full_menu.png"
                                    alt="Saladly Full Menu"
                                    width={800}
                                    height={1200}
                                    className="w-full h-auto"
                                    priority
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
