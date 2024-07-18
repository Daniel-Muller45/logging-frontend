"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FlipWords = ({
                       words,
                       duration = 3000,
                       className,
                   }: {
    words: string[];
    duration?: number;
    className?: string;
}) => {
    const initialWord = words.length > 0 ? words[0] : "";
    const [currentWord, setCurrentWord] = useState(initialWord);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    const startAnimation = useCallback(() => {
        if (words.length === 0) return;
        const currentIndex = words.indexOf(currentWord);
        const nextWord = words[currentIndex + 1] || words[0];
        setCurrentWord(nextWord);
        setIsAnimating(true);
    }, [currentWord, words]);

    useEffect(() => {
        if (!isAnimating) {
            const timer = setTimeout(() => {
                startAnimation();
            }, duration);
            return () => clearTimeout(timer); // Clean up the timeout on unmount
        }
    }, [isAnimating, duration, startAnimation]);

    if (words.length === 0) {
        return null;
    }

    return (
        <AnimatePresence
            onExitComplete={() => {
                setIsAnimating(false);
            }}
        >
            <motion.div
                initial={{
                    opacity: 0,
                    y: 10,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                }}
                exit={{
                    opacity: 0,
                    y: -40,
                    x: 40,
                    filter: "blur(8px)",
                    scale: 2,
                    position: "absolute",
                }}
                className={cn(
                    "z-10 inline-block relative text-left text-xl text-white dark:text-white px-2",
                    className
                )}
                key={currentWord}
            >
                {currentWord.split(/( )/).map((letter, index) => (
                    <motion.span
                        key={currentWord + index}
                        initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{
                            delay: index * 0.08,
                            duration: 0.4,
                        }}
                        className="inline-block"
                    >
                        {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default FlipWords;
