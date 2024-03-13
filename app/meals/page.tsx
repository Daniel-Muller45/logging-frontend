"use client"

import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
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


interface Meal {
    id: number;
    cal: number;
    item: string;
    created_at: string;
}

export default function Page() {

    const [date, setDate] = React.useState<Date>()
    const [meals, setMeals] = useState<Meal[]>([]);
    const [user, setUser] = useState({ id: null }); // Simplified user state


    useEffect(() => {
        // Create an IIFE (Immediately Invoked Function Expression) to handle async logic
        (async () => {
            const supabase = createClient();
            const { data: userData } = await supabase.auth.getUser();
            setUser(userData.user); // Assuming userData has a user object
        })();
    }, []); // Empty dependency array means this runs once on component mount

    useEffect(() => {
        if (!user || !user.id) return; // Exit if no user is found
        const fetchData = async () => {
            const mealData = await fetchLogs(user.id);
            // Your existing logic to filter meals based on date
            if (date) {
                const selectedDateStart = startOfDay(date);
                const filteredMeals = mealData.filter((meal: Meal) => {
                    const mealDateStart = startOfDay(new Date(meal.created_at));
                    return isSameDay(mealDateStart, selectedDateStart);
                });
                setMeals(filteredMeals);
            } else {
                setMeals(mealData);
            }
        };
        fetchData();
    }, [date, user]);

    const totalCalories = meals.reduce((total, meal) => total + meal.cal, 0);
    const deleteMeal = async (mealId) => {
        // Optional: Delete the meal from your backend
        // await deleteMealAPI(mealId);

        // Filter out the meal from the current meals state
        const updatedMeals = meals.filter(meal => meal.id !== mealId);
        setMeals(updatedMeals);
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
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Table style={{ marginTop: '20px' }}>
                <TableCaption>A list of your meals.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Meal</TableHead>
                        <TableHead>Calories</TableHead>
                        <TableHead>Edit</TableHead> {/* Add a column for actions */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {meals.map((meal) => (
                        <TableRow key={meal.id}>
                            <TableCell>{meal.item}</TableCell>
                            <TableCell>{meal.cal}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outline"
                                    onClick={() => deleteMeal(meal.id)} // Call deleteMeal function with the id of the meal to be deleted
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{totalCalories} calories</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}