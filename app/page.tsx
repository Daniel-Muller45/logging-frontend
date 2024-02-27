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
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { fetchLogs } from './utils/api'
import { startOfDay, isSameDay } from 'date-fns';


interface Meal {
    id: number;
    cal: number;
    name: string;
    created_at: string;
}

export default function Page() {
    const [date, setDate] = React.useState<Date>()
    const [meals, setMeals] = useState<Meal[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const mealData = await fetchLogs();
            if (date) {
                // Convert the selected date to the start of the day.
                const selectedDateStart = startOfDay(date);

                // Filter the meals to match the selected date.
                const filteredMeals = mealData.filter((meal: Meal) => {
                    // Convert the created_at to a Date object and then to the start of that day.
                    const mealDateStart = startOfDay(new Date(meal.created_at));
                    // Compare the dates.
                    return isSameDay(mealDateStart, selectedDateStart);
                });

                setMeals(filteredMeals);
            } else {
                // If no date is selected, display all meals.
                setMeals(mealData);
            }
        };

        fetchData();
    }, [date]);

    const totalCalories = meals.reduce((total, meal) => total + meal.cal, 0);

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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {meals.map((meal: Meal) => (
                        <TableRow key={meal.id}>
                            <TableCell>{meal.name}</TableCell>
                            <TableCell>{meal.cal}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell style={{ textAlign: 'center' }}> {totalCalories} calories</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}