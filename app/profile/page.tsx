"use client"

import React, { ChangeEvent, useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client'
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import {Input} from "../../components/ui/input";
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FiEdit } from "react-icons/fi";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import { LuFlame, LuFish } from "react-icons/lu";


interface Profile {
    id: string | null,
    fullName: string | null,
    email: string | null,
    calorieGoal: string | null,
    proteinGoal: number | null,
    carbGoal: number | null,
    fatGoal: number | null
}


type Repo = {
    id: string
}

export default function Page()
{
    const router = useRouter(); // Get the router instance
    const [profile, setProfile] = useState<Profile>({
        id: null,
        fullName: null,
        email: null,
        calorieGoal: null,
        proteinGoal: null,
        carbGoal: null,
        fatGoal: null
    });
    const [profileEdit, setProfileEdit] = useState<Profile>({
        ...profile
    });
    const [isEditMode, setIsEditMode] = useState(false);

    const updateProfile = () => {
        (async () => {
                const supabase = createClient();
                const entry = {
                    "id": profile.id,
                    "updated_at": new Date().toISOString(),
                    "email": null,
                    "full_name": null,
                    "calorie_goal": profileEdit.calorieGoal,
                    "protein_goal": profileEdit.proteinGoal,
                    "carbs_goal": profileEdit.carbGoal,
                    "fat_goal": profileEdit.fatGoal
                };
                try {
                    const {data, error} = await supabase
                        .from('profiles')
                        .update(entry)
                        .eq('id', profile.id);
                    if (error) {
                        alert("error updating profile")
                    } else {
                        await getData(); // Assuming this function fetches the updated profile
                        toggleEditMode();
                    }
                } catch (error) {
                    if (error instanceof Error) {
                        alert(error.message);
                    } else {
                        alert('An unexpected error occurred.');
                    }
                }
            }
        )();
    }

    const updateGoal = (newValue: ChangeEvent<HTMLInputElement>, goalType: string) => {
        const newVal = newValue.target.value;
        setProfileEdit({
            ...profileEdit,
            [goalType]: Number(newVal) || Number(newVal.substring(0, newVal.length - 1)) || null
        })
    }

    const toggleEditMode = () => {
        setProfileEdit({
            ...profile
        });
        setIsEditMode(!isEditMode);
    };

    const getData = async () => {
        const supabase = createClient();
        const {data: userData} = await supabase.auth.getUser();
        if(userData.user == null) {
            router.push('/login');
        }
        else {
            const {data: profile} = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userData.user.id)
                .single();
            setProfile({
                id: userData.user.id,
                fullName: profile.full_name,
                email: null,
                calorieGoal: profile.calorie_goal,
                proteinGoal: profile.protein_goal,
                carbGoal: profile.carbs_goal,
                fatGoal: profile.fat_goal
            });
            setProfileEdit({
                ...profile
            });
        }
    }


    useEffect(() => {
        (async () => {
            getData();
        })();
    }, []);


    return(

        <div className="flex justify-center mt-20">
            <Card className="w-full max-w-3xl">
                <CardHeader className="space-y-2">
                    <div className="flex flex-col space-y-1">
                        <div className="flex justify-between">
                            <CardTitle className="justify-start">
                                Profile
                            </CardTitle>
                            <button>
                                <FiEdit onClick={toggleEditMode} className="justify-end"/>
                            </button>
                        </div>
                        <CardDescription>View your profile information.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="border-t border-b border-gray-200 dark:border-gray-800">
                        <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-2">
                        <div className="flex flex-col space-y-1.5">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</div>
                                <div className="font-medium">Jane Foster</div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</div>
                                <div className="font-medium">janefoster@example.com</div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</div>
                                <div className="font-medium">{profile.id}</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardContent className="p-0">
                    {isEditMode ?
                        (
                            <div>
                                <div className="grid grid-cols-1 gap-1 pt-4 sm:grid-cols-2">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein Goal</Label>
                                        <Input className="font-medium bg-transparent rounded" id="protein" value={profileEdit.calorieGoal ?? ""} placeholder='no calorie goal set' onChange={(newValue) => updateGoal(newValue, "calorieGoal")}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Calorie Goal</Label>
                                        <Input className="font-medium bg-transparent rounded" id="fat" value={profileEdit.fatGoal ?? ""} placeholder='no fat goal set' onChange={(newValue) => updateGoal(newValue, "fatGoal")}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Fat Goal</Label>
                                        <Input className="font-medium bg-transparent rounded" id="calorie" value={profileEdit.calorieGoal ?? ""} placeholder='no calorie goal set' onChange={(newValue) => updateGoal(newValue, "calorieGoal")}/>
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">Carbohydrate Goal</Label>
                                        <Input className="font-medium bg-transparent rounded" id="carbs" value={profileEdit.carbGoal ?? ""} placeholder='no carb goal set' onChange={(newValue) => updateGoal(newValue, "carbGoal")}/>
                                    </div>
                                </div>
                                <div className="flex justify-center pb-4">
                                    <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded mt-5 w-52" onClick={updateProfile}>
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-2">
                                <div className="flex flex-col space-y-1.5">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Protein Goal
                                    </div>
                                    <div className="font-medium">{profile.proteinGoal ?? "none"} g</div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Calorie Goal
                                    </div>
                                    <div className="font-medium">{profile.calorieGoal ?? "none"} kcal</div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Fat Goal
                                    </div>
                                    <div className="font-medium">{profile.fatGoal ?? "none"} g</div>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Carbohydrate
                                        Goal
                                    </div>
                                    <div className="font-medium">{profile.carbGoal ?? "none"} g</div>
                                </div>
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    );

}