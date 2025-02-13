"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

const categoryData = [
    {
        id: 1,
        name: "Phone Cases",
        path: "/collection?category=phone-cases&available=true&limit=20",
        image: "/images/smartphone-case.png",
    },
    {
        id: 2,
        name: "Airpod Cases",
        path: "/collection?category=airpod-cases&available=true&limit=20",
        image: "/images/airpod.png",
    },
    {
        id: 3,
        name: "Chargers",
        path: "/collection?category=chargers&available=true&limit=20",
        image: "/images/icon-category-charging-essentials.png",
    },
    {
        id: 4,
        name: "Headphones and Audio",
        path: "/collection?category=headphones&available=true&limit=20",
        image: "/images/icon-category-audio-music.png",
    },
    {
        id: 5,
        name: "Watch Protection",
        path: "/",
        image: "/images/icon-product-watch.png",
    },
    {
        id: 6,
        name: "Watch Straps",
        path: "/",
        image: "/images/icon-category-watch-bands.png",
    },
];

const Category = () => {
    const [showAll, setShowAll] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Handle screen size changes
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show all items on desktop, and handle mobile visibility with showAll state
    const visibleItems = (!isMobile || showAll) ? categoryData : categoryData.slice(0, 2);

    return (
        <div className="@container w-full py-8 md:py-16  bg-white">
            <div className="max-w-[1280px] mx-auto px-4 py-2">
                {/* Categories Grid */}
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900">
                    Filter by Category
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                    {visibleItems.map((item) => (
                        <Link
                            href={item.path}
                            key={item.id}
                            className="group "
                        >
                            <div className="flex flex-col items-center space-y-3 p-4 border-1 rounded-md
                                          transition-all duration-300 ease-in-out
                                          hover:bg-gray-100 hover:shadow-md">
                                {/* Image Container */}
                                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-full
                                              flex items-center justify-center overflow-hidden
                                              transition-transform duration-300 ease-in-out
                                              group-hover:-translate-y-1">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={48}
                                        height={48}
                                        className="object-contain p-3 w-12 h-12 md:w-14 md:h-14"
                                    />
                                </div>

                                {/* Category Name */}
                                <span className="text-center text-sm md:text-base font-medium
                                               text-gray-800 line-clamp-2 min-h-[2.5rem]">
                                    {item.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Show More/Less Button - Only on Mobile */}
                {isMobile && categoryData.length > 3 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="inline-flex items-center gap-2 px-6 py-2
                                     bg-gray-100 hover:bg-gray-200
                                     rounded-full transition-colors duration-300
                                     text-sm font-medium text-gray-700"
                        >
                            {showAll ? 'Show Less' : 'Show More'}
                            {showAll ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;