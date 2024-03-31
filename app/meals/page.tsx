"use client"

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import {
    CardProgress,
    CardProgressContent,
    CardProgressDescription,
    CardProgressFooter,
    CardProgressHeader,
    CardProgressTitle,
} from "../components/totalProgress"
import { Calendar } from "../components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "../components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover"
import { fetchLogs } from '../utils/api'
import { startOfDay, isSameDay } from 'date-fns';
import { createClient } from '../utils/supabase/client'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {Label} from "../components/ui/label";
import {Input} from "../components/ui/input";
import { Progress } from "../components/ui/progress"

interface Meal {
    id: number;
    quantity: string;
    cal: number;
    item: string;
    protein: number;
    carbs: number;
    fat: number;
    created_at: string;

}

interface UserState {
    id: string | null;
}

interface MealData {
    [key: number]: {
        cal: number;
        protein: number;
        carbs: number;
        fat: number
    };
}


export default function Page() {
    const [date, setDate] = React.useState(new Date());
    const [meals, setMeals] = useState<Meal[]>([]);
    const [user, setUser] = useState<UserState>({id: null});
    const [isEditMode, setIsEditMode] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        (async () => {
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
            router.push('/login');
        }
        if (!user || !user.id) return;
        const fetchData = async () => {
            const mealData = await fetchLogs(user.id);
            const selectedDateStart = startOfDay(date);
            const filteredMeals = mealData.filter((meal: Meal) => {
                const mealDateStart = startOfDay(new Date(meal.created_at));
                return isSameDay(mealDateStart, selectedDateStart);
            });
            setMeals(filteredMeals);
            const initialEditData = filteredMeals.reduce((acc: MealData, meal: Meal) => ({
                ...acc,
                [meal.id]: {
                    cal: meal.cal,
                    protein: meal.protein,
                    carbs: meal.carbs,
                    fat: meal.fat,
                }
            }), {});
            setEditMealData(initialEditData);
        };
        fetchData();
    }, [date, user]);

    const [editMealData, setEditMealData] = useState<MealData>({});
    const totalCalories = meals.reduce((total, meal) => total + meal.cal, 0);
    const totalProtein = meals.reduce((total, meal) => total + meal.protein, 0);
    const totalCarbs = meals.reduce((total, meal) => total + meal.carbs, 0);
    const totalFat = meals.reduce((total, meal) => total + meal.fat, 0);

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


    const updateMeal = async (mealId: number) => {
        try {
            const updatedMeal = {
                cal: editMealData[mealId]?.cal,
                protein: editMealData[mealId]?.protein,
                carbs: editMealData[mealId]?.carbs,
                fat: editMealData[mealId]?.fat,
            };
            const { data, error } = await supabase
                .from('meals')
                .update(updatedMeal)
                .eq('id', mealId);
            if (error) {
                throw new Error(error.message);
            }
            alert('Meal updated successfully');
            setMeals(currentMeals => currentMeals.map(meal => meal.id === mealId ? { ...meal, ...updatedMeal } : meal));
        } catch (error: unknown) {
            console.error('Error updating meal:', error);
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };


    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    return (
        <div>
            <div className="grid grid-cols-2 mb-16">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal rounded",
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
                <div className="flex justify-end">
                    <Button className="rounded" variant="outline" onClick={toggleEditMode}>
                        {isEditMode ? 'Cancel' : 'Edit Meals'}
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <CardProgress>
                    <CardProgressHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardProgressTitle className="text-medium font-bold">
                            Calories (kcal)
                        </CardProgressTitle>
                    </CardProgressHeader>
                    <CardProgressContent>
                        <div className="ml-4 text-xl font-medium">{totalCalories} / 2800</div>
                        <div className="mt-2">
                            <Progress value={20}></Progress>
                        </div>
                    </CardProgressContent>
                </CardProgress>
                <CardProgress>
                    <CardProgressHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardProgressTitle className="text-medium font-bold">
                            Protein (g)
                        </CardProgressTitle>
                    </CardProgressHeader>
                    <CardProgressContent>
                        <div className="ml-4 text-xl font-medium">{totalProtein} / 120</div>
                        <div className="mt-2">
                            <Progress value={80}></Progress>
                        </div>
                    </CardProgressContent>
                </CardProgress>
                <CardProgress>
                    <CardProgressHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardProgressTitle className="text-medium font-bold">
                            Carbohydrates (g)
                        </CardProgressTitle>
                    </CardProgressHeader>
                    <CardProgressContent>
                        <div className="ml-4 text-xl font-medium">{totalCarbs} / 150</div>
                        <div className="mt-2">
                            <Progress value={80}></Progress>
                        </div>
                    </CardProgressContent>
                </CardProgress>
                <CardProgress>
                    <CardProgressHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardProgressTitle className="text-medium font-bold">
                            Fat (g)
                        </CardProgressTitle>
                    </CardProgressHeader>
                    <CardProgressContent>
                        <div className="ml-4 text-xl font-medium">{totalFat} / 100</div>
                        <div className="mt-2">
                            <Progress value={20}></Progress>
                        </div>
                    </CardProgressContent>
                </CardProgress>
            </div>
            <div className="mt-14">
                {meals.length > 0 ? (
                    meals.map((meal) => (
                        <Popover key={meal.id}>
                            <PopoverTrigger asChild>
                                <Card className="mb-6 max-w-sm mx-auto md:max-w-md"
                                      style={{textTransform: 'capitalize'}}>
                                    <CardHeader>
                                        <CardTitle
                                            className="text-xl font-bold">{meal.item} - {meal.quantity}</CardTitle>
                                        <CardDescription style={{textTransform: 'capitalize'}}>
                                            <div className="grid grid-cols-2 gap-x-1 gap-y-4 text-white mt-4">
                                                <div className="text-lg">
                                                    <span className="font-light">Calories:</span>
                                                    <span className="ml-1">{meal.cal}
                                                        <span className="ml-1"
                                                              style={{textTransform: 'lowercase'}}>(kcal)</span>
                                                        </span>
                                                </div>
                                                <div className="text-lg">
                                                    <span className="font-light">Carbs:</span>
                                                    <span className="ml-1">{meal.carbs}
                                                        <span className="ml-1"
                                                              style={{textTransform: 'lowercase'}}>(g)</span>
                                                        </span>
                                                </div>
                                                <div className="text-lg">
                                                    <span className="font-light">Protein:</span>
                                                    <span className="ml-1">{meal.protein}
                                                        <span className="ml-1"
                                                              style={{textTransform: 'lowercase'}}>(g)</span>
                                                        </span>
                                                </div>
                                                <div className="text-lg">
                                                    <span className="font-light">Fat:</span>
                                                    <span className="ml-1">{meal.fat}
                                                        <span className="ml-1"
                                                              style={{textTransform: 'lowercase'}}>(g)</span>
                                                        </span>
                                                </div>
                                            </div>
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
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-100">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">{meal.item}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Edit the nutritional information.
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="quantity">Quantity</Label>
                                            <Input
                                                id="quantity"
                                                defaultValue='1'
                                                className="col-span-2 h-8"
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="calories">Calories (kcal)</Label>
                                            <Input
                                                id={`calories-${meal.id}`}
                                                defaultValue={meal.cal}
                                                onChange={(e) => setEditMealData({
                                                    ...editMealData,
                                                    [meal.id]: {...editMealData[meal.id], cal: parseInt(e.target.value)}
                                                })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="protein">Protein (g)</Label>
                                            <Input
                                                id={`protein-${meal.id}`}
                                                defaultValue={meal.protein}
                                                onChange={(e) => setEditMealData({
                                                    ...editMealData,
                                                    [meal.id]: {
                                                        ...editMealData[meal.id],
                                                        protein: parseInt(e.target.value)
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="carbs">Carbs (g)</Label>
                                            <Input
                                                id={`carbs-${meal.id}`}
                                                defaultValue={meal.carbs}
                                                onChange={(e) => setEditMealData({
                                                    ...editMealData,
                                                    [meal.id]: {
                                                        ...editMealData[meal.id],
                                                        carbs: parseInt(e.target.value)
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="carbs">Fat (g)</Label>
                                            <Input
                                                id={`carbs-${meal.id}`}
                                                defaultValue={meal.fat}
                                                onChange={(e) => setEditMealData({
                                                    ...editMealData,
                                                    [meal.id]: {
                                                        ...editMealData[meal.id],
                                                        fat: parseInt(e.target.value)
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Button variant="outline" onClick={() => updateMeal(meal.id)}>Confirm</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ))
                ) : (
                    <div className="text-center my-20">
                        <p>You have no meals logged.</p>
                        <Link href="/protected" className="text-blue-600 hover:text-blue-800 visited:text-blue-600">
                            Log a meal
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}