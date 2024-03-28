"use client"

import React, { useState, useContext, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Textarea } from '../../components/ui/textarea';
import { Label } from "../../components/ui/label";
import { postLog } from "../utils/api";
import { createClient } from '../utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader, Loader2, LoaderIcon } from 'lucide-react';

interface User {
    id: string;
}

export interface MealLogProps {
    onSubmit: () => void;
}

export default function MealLog({onSubmit}: MealLogProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [mealDescription, setMealDescription] = useState('');
    const router = useRouter(); // Get the router instance

    useEffect(() => {
        (async () => {
            const supabase = createClient();
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
                setUser(userData.user);
            } else {
                router.push('/login'); // Redirect using router.push
            }
        })();
    }, [router]); // Include router in the dependency array

    const handleMealSubmit = async () => {
        setLoading(true);
        if (!mealDescription.trim()) {
            alert('Please enter a description for the meal.');
            setLoading(false);
            return;
        }
        if (!user || !user.id) {
            alert('You must be logged in to log a meal.');
            setLoading(false);
            return;
        }

        try {
            const result = await postLog(mealDescription, user.id);
            if (result.error) {
                alert(`Error: ${result.error}`);
            } else {
                alert('Meal logged successfully');
                setMealDescription('');
                onSubmit();
            }
        } catch (error) {
            console.error('Error logging meal:', error);
            //alert('Failed to log meal. Please try again.');
        }
        finally {
            setLoading(false);
        }
        
    };
    if(loading) {
        return (
            <div className="flex justify-center items-center">
                <Loader/>
            </div>
        )
    }
    return (
        <div className="grid gap-1.5 items-center mx-auto mt-44">
            <Label htmlFor="message-2">Log Your Meals</Label>
            <Textarea
                placeholder="Type your message here."
                id="message-2"
                className="mt-5"
                value={mealDescription}
                onChange={(e) => setMealDescription(e.target.value)}
            />
            <Button className="mt-3" onClick={ () => {
                
                handleMealSubmit()
                
                }}>Log Meal</Button>
        </div>
    );
}