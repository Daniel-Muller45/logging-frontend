"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import React, { useState } from 'react';
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

export default function Component() {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        if (step < 4) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const renderForm = () => {
        switch(step) {
            case 1:
                return (
                    <Card className="w-full max-w-lg bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl">Set Your Daily Calorie Goal</CardTitle>
                            <CardDescription>
                                Calories are the total energy intake from your food. How many calories would you like to aim for each day?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Input className="bg-transparent rounded" placeholder="Enter your daily protein goal" type="number" />
                            <div className="flex justify-between">
                                <button>
                                    <FiChevronLeft onClick={prevStep} size={40}/>
                                </button>
                                <button>
                                    <FiChevronRight onClick={nextStep} size={40}/>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                );
            case 2:
                return (
                    <Card className="w-full max-w-lg bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl">Set Your Daily Protein Goal</CardTitle>
                            <CardDescription>
                                Protein is essential for your health and fitness. How many grams of protein would you like to aim for each day?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Input className="bg-transparent rounded" placeholder="Enter your daily protein goal" type="number"/>
                            <div className="flex justify-between">
                                <button>
                                    <FiChevronLeft onClick={prevStep} size={40}/>
                                </button>
                                <button>
                                    <FiChevronRight onClick={nextStep} size={40}/>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                );
            case 3:
                return (
                    <Card className="w-full max-w-lg bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl">Set Your Daily Carbohydrate Goal</CardTitle>
                            <CardDescription>
                                Carbohydrates provide essential energy for your daily activities. How many grams of carbohydrates would you like to aim for each day?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Input className="bg-transparent rounded" placeholder="Enter your daily protein goal" type="number"/>
                            <div className="flex justify-between">
                                <button>
                                    <FiChevronLeft onClick={prevStep} size={40}/>
                                </button>
                                <button>
                                    <FiChevronRight onClick={nextStep} size={40}/>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                );
            case 4:
                return (
                    <Card className="w-full max-w-lg bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl">Set Your Daily Fat Goal</CardTitle>
                            <CardDescription>
                                Fats are crucial for maintaining healthy cell function and energy storage. How many grams of fat would you like to aim for each day?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Input className="bg-transparent rounded" placeholder="Enter your daily protein goal" type="number"/>
                            <div className="flex justify-between">
                                <button>
                                    <FiChevronLeft onClick={prevStep} size={40}/>
                                </button>
                                <button>
                                    <FiChevronRight onClick={nextStep} size={40}/>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                );
            default:
                return (
                    <div>Invalid step</div>
                );
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <div>
                <Progress value={step * 25} className="my-10"/>
                {renderForm()}
            </div>
        </div>
    );
}
