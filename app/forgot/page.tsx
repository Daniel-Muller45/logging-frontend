"use client"

import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import { useState, useEffect } from 'react';

export default function ResetPage() {
    const supabase = createClient();
    const router = useRouter();
    const [data, setData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isSessionSet, setIsSessionSet] = useState(false);  // Track session setup
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        console.log("useEffect is running...");  // Check if useEffect is executed

        if (typeof window === 'undefined') {
            console.log("window is undefined; component is rendering server-side.");
            setErrorMessage("Please wait, loading on client side.");
            setIsLoading(false);
            return;
        }
        const setupSession = async () => {
            // Debugging: Log the full URL
            console.log("Full URL:", window.location.href);

            // Alternative to parse tokens
            const url = new URL(window.location.href);
            const hashParams = new URLSearchParams(url.hash.slice(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');

            console.log("Access Token:", accessToken);
            console.log("Refresh Token:", refreshToken);

            if (accessToken && refreshToken) {
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                if (error) {
                    setErrorMessage("Failed to set session: " + error.message);
                    console.log("Set session error:", error);
                } else {
                    console.log("Session set successfully");
                    setIsSessionSet(true);
                }
            } else {
                setErrorMessage("Invalid or missing token.");
                console.log("Tokens not found in URL.");
            }

            setIsLoading(false);
        };

        setupSession();
    }, [supabase]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleResetPassword = async () => {
        if (data.password !== data.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }
    
        if (!isSessionSet) {
            setErrorMessage("Session is not set yet. Please try again later.");
            return;
        }
    
        try {
            console.log("Attempting to update password...");
            const { error } = await supabase.auth.updateUser({ password: data.password });
            if (error) {
                setErrorMessage("Failed to reset password: " + error.message);
                console.log("Update password error:", error);
            } else {
                alert("Password updated successfully! Return to app.");
                // router.push('/login');
            }
        } catch (error) {
            // Type guard to check if error is an instance of Error
            if (error instanceof Error) {
                setErrorMessage("An unexpected error occurred: " + error.message);
            } else {
                setErrorMessage("An unexpected error occurred.");
            }
            console.log("Unexpected error:", error);
        }
    }
    

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto w-[400px] grid gap-4">
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="grid">
                <label>Enter your new password</label>
                <input
                    type="password"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    className="border p-2"
                />
            </div>
            <div className="grid">
                <label>Confirm your new password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    className="border p-2"
                />
            </div>
            <button onClick={handleResetPassword} className="bg-blue-500 text-white p-2 mt-4">
                Reset Password
            </button>
        </div>
    );
}
