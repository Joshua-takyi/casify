"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface ProductDetailsProps {
    details?: string[];
    materials?: string[];
    features?: string[];
}

export default function ProductDetails({
                                           details = [],
                                           materials = [],
                                           features = [],
                                       }: ProductDetailsProps) {
    const [openSection, setOpenSection] = useState<string | null>(null);

    const accordionVariants = {
        hidden: {
            height: 0,
            opacity: 0,
            transition: { duration: 0.3, ease: "easeOut" },
        },
        visible: {
            height: "auto",
            opacity: 1,
            transition: { duration: 0.3, ease: "easeIn" },
        },
    };

    const sections = [
        { id: "details", title: "Details", content: details },
        { id: "materials", title: "Materials", content: materials },
        { id: "features", title: "Features", content: features },
    ];

    return (
        <div className="bg-white  font-family-apercu-pro">
            <div className="space-y-4">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        className="border border-gray-200 rounded-md overflow-hidden"
                    >
                        <button
                            onClick={() =>
                                setOpenSection(openSection === section.id ? null : section.id)
                            }
                            className="w-full flex justify-between items-center px-4 py-3  hover:bg-gray-100 transition-colors"
                        >
              <span className="text-sm font-medium text-gray-900">
                {section.title}
              </span>
                            <motion.span
                                animate={{ rotate: openSection === section.id ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                            </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                            {openSection === section.id && (
                                <motion.div
                                    variants={accordionVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <ul className="px-4 py-3 space-y-2">
                                        {section.content.length > 0 ? (
                                            section.content.map((item, index) => (
                                                <li key={index} className="text-sm text-gray-700">
                                                    {item}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-sm text-gray-500">
                                                No {section.title.toLowerCase()} available.
                                            </li>
                                        )}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
