"use client"

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card"
import { Calendar } from "../../components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "../../components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../components/ui/popover"
import { fetchLogs } from '../../utils/api'
import { startOfDay, isSameDay } from 'date-fns';
import { createClient } from '../../utils/supabase/client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import MealLog from '@/app/components/MealLog';

interface Meal {
    id: number;
    cal: number;
    item: string;
    protein: number;
    carbs: number;
    created_at: string;
}

interface UserState {
    id: string | null;
}

export default function Page() {
    const [date, setDate] = React.useState(new Date());
    const [meals, setMeals] = useState<Meal[]>([]);
    const [user, setUser] = useState<UserState>({id: null}); // Simplified user state
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLogging, setLogging] = useState(false);
    const router = useRouter(); // Get the router instance

    useEffect(() => {
        (async () => {
            const supabase = createClient();
            const {data: userData} = await supabase.auth.getUser();
            if (userData.user && userData.user.id) {
                setUser({id: userData.user.id});
            } else {
                setUser({id: null});
            }
        })();
    }, []);

    useEffect(() => {
        if (!user) {
            router.push('/login'); // Redirect using router.push
        }
        if (!user || !user.id) return;
        const fetchData = async () => {
            const mealData = await fetchLogs(user.id);
            const selectedDateStart = startOfDay(date); // This will now have a value upon first render
            const filteredMeals = mealData.filter((meal: Meal) => {
                const mealDateStart = startOfDay(new Date(meal.created_at));
                return isSameDay(mealDateStart, selectedDateStart);
            });
            setMeals(filteredMeals);
        };
        fetchData();
    }, [date, user, isLogging]);

    const totalCalories = meals.reduce((total, meal) => total + meal.cal, 0);
    const totalProtein = meals.reduce((total, meal) => total + meal.protein, 0);
    const totalCarbs = meals.reduce((total, meal) => total + meal.carbs, 0);

    async function deleteMeal(mealId: number) {
        try {
            const response = await fetch(`https://fastapiapp-eight.vercel.app/meals/${mealId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete the meal');
            }

            alert('Meal deleted successfully');
            setMeals(currentMeals => currentMeals.filter(meal => meal.id !== mealId));
        } catch (error) {
            console.error('Error deleting meal:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    }

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const toggleLogging = () => {
        setLogging(!isLogging);
    };


    return (
        <div>
        { isLogging ? (
            <MealLog onSubmit={toggleLogging}/>
        ) : 
        (<div>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 size 4"/>
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                                if (selectedDate) {
                                    setDate(selectedDate);
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                
                <Button variant="outline" onClick={toggleEditMode}>
                    {isEditMode ? 'Cancel' : 'Edit Meals'}
                </Button>
                
            </div>
            <div className="text-center my-4">
                <h2 className="my-2">Calories (kcal): {totalCalories}/2800</h2>
                <h2 className="my-2">Protein (g): {totalProtein}/120</h2>
                <h2 className="my-2">Fat (g): {totalCarbs}/90</h2>
            </div>
            <div>
                {meals.length > 0 ? (
                    meals.map((meal) => (
                        <Card className="my-4" key={meal.id}>
                            <CardHeader>
                                <CardTitle>{meal.item}</CardTitle>
                                <CardDescription>
                                    <div className="mt-2">Calories (kcal): { isEditMode? 
                                    (
                                        <Input value={meal.cal}/>
                                    ) : (meal.cal)
                                    }</div>
                                    <div className="mt-2">Protein (g): { isEditMode? 
                                    (
                                        <Input value={meal.protein}/>
                                    ) : (meal.protein)
                                    }</div>
                                    <div className="mt-2">Carbohydrates (g): { isEditMode? 
                                    (
                                        <Input value={meal.carbs}/>
                                    ) : (meal.carbs)
                                    }</div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isEditMode && (
                                    <Button
                                        variant="outline"
                                        onClick={() => deleteMeal(meal.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                        // <Popover key={meal.id}>
                        //     <PopoverTrigger asChild>
                        //         <Card className="my-4">
                        //             <CardHeader>
                        //                 <CardTitle>{meal.item}</CardTitle>
                        //                 <CardDescription>
                        //                     <div className="mt-2">Calories (kcal): { meal.cal}</div>
                        //                     <div className="mt-2">Protein (g): {meal.protein}</div>
                        //                     <div className="mt-2">Carbohydrates (g): {meal.carbs}</div>
                        //                 </CardDescription>
                        //             </CardHeader>
                        //             <CardContent>
                        //                 {isEditMode && (
                        //                     <Button
                        //                         variant="outline"
                        //                         onClick={() => deleteMeal(meal.id)}
                        //                     >
                        //                         Delete
                        //                     </Button>
                        //                 )}
                        //             </CardContent>
                        //         </Card>
                        //     </PopoverTrigger>
                        //     <PopoverContent
                        //         className="w-100"
                        //         >
                        //             <div className="grid gap-4">
                        //                 <div className="space-y-2">
                        //                     <h4 className="font-medium leading-none">{meal.item}</h4>
                        //                     <p className="text-sm text-muted-foreground">
                        //                         Edit the nutritional information.
                        //                     </p>
                        //                 </div>
                        //                 <div className="grid gap-2">
                        //                     <div className="grid grid-cols-3 items-center gap-4">
                        //                         <Label htmlFor="quantity">Quantity</Label>
                        //                         <Input
                        //                             id="quantity"
                        //                             defaultValue='1'
                        //                             className="col-span-2 h-8"
                        //                         />
                        //                     </div>
                        //                     <div className="grid grid-cols-3 items-center gap-4">
                        //                         <Label htmlFor="calories">Calories (kcal)</Label>
                        //                         <Input
                        //                             id="calories"
                        //                             defaultValue={meal.cal}
                        //                             className="col-span-2 h-8"
                        //                         />
                        //                     </div>
                        //                     <div className="grid grid-cols-3 items-center gap-4">
                        //                         <Label htmlFor="protein">Protein (g)</Label>
                        //                         <Input
                        //                             id="protein"
                        //                             defaultValue={meal.protein}
                        //                             className="col-span-2 h-8"
                        //                         />
                        //                     </div>
                        //                     <div className="grid grid-cols-3 items-center gap-4">
                        //                         <Label htmlFor="carbs">Carbs (g)</Label>
                        //                         <Input
                        //                             id="carbs"
                        //                             defaultValue={meal.carbs}
                        //                             className="col-span-2 h-8"
                        //                         />
                        //                     </div>
                        //                 </div>
                        //             </div>
                        //     </PopoverContent>
                        // </Popover>
                    ))
                ) : (
                    <div className="text-center my-20">
                        <p>You have no meals logged.</p>
                        <Button onClick={toggleLogging} className="text-blue-600 hover:text-blue-800 visited:text-blue-600">
                            Log a meal
                        </Button>
                    </div>
                )}
            </div>
        </div>)}
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-inherit ">
            <div className="grid h-full max-w-lg grid-cols-2 mx-auto font-medium">
                <Button type='button' onClick={() => setLogging(false)} className="bg-inherit inline-flex flex-col items-center justify-center px-5 dark:hover:bg-gray-800 group">
                    <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Meals</span>
                </Button>
                <Button onClick={() => setLogging(true)} className="bg-inherit inline-flex flex-col items-center justify-center px-5 dark:hover:bg-gray-800 group">
                    <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11.074 4 8.442.408A.95.95 0 0 0 7.014.254L2.926 4h8.148ZM9 13v-1a4 4 0 0 1 4-4h6V6a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h17a1 1 0 0 0 1-1v-2h-6a4 4 0 0 1-4-4Z"/>
                        <path d="M19 10h-6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Zm-4.5 3.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM12.62 4h2.78L12.539.41a1.086 1.086 0 1 0-1.7 1.352L12.62 4Z"/>
                    </svg>
                    <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Log</span>
                </Button>
            </div>
        </div>
        </div>
                
    );
}