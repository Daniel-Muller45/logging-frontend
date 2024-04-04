"use client"

import React, { ChangeEvent, useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client'
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import {Input} from "../../components/ui/input";
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FiEdit } from "react-icons/fi";


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

        <div>
            <div className="flex justify-end">
                <button >
                    <FiEdit onClick={toggleEditMode} className="justify-end"/>
                </button>
            </div>
            { isEditMode ?
                (
                    <div>
                        <div className="my-3">
                            <Label htmlFor="protein">Calorie Goal</Label>
                            <Input className="rounded mt-2" id="protein" value={profileEdit.calorieGoal ?? ""} placeholder='no calorie goal set' onChange={(newValue) => updateGoal(newValue, "calorieGoal")}/>
                        </div>
                        <div className="my-3">
                            <Label htmlFor="protein">Protein Goal</Label>
                            <Input className="rounded mt-2" id="protein" value={profileEdit.proteinGoal ?? ""} placeholder='no protein goal set' onChange={(newValue) => updateGoal(newValue, "proteinGoal")}/>
                        </div>
                        <div className="my-3">
                            <Label htmlFor="carbs">Carb Goal</Label>
                            <Input className="rounded mt-2" id="carbs" value={profileEdit.carbGoal ?? ""} placeholder='no carb goal set' onChange={(newValue) => updateGoal(newValue, "carbGoal")}/>
                        </div>
                        <div className="my-3">
                            <Label htmlFor="fat">Fat Goal</Label>
                            <Input className="rounded mt-2" id="fat" value={profileEdit.fatGoal ?? ""} placeholder='no fat goal set' onChange={(newValue) => updateGoal(newValue, "fatGoal")}/>
                        </div>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded mt-5" onClick={updateProfile}>
                            Submit
                        </Button>
                    </div>
                ) : (
                    <div>
                        <p className="mt-14 my-6">
                            User Id: {profile.id}
                        </p>
                        <p className="my-6">
                            Calorie Goal: {profile.calorieGoal ?? "none"}
                        </p>
                        <p className="my-6">
                            Protein Goal: {profile.proteinGoal ?? "none"}
                        </p>
                        <p className="my-6">
                            Carb Goal: {profile.carbGoal ?? "none"}
                        </p>
                        <p className="my-6">
                            Fat Goal: {profile.fatGoal ?? "none"}
                        </p>
                    </div>
                )}
        </div>
    );

}