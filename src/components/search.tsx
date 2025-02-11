"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, X, History, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchItem {
    query: string;
    timestamp: number;
}

const popularCategories = [
    "Phone Cases",
    "Airpod Cases",
    "Chargers",
    "Headphones",
    "Watch Protection"
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

        // Save to recent searches
        const newSearch = { query: query.trim(), timestamp: Date.now() };
        const updatedSearches = [
            newSearch,
            ...recentSearches.filter(item => item.query !== query)
        ].slice(0, 5); // Keep only last 5 searches

        setRecentSearches(updatedSearches);
        sessionStorage.setItem("recentSearches", JSON.stringify(updatedSearches));

        setIsOpen(false);
        router.push(`/search?type=${encodeURIComponent(query)}&available=true&sortBy=price&order=asc&page=1`);
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
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-150"
                                        >
                                            <X className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </div>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSearch(searchQuery);
                                    }}>
                                        <div className="flex gap-3 items-center">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    ref={inputRef}
                                                    type="search"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Type to search..."
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg
                                                             focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent
                                                             transition-all duration-150"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg
                                                         transition-colors duration-150 font-medium disabled:opacity-50
                                                         disabled:cursor-not-allowed"
                                                disabled={!searchQuery.trim()}
                                            >
                                                Search
                                            </button>
                                        </div>

                                        <div className="mt-8 space-y-6">
                                            {recentSearches.length > 0 && (
                                                <div className="space-y-3">
                                                    <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                        <History className="w-4 h-4" />
                                                        Recent Searches
                                                    </h3>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {recentSearches.map(({ query }) => (
                                                            <button
                                                                key={query}
                                                                type="button"
                                                                onClick={() => handleSearch(query)}
                                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200
                                                                         rounded-lg text-sm text-gray-700
                                                                         transition-colors duration-150"
                                                            >
                                                                {query}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-3">
                                                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4" />
                                                    Popular Categories
                                                </h3>
                                                <div className="flex gap-2 flex-wrap">
                                                    {popularCategories.map((category) => (
                                                        <button
                                                            key={category}
                                                            type="button"
                                                            onClick={() => handleSearch(category)}
                                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200
                                                                     rounded-lg text-sm text-gray-700
                                                                     transition-colors duration-150"
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