"use client"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import React, {ChangeEvent, useEffect, useState} from 'react';
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import Link from 'next/link'
import {createClient} from "@/app/utils/supabase/client";
import { useRouter } from 'next/navigation';

interface Profile {
    id: string | null,
    fullName: string | null,
    email: string | null,
    calorieGoal: string | null,
    proteinGoal: number | null,
    carbGoal: number | null,
    fatGoal: number | null
}

interface UserState {
    id: string | null;
}

export default function Component() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    // const [user, setUser] = useState<UserState>({id: null});
    // const [calorieGoal, setCalorieGoal] = useState(0);
    // const supabase = createClient();

    // const updateCalorieGoal = (calories: number) => {
    //     (async () => {
    //             const {data: userData} = await supabase.auth.getUser();
    //             if (userData.user && userData.user.id) {
    //                 setUser({id: userData.user.id});
    //             } else {
    //                 setUser({id: null});
    //             }
    //             try {
    //                 const {data, error} = await supabase
    //                     .from('profiles')
    //                     .insert({'calorie_goal': calories})
    //                     .eq('id', user.id);
    //                 if (error) {
    //                     alert("error updating profile")
    //                 }
    //             } catch (error) {
    //                 if (error instanceof Error) {
    //                     alert(error.message);
    //                 } else {
    //                     alert('An unexpected error occurred.');
    //                 }
    //             }
    //         }
    //     )();
    // }

    const nextStep = () => {
        if (step < 6) {
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
                    <div className="w-full">
                        <Card className="bg-transparent">
                            <CardHeader>
                                <CardTitle className="text-2xl">Set up your profile</CardTitle>
                                <CardDescription>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <Input className="bg-transparent rounded" placeholder="Enter your name" type="text" />
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
                    </div>
                );
            case 2:
                return (
                    <Card className="w-full max-w-lg bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl">Set Your Daily Calorie Goal</CardTitle>
                            <CardDescription>
                                Calories are the total energy intake from your food. How many calories would you like to aim for each day?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Input className="bg-transparent rounded"
                                   placeholder="Enter your daily calorie goal"
                                   type="number"
                            />
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
            case 4:
                return (
                    <Card className="w-full max-w-lg bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl">Set Your Daily Carbohydrate Goal</CardTitle>
                            <CardDescription>
                                Carbohydrates provide essential energy for your daily activities. How many grams of carbohydrates would you like to aim for each day?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Input className="bg-transparent rounded" placeholder="Enter your daily carbohydrate goal" type="number"/>
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
            case 5:
                return (
                    <Card className="w-full max-w-lg bg-transparent">
                        <CardHeader>
                            <CardTitle className="text-2xl">Set Your Daily Fat Goal</CardTitle>
                            <CardDescription>
                                Fats are crucial for maintaining healthy cell function and energy storage. How many grams of fat would you like to aim for each day?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <Input className="bg-transparent rounded" placeholder="Enter your daily fat goal" type="number"/>
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
                    <div>
                        <div className="flex justify-center text-2xl font-semibold">
                            Setup Complete
                        </div>
                        <div className="flex justify-center mt-10">
                            <Button className="rounded" variant="outline" >
                                <Link href="/protected" legacyBehavior passHref>
                                    Start here
                                </Link>
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <div className="w-96">
                <Progress value={step * 20 - 20} className="my-10 w-96"/>
                {renderForm()}
            </div>
        </div>
    );
}
