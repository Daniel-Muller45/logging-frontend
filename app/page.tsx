"use client"
import React from 'react';
import FlipWords from './components/FlipWords';
import { LampContainer } from './components/Lamp'
import {motion} from "framer-motion";

const HomePage = () => {
    const wordsArray = ["Get personalized guidance", "Stay motivated", "Track your progress"];

    return (
        <div>
            <LampContainer>
                <motion.h1
                    initial={{ opacity: 0.5, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
                >
                    Try the beta
                </motion.h1>
            </LampContainer>
            <FlipWords words={wordsArray} duration={2000} className="custom-class" />
        </div>
    );
};

export default HomePage;
