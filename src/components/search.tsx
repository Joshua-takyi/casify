"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    XMarkIcon,
    ClockIcon,
    ChartBarIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface SearchItem {
    query: string;
    timestamp: number;
}

const popularCategories = [
    "Phone Case",
    "Airpod Case",
    "Chargers",
    "Headphones",
    "Watch Protection",
];

export default function SearchComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedSearches = sessionStorage.getItem("recentSearches");
            if (storedSearches) {
                setRecentSearches(JSON.parse(storedSearches));
            }
        }
    }, []);

    const handleSearch = (query: string) => {
        if (!query.trim()) return;

        // Use the query as typed without forcing lower case.
        const normalizedQuery = query.trim();
        // Save to recent searches, ensuring no duplicate entries.
        const newSearch = { query: normalizedQuery, timestamp: Date.now() };
        const updatedSearches = [
            newSearch,
            ...recentSearches.filter((item) => item.query !== normalizedQuery),
        ].slice(0, 5);

        setRecentSearches(updatedSearches);
        sessionStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

        setIsOpen(false);
        // Push the raw search query. The server’s BuildQuery function should
        // transform it into a flexible regex (e.g. handling spaces vs. hyphens, etc.)
        router.push(
            `/search?type=${encodeURIComponent(
                normalizedQuery
            )}&available=true&sortBy=price&sortOrder=asc&page=1`
        );
    };

    useEffect(() => {
        if (isOpen) {
            const timeoutId = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-label="Toggle search"
                className="p-2 hover:bg-[#f4f4f4] rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#e4e4e4]"
            >
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-700" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            className="fixed inset-x-0 top-0 bg-white shadow-lg z-50"
                            initial={{ y: "-100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            Search Products
                                        </h2>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="p-2 hover:bg-[#f4f4f4] rounded-full transition-colors duration-150"
                                        >
                                            <XMarkIcon className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSearch(searchQuery);
                                        }}
                                    >
                                        <div className="flex gap-3 items-center">
                                            <div className="relative flex-1">
                                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    ref={inputRef}
                                                    type="search"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Type to search..."
                                                    className="w-full pl-12 pr-4 py-3 bg-[#f4f4f4] border border-[#e4e4e4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e4e4e4] focus:border-transparent transition-all duration-150"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={!searchQuery.trim()}
                                            >
                                                Search
                                            </button>
                                        </div>

                                        <div className="mt-8 space-y-6">
                                            {recentSearches.length > 0 && (
                                                <div className="space-y-3">
                                                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                        <ClockIcon className="w-4 h-4" />
                                                        Recent Searches
                                                    </h3>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {recentSearches.map(({ query }) => (
                                                            <button
                                                                key={query}
                                                                type="button"
                                                                onClick={() => handleSearch(query)}
                                                                className="px-4 py-2 bg-[#f4f4f4] hover:bg-[#e4e4e4] rounded-lg text-sm text-gray-700 transition-colors duration-150"
                                                            >
                                                                {query}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <ChartBarIcon className="w-4 h-4" />
                                                    Popular Categories
                                                </h3>
                                                <div className="flex gap-2 flex-wrap">
                                                    {popularCategories.map((category) => (
                                                        <button
                                                            key={category}
                                                            type="button"
                                                            onClick={() => handleSearch(category)}
                                                            className="px-4 py-2 bg-[#f4f4f4] hover:bg-[#e4e4e4] rounded-lg text-sm text-gray-700 transition-colors duration-150"
                                                        >
                                                            {category}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
