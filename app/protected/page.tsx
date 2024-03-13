"use client"

import React, { useState, useContext } from 'react';
import { Button } from "../components/ui/button"
import { Textarea } from '../components/ui/textarea'
import { Label } from "../components/ui/label"
import { postLog } from "../utils/api"
import { createClient } from '../utils/supabase/client'


export default function Page() {
    const [mealDescription, setMealDescription] = useState('');
    const { user } = createClient(); // Ensure this matches your context/hook for user state

    const handleMealSubmit = async () => {
        if (!mealDescription.trim()) {
            alert('Please enter a description for the meal.');
            return;
        }

        try {
            const result = await postLog(mealDescription, user.id);
            if (result.error) {
                alert(`Error: ${result.error}`);
            } else {
                alert('Meal logged successfully');
                setMealDescription(''); // Clear the textarea upon successful submission
            }
        } catch (error) {
            console.error('Error logging meal:', error);
            alert('Failed to log meal. Please try again.');
        }
    };

    return (
        <div className="grid gap-1.5 items-center w-1/2 mx-auto mt-44">
            <Label htmlFor="message-2">Log Your Meals and Workouts</Label>
            <Textarea
                placeholder="Type your message here."
                id="message-2"
                className="mt-5"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
            />
            <Button className="mt-3" onClick={handleMealSubmit}>Log Meal</Button>
        </div>
    );
}