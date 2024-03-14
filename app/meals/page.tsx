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

interface UserState {
    id: string | null;
}

export default function Page() {
    const [date, setDate] = React.useState(new Date());
    const [meals, setMeals] = useState<Meal[]>([]);
    const [user, setUser] = useState<UserState>({id: null}); // Simplified user state
    const [isEditMode, setIsEditMode] = useState(false);

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
            <Table style={{marginTop: '20px'}}>
                <TableCaption>A list of your meals.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Meal</TableHead>
                        <TableHead>Calories</TableHead>
                        <TableHead>
                            <Button variant="outline" onClick={toggleEditMode}>
                                {isEditMode ? 'Cancel' : 'Edit'}
                            </Button>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {meals.map((meal) => (
                        <TableRow key={meal.id}>
                            <TableCell>{meal.item}</TableCell>
                            <TableCell>{meal.cal}</TableCell>
                            <TableCell>
                                {isEditMode && (
                                    <Button
                                        variant="outline"
                                        onClick={() => deleteMeal(meal.id)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell style={{textAlign: 'center'}}>{totalCalories} calories</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
}