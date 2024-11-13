"use client"

import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import { useState } from 'react';
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';

export default function ResetPage() {
    const supabase =  createClient();
    const [data, setData] = useState<{
        password: string,
        confirmPassword: string
    }>({
        password: '',
        confirmPassword: ''
    })
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setData((prev: any) => ({
            ...prev,
            [name]: value
        }));
    }

    const sendResetPassword = async () => {
        try {
            const { data: resetData, error } = await supabase
            .auth
            .resetPasswordForEmail(data.email, {
                redirectTo: `${window.location.href}reset`
            })
        } catch (error) {
            console.log(error);
        }
    }

    return <div className="container mx-auto w-[400px] grid gap-4">
        <div className="grid">
            <label>Enter your new password</label>
            <input
                type="password"
                name="password"
                value={data?.password}
                onChange={handleChange}
            />
        </div><div className="grid">
            <label>Confirm your new password</label>
            <input
                type="password"
                name="password"
                value={data?.password}
                onChange={handleChange}
            />
        </div>
    </div>
}