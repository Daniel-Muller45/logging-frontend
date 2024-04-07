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

interface User {
    id: string;
}

export default function Page() {
    const [user, setUser] = useState<User | null>(null);
    const [mealDescription, setMealDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Add a state variable for loading status

    const router = useRouter();

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

    return (
        <div>
            <div className="flex flex-col items-center justify-center w-1/2 mx-auto mt-44">
                <div className="self-stretch text-left">
                    <Label htmlFor="message-2">Log Your Meals</Label>
                </div>
                <Textarea
                    placeholder="Type your message here."
                    id="message-2"
                    className="mt-5 rounded"
                    value={mealDescription}
                    onChange={(e) => setMealDescription(e.target.value)}
                />
                <Button className="mt-3 rounded w-40" onClick={handleMealSubmit} disabled={isLoading}>Log Meal</Button>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Get AI Assistance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        Get meal recommendations based on your daily goals.
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}