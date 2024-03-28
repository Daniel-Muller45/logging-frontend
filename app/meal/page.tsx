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
    const [user, setUser] = useState<UserState>({id: null});
    const [isEditMode, setIsEditMode] = useState(false);
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
    }, [date, user]);

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

    return (
        <div>
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
            <div className="flex justify-end p-4">
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
                        <Popover key={meal.id}>
                            <PopoverTrigger asChild>
                                <Card className="my-4">
                                    <CardHeader>
                                        <CardTitle>{meal.item}</CardTitle>
                                        <CardDescription>
                                            <div className="mt-2">Calories (kcal): {meal.cal}</div>
                                            <div className="mt-2">Protein (g): {meal.protein}</div>
                                            <div className="mt-2">Carbohydrates (g): {meal.carbs}</div>
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
                                className="w-100"
                                >
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
                                                    id="calories"
                                                    defaultValue={meal.cal}
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="protein">Protein (g)</Label>
                                                <Input
                                                    id="protein"
                                                    defaultValue={meal.protein}
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="carbs">Carbs (g)</Label>
                                                <Input
                                                    id="carbs"
                                                    defaultValue={meal.carbs}
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Button variant="outline" >Confirm</Button>

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
            {/*<Table style={{marginTop: '20px'}}>*/}
            {/*    <TableCaption>A list of your meals.</TableCaption>*/}
            {/*    <TableHeader>*/}
            {/*        <TableHead>Meal</TableHead>*/}
            {/*        <TableHead>Calories</TableHead>*/}
            {/*        <TableHead>*/}
            {/*            <Button variant="outline" onClick={toggleEditMode}>*/}
            {/*                {isEditMode ? 'Cancel' : 'Edit'}*/}
            {/*            </Button>*/}
            {/*        </TableHead>*/}
            {/*    </TableHeader>*/}
            {/*    <TableBody>*/}
            {/*        {meals.map((meal) => (*/}
            {/*            <TableRow key={meal.id}>*/}
            {/*                <TableCell>{meal.item}</TableCell>*/}
            {/*                <TableCell>{meal.cal}</TableCell>*/}
            {/*                <TableCell>*/}
            {/*                    {isEditMode && (*/}
            {/*                        <Button*/}
            {/*                            variant="outline"*/}
            {/*                            onClick={() => deleteMeal(meal.id)}*/}
            {/*                        >*/}
            {/*                            Delete*/}
            {/*                        </Button>*/}
            {/*                    )}*/}
            {/*                </TableCell>*/}
            {/*            </TableRow>*/}
            {/*        ))}*/}
            {/*    </TableBody>*/}
            {/*    <TableFooter>*/}
            {/*        <TableRow>*/}
            {/*            <TableCell colSpan={4}>Total</TableCell>*/}
            {/*            <TableCell style={{textAlign: 'center'}}>{totalCalories} calories</TableCell>*/}
            {/*        </TableRow>*/}
            {/*    </TableFooter>*/}
            {/*</Table>*/}
        </div>
    );
}