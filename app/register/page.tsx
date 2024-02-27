'use client'

import React, { useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerUser } from '../utils/api'

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  const handleRegister = async (event: React.SyntheticEvent) => {
    event.preventDefault() // Prevent page from reloading on form submission
    try {
      const isPasswordConfirmed = await confirmUserPassword() // Check if password is confirmed
      if (!isPasswordConfirmed) {
        setPasswordMismatch(true) // Set password mismatch state to true
        return // Return early if password is not confirmed
      } else {
        setPasswordMismatch(false) // Set password mismatch state to false
      }

      setIsLoading(true) // Set loading state to true

      setTimeout(() => {
        setIsLoading(false)
      }, 3000)

      const data = await registerUser({ name, email, password })

      if (data.status === '200') {
        // Store tokens and user ID in local storage
        localStorage.setItem(
          'access_token',
          data.detail.user_state.access_token
        )
        localStorage.setItem(
          'refresh_token',
          data.detail.user_state.refresh_token
        )
        localStorage.setItem('supabase_id', data.detail.user_state.supabase_id)
        localStorage.setItem('user_role', data.detail.user_state.user_role)

        // Navigate to a different page
        window.location.href = '/collection'
      } else {
        console.error('Login failed:', data)
      }
    } catch (error) {
      console.error('Registration error:', error)
      // Handle error (e.g., show a message to the user)
    }
  }

  // Function to confirm that the password matches the confirm password
  async function confirmUserPassword() {
    if (password === confirmPassword) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <div className="container flex h-max w-full my-14 flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl text-primary font-semibold tracking-tight">
              Register
            </h1>
            <p className="text-sm text-muted-foreground">
              Begin your fitness journey today!
            </p>
          </div>

          <div className={cn('grid gap-6')}>
            <form>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="sr-only" htmlFor="name">
                    Name
                  </Label>
                  <Input
                    className="bg-white text-black"
                    placeholder="Name"
                    type="name"
                    autoCapitalize="none"
                    autoComplete="name"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
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
                  <Label className="sr-only" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    className="bg-white text-black"
                    placeholder="Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                    disabled={isLoading}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Label className="sr-only" htmlFor="password">
                    Confirm Password
                  </Label>
                  <Input
                    className="bg-white text-black"
                    placeholder="Confirm Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect="off"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>
                <br />

                <p className="px-8 text-center text-sm text-muted-foreground">
                  By clicking continue, you agree to our{' '}
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
                <br />

                <Button onClick={handleRegister}>
                  {isLoading && !passwordMismatch && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  Register
                </Button>
                <Button asChild className="bg-blue-600">
                  <Link href="/influencer/register">
                    Register as Influencer
                  </Link>
                </Button>
                <br />
                <p className="px-8 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    Login
                  </Link>{' '}
                </p>
              </div>
            </form>
          </div>

          {passwordMismatch && ( // Render error message if password mismatch state is true
            <p className="text-sm text-red-500 justify-center text-center">
              Passwords do not match
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default RegisterPage
