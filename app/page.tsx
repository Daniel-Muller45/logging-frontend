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
import { useAuth } from '@clerk/clerk-react';
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface Meal {
    id: number;
    cal: number;
    name: string;
};


// const supabaseClient = async (supabaseAccessToken: string): Promise<SupabaseClient> => {
//     const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!, {
//         global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
//     });
//     return supabase;
// };

export default function Page() {
    const [date, setDate] = React.useState<Date>()
    const [meals, setMeals] = useState<Meal[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const mealData = await fetchLogs();
            setMeals(mealData);
        };

        fetchData();
    }, []);
    //
    const totalCalories = meals.reduce((total, meal) => total + meal.cal, 0);

    // const { getToken } = useAuth();
    // const fetchData = async () => {
    //     const supabaseAccessToken = await getToken ({ template: 'supabase'});
    //     const supabase = await supabaseClient(supabaseAccessToken!);
    //
    //     // Replace 'your_table' with your database table name
    //     const { data, error } = await supabase.from('users').select("*");
    //
    //     // Handle the response
    //     if (error) {
    //         console.error("Error fetching data:", error);
    //     } else {
    //         console.log("Data:", data);
    //     }
    //
    // }


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
                        <CalendarIcon className="mr-2 h-4 w-4"/>
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