"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { createClient } from "../utils/supabase/client";

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const supabase = createClient();

    useEffect(() => {
        // Ensure client-side execution
        if (typeof window === "undefined") return
    
        const updatePassword = async () => {
            try {
                const code = new URLSearchParams(window.location.search).get("code")
                if (code) {
                    const newPassword = prompt("What would you like your new password to be?")
                    if (newPassword) {
                        const { data, error } = await supabase.auth.updateUser({ password: newPassword })
                        if (error) {
                            console.error("Supabase update error:", error)
                            alert("There was an error updating your password: " + error.message)
                        } else {
                            alert("Password updated successfully!")
                            window.location.href = "/"  // Redirect on success
                        }
                    }
                } else {
                    console.error("No code found in URL")
                }
            } catch (err) {
                console.error("Unexpected error:", err)
            }
        }
    
        updatePassword()
    }, [supabase])
    


    const handleSubmit = async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/forgot`
        })
        
        if (error) {
            alert("Error sending reset instructions: " + error.message)
        } else {
            alert("Check your email for reset instructions")
        }
    }

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>
                    Enter your email below to reset your password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">
                        Send Instructions
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
