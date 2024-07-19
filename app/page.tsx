"use client"
import React from 'react';
import FlipWords from './components/FlipWords';
import { LampContainer } from './components/Lamp'
import {motion} from "framer-motion";
import { TypewriterEffectSmooth } from "./components/TypewriterEffect";
import Microphone from './assets/Microphone.png'
import Artificial from './assets/Artificial.png'
import Mockup from './assets/Mockup.png'
import Watch from './assets/Watch.png'
import Protect from './assets/Protect.png'
import Image from 'next/image'
import { WobbleCard } from "./components/wobble-card";

const HomePage = () => {
    const wordsArray = ["Get personalized guidance", "Stay motivated", "Track your progress"];

    const words = [
        {
            text: "Reach",
        },
        {
            text: "your",
        },
        {
            text: "fitness",
        },
        {
            text: "goals",
        },
        {
            text: "with",
        },
        {
            text: "Ora.",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];

    const Card = ({ number, title, description }) => (
        <div className="p-4 bg-black text-white">
            <div className="flex items-baseline">
                <div className="text-5xl font-bold mr-4 text-blue-500">{number}</div>
                <div className="text-2xl font-semibold">{title}</div>
            </div>
            <div className="text-lg mt-1">{description}</div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-[40rem]  ">
                <p className="text-white dark:text-white text-xs sm:text-base  ">
                    By your side every step of the way
                </p>
                <TypewriterEffectSmooth words={words}/>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                    <button
                        className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                        Join now
                    </button>
                    <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
                        Signup
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 xl:mr-44 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-48 md:pl-10 ml-40">
                <Image
                    className="w-80 md:ml-1 ml-24"
                    alt="iPhone-12"
                    src={Mockup}>
                </Image>
                <div className="grid grid-rows-3 gap-4">
                    <Card
                        number="1"
                        title="Get personalized guidance"
                        description="Ora’s natural language chatbot will guide your fitness journey."
                    />
                    <Card
                        number="2"
                        title="Track your progress"
                        description="Effortlessly log your meals using natural language."
                    />
                    <Card
                        number="3"
                        title="Stay motivated"
                        description="Set custom notifications to keep you disciplined."
                    />
                </div>
            </div>
            <section className="mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
                    <WobbleCard
                        containerClassName="col-span-1 lg:col-span-2 h-full bg-blue-600 min-h-[500px] lg:min-h-[300px]"
                        className=""
                    >
                        <div className="max-w-xs">
                            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Gippity AI powers the entire universe
                            </h2>
                            <p className="mt-4 text-left  text-base/6 text-neutral-200">
                                With over 100,000 mothly active bot users, Gippity AI is the most
                                popular AI platform for developers.
                            </p>
                        </div>
                        <Image
                            src="/linear.webp"
                            width={500}
                            height={500}
                            alt="linear demo image"
                            className="absolute -right-4 lg:-right-[40%] grayscale filter -bottom-10 object-contain rounded-2xl"
                        />
                    </WobbleCard>
                    <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-blue-600">
                        <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                            No shirt, no shoes, no weapons.
                        </h2>
                        <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                            If someone yells “stop!”, goes limp, or taps out, the fight is over.
                        </p>
                    </WobbleCard>
                    <WobbleCard
                        containerClassName="col-span-1 lg:col-span-3 bg-blue-600 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
                        <div className="max-w-sm">
                            <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                                Signup for blazing-fast cutting-edge state of the art Gippity AI
                                wrapper today!
                            </h2>
                            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                                With over 100,000 mothly active bot users, Gippity AI is the most
                                popular AI platform for developers.
                            </p>
                        </div>
                        <Image
                            src="/linear.webp"
                            width={500}
                            height={500}
                            alt="linear demo image"
                            className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
                        />
                    </WobbleCard>
                </div>
            </section>
        </div>
    )
        ;
};

export default HomePage;
