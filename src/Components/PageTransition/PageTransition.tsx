"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    animate: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? "-100%" : "100%",
        opacity: 0,
    }),
};

const pageTransition = {
    type: "tween",
    duration: 0.6,
    ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
};

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    // Determine direction based on page order: home (0) -> upcoming (1) -> releases (2)
    const getPageOrder = (path: string) => {
        if (path === "/") return 0;
        if (path === "/upcoming") return 1;
        if (path === "/releases") return 2;
        return 0;
    };

    const currentPageOrder = getPageOrder(pathname);

    return (
        <AnimatePresence mode="wait" custom={currentPageOrder}>
            <motion.div
                key={pathname}
                custom={currentPageOrder}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransition}
                className="absolute inset-0 w-full h-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
