'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Resetpassword } from '@/app/utils/api'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const handleReset = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      return
    }
    setPasswordMismatch(false)
    setIsLoading(true)

    try {
      const data = await Resetpassword({ email, password, token })

      if (data.status === '200') {
        window.location.href = '/login'
      } else {
        console.error('Password Reset failed:', data)
      }
    } catch (error) {
      console.error('Password Reset error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="container flex h-max w-full my-14 flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl text-primary font-semibold tracking-tight">
              New Password
            </h1>
            <p className="text-sm text-muted-foreground">
              <p className="text-sm text-muted-foreground">
                Please check your email for a OTP code.
              </p>
            </p>
          </div>

          <form className={cn('grid gap-6')} onSubmit={handleReset}>
            <div className="grid gap-2">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                className="bg-white text-black"
                placeholder="Email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Label className="sr-only" htmlFor="otp">
                OTP
              </Label>
              <Input
                id="top"
                className="bg-white text-black"
                placeholder="OTP"
                type="otp"
                disabled={isLoading}
                value={token}
                onChange={e => setToken(e.target.value)}
              />
              <Label className="sr-only" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                className="bg-white text-black"
                placeholder="Password"
                type="password"
                disabled={isLoading}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Label className="sr-only" htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                className="bg-white text-black"
                placeholder="Confirm Password"
                type="password"
                disabled={isLoading}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="mr-2 size-4 animate-spin">Loading...</span>
              ) : (
                'Reset Password'
              )}
            </Button>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Remember your password?{' '}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Login
              </Link>
            </p>
          </form>

          {passwordMismatch && (
            <p className="text-sm text-red-500 text-center">
              Passwords do not match
            </p>
          )}
        </div>
      </div>
    </>
  )
}
