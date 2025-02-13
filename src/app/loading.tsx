"use client";
import { motion } from "framer-motion";

export default function Loading() {
    const circleVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2
            }
        }
    };

    const dotVariants = {
        initial: { scale: 0 },
        animate: {
            scale: [0, 1, 0],
            transition: {
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className="flex items-center justify-center gap-2 h-screen"
            variants={circleVariants}
            initial="initial"
            animate="animate"
        >
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="size-3 rounded-full bg-blue-500"
                    variants={dotVariants}
                    style={{
                        backgroundColor: `hsl(${210 + i * 30}, 100%, 50%)`
                    }}
                />
            ))}
        </motion.div>
    );
}