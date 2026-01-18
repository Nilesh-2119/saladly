"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
        description: "Paneer/Mushroom/Ripe Fruit (80g), Millets/Noodles/Pasta, Chickpes/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings",
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
        description: "Paneer/Mushroom/Ripe Fruit (120g), Millets/Noodles/Pasta, Chickpes/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings",
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
        description: "Chicken (80g), Millets/Noodles/Pasta, Chickpes/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings",
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
        description: "Chicken (150g), Millets/Noodles/Pasta, Chickpes/Olives, Pomegranates, Dressing, Leaves, Boiled vegetables, Toppings",
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
                                        {/* Category Badge */}
                                        <div
                                            className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center ${product.category === "veg"
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                                }`}
                                        >
                                            <div className="w-2 h-2 bg-white rounded-full" />
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
                    <button className="btn-outline">
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
                </motion.div>
            </div>
        </section>
    );
}
