"use client"
import Microphone from './assets/Microphone.png'
import Artificial from './assets/Artificial.png'
import Mockup from './assets/Mockup.png'
import Watch from './assets/Watch.png'
import Protect from './assets/Protect.png'
import Image from 'next/image'
import { addEmail } from './utils/api'
import React, { useState } from 'react';

export default function Main() {
    const [email, setEmail] = useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await addEmail(email);
    };
    return (
        <section className="text-gray-600 body-font">
            <div className="max-w-7xl mx-auto flex px-5 py-12 md:flex-row flex-col items-center">
                <div className="lg:flex-grow md:w-1/2 md:ml-24 pt-6 flex flex-col md:items-start md:text-left mb-40 items-center text-center">
                    <h1 className="mb-5 sm:text-6xl text-5xl items-center Avenir xl:w-2/2 text-white font-semibold">
                        Log your Meals Faster than Ever
                    </h1>
                    <p className="mb-4 xl:w-3/4 text-gray-400 text-lg">
                        Use natural language to log your meals in seconds. Get on the fly nutrition recommendations.
                    </p>
                    <div className="flex justify-center">
                        <a
                            className="inline-flex items-center px-5 py-3 mt-2 font-medium text-white transition duration-500 ease-in-out transform bg-transparent border rounded-lg"
                            href="/login"
                        >
                            <span className="justify-center">Try out the beta</span>
                        </a>
                    </div>
                </div>
                <div className="xl:mr-44 sm:mr-0 sm:mb-28 mb-0 lg:mb-0 mr-48 md:pl-10">
                    <Image
                        className="w-80 md:ml-1 ml-24"
                        alt="iPhone-12"
                        src={Mockup}
                    ></Image>
                </div>
            </div>
            <div className="grr max-w-7xl pt-20 mx-auto text-center">
                <h1 className="mb-8 text-6xl Avenir font-semibold text-white">
                    Less time, less effort.
                </h1>
                <h1 className="mb-8 text-2xl Avenir font-semibold text-gray-400 text-center">
                    Let us do the heavy lifting. Well, at least outside of the gym.
                </h1>
            </div>
            <section>
                <div className="container mx-auto p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
                            <div className="flex justify-center items-center h-48 sm:h-64 bg-gray-900">
                                <Image src={Artificial} alt='brain'
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="font-bold text-xl mb-2 text-white">Personalized Recommendations</h2>
                                <p className="text-gray-400 text-base">
                                    Get nutrition advice based on your tendencies and goals.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
                            <div className="flex justify-center items-center h-48 sm:h-64 bg-gray-900">
                                <Image src={Watch} alt='brain'
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="font-bold text-xl mb-2 text-white">Integrate with Wearables</h2>
                                <p className="text-gray-400 text-base">
                                    Sync your wearables to track key fitness metrics.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
                            <div className="flex justify-center items-center h-48 sm:h-64 bg-gray-900">
                                <Image src={Microphone} alt='brain'
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="font-bold text-xl mb-2 text-white">Effortless Fitness Tracking</h2>
                                <p className="text-gray-400 text-base">
                                    Use siri to log your meals without even opening your phone.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
                            <div className="flex justify-center items-center h-48 sm:h-64 bg-gray-900">
                            <Image src={Protect} alt='brain'
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="font-bold text-xl mb-2 text-white">Accurate and Secure</h2>
                                <p className="text-gray-400 text-base">
                                    Get the most up to date nutrition data, while keeping your fitness data secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                    <div className="py-24 md:py-36">
                        <h1 className="mb-5 text-6xl Avenir font-semibold text-white">
                            Subscribe to our newsletter
                        </h1>
                        <h1 className="mb-9 text-2xl font-semibold text-gray-400">
                            Get private access to our launch.
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <input
                                placeholder="jack@example.com"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="border border-gray-600 w-1/4 pr-2 pl-2 py-3 mt-2 rounded-md text-gray-800 font-semibold hover:border-gray-900"
                                value={email}
                                onChange={handleEmailChange}
                            ></input>
                            <button
                                type="submit"
                                className="inline-flex items-center px-14 py-3 mt-2 ml-2 font-medium text-white transition duration-500 ease-in-out transform bg-transparent border rounded-lg"
                            >
                                <span className="justify-center">Subscribe</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </section>
    );
}
