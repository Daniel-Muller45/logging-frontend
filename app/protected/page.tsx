"use client"

import React, { useState, useContext, useEffect } from 'react';
import { Button } from "../components/ui/button"
import { Textarea } from '../components/ui/textarea'
import { Label } from "../components/ui/label"
import { postLog } from "../utils/api"
import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../components/ui/card'
import {PopoverTrigger} from "@/app/components/ui/popover";
import {FiPlus} from "react-icons/fi";

interface User {
    id: string;
}

export default function Page() {
    const [user, setUser] = useState<User | null>(null);
    const [mealDescription, setMealDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add a state variable for loading status
    const [generate, setGenerate] = useState(false);

    const router = useRouter();

    const gpt = "Here's a meal idea to help you reach your remaining goals of 800 calories and 80 grams of protein, without adding carbs or fat:\n" +
        "\n" +
        "Grilled Chicken and Egg White Omelette with a Side of Cottage Cheese\n" +
        "\n" +
        "Grilled Chicken Breast: 300 grams\n" +
        "\n" +
        "Protein: ~70 grams\n" +
        "Calories: ~330\n" +
        "Egg White Omelette: Made with 10 egg whites\n" +
        "\n" +
        "Protein: ~33 grams\n" +
        "Calories: ~150\n" +
        "Cottage Cheese: 1 cup (low-fat)\n" +
        "\n" +
        "Protein: ~28 grams\n" +
        "Calories: ~160\n" +
        "This meal totals approximately 131 grams of protein and 640 calories. You can adjust the portion sizes slightly to hit the exact calorie and protein targets. This meal should help you come very close to your daily goals, especially considering you may have some caloric and protein intake from other minor food components or beverages throughout the day."

    useEffect(() => {
        (async () => {
            const supabase = createClient();
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
                setUser(userData.user);
            } else {
                router.push('/login');
            }
        })();
    }, [router]);

    const handleMealSubmit = async () => {
        if (!mealDescription.trim()) {
            alert('Please enter a description for the meal.');
            return;
        }
        if (!user || !user.id) {
            alert('You must be logged in to log a meal.');
            return;
        }

        setIsLoading(true); // Set loading to true before starting the async operation
        alert('Loading...'); // Show a loading alert

        try {
            const result = await postLog(mealDescription, user.id);
            setIsLoading(false); // Set loading to false once the operation is complete

            if (result.error) {
                alert(`Error: ${result.error}`);
            } else {
                alert('Meal logged successfully');
                setMealDescription('');
            }
        } catch (error) {
            console.error('Error logging meal:', error);
            alert('Failed to log meal. Please try again.');
            setIsLoading(false); // Ensure loading is set to false even if there is an error
        }
    };

    const toggleGenerate = () => {
        setGenerate(!generate);
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center w-1/2 mx-auto mt-16">
                <div className="self-stretch text-left">
                    <Label className="text-lg" htmlFor="message-2">Log Your Meals</Label>
                </div>
                <Textarea
                    placeholder="I ate 2 eggs and 1 bagel."
                    id="message-2"
                    className="mt-3 rounded bg-card"
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                />
                <Button className="mt-5 rounded w-40 text-white" onClick={handleMealSubmit} disabled={isLoading}>Log Meal</Button>
            </div>
            <div className="mt-10 mb-20 mx-auto lg:w-1/2 sm:w-2/3">
                <Card>
                    <div className="grid grid-cols-2 p-5">
                        <div>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Get AI Assistance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                Get meal recommendations based on your daily goals.
                            </CardContent>
                        </div>
                        <div className="flex justify-center items-center">
                            <Button className="rounded bg-gradient-to-r from-cyan-500 to-blue-500" variant="outline" onClick={toggleGenerate}>
                                {generate ? 'Cancel' : 'Generate Meal'}
                            </Button>
                        </div>
                    </div>
                    {generate && (
                        <div>

                            <div className="px-10 text-white">
                                {gpt}
                            </div>
                            <Card className="my-6 max-w-sm mx-auto md:max-w-md"
                                  style={{textTransform: 'capitalize'}}>
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle
                                            className="text-xl font-bold">Grilled Chicken, Egg White Omelette, Side of Cottage Cheese</CardTitle>
                                            <button>
                                                <FiPlus/>
                                            </button>
                                    </div>
                                    <CardDescription style={{textTransform: 'capitalize'}}>
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
                                            <div className="text-sm">
                                                <span className="font-light">Calories:</span>
                                                <span className="ml-1">640
                                                    <span className="ml-1"
                                                          style={{textTransform: 'lowercase'}}>(kcal)</span>
                                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-light">Carbs:</span>
                                                <span className="ml-1">10
                                                    <span className="ml-1"
                                                          style={{textTransform: 'lowercase'}}>(g)</span>
                                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-light">Protein:</span>
                                                <span className="ml-1">131
                                                    <span className="ml-1"
                                                          style={{textTransform: 'lowercase'}}>(g)</span>
                                                                </span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="font-light">Fat:</span>
                                                <span className="ml-1">10
                                                    <span className="ml-1"
                                                          style={{textTransform: 'lowercase'}}>(g)</span>
                                                                </span>
                                            </div>
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                )}
                </Card>
            </div>
        </div>
    );
}