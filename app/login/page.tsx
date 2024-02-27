'use client'

import React, {useState} from 'react'
import Link from 'next/link'

import {cn} from '@/lib/utils'
import {Icons} from '@/components/ui/icons'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {loginUser} from '../utils/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault() // Prevent page from reloading on form submission

    try {
      setIsLoading(true) // Set loading state to true

      setTimeout(() => {
        setIsLoading(false)
      }, 3000)

      const data = await loginUser({ email, password })

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
        window.location.href =
          data.detail.user_state.user_role === 'influencer'
            ? '/upload'
            : '/collection'
      } else {
        console.error('Login failed:', data)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <>
      <div className="container flex h-max w-full my-14 flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl text-primary font-semibold tracking-tight">
              Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to sign in
            </p>
          </div>

          <div className={cn('grid gap-6')}>
            <form>
              <div className="grid gap-2">
                <div className="grid gap-1">
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
                  <br />
                  <Button disabled={isLoading} onClick={handleLogin}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                    )}
                    Login
                  </Button>
                  <br />
                  <p className="px-8 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                      href="/register"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Sign up
                    </Link>{' '}
                  </p>
                  <br />
                  <p className="px-8 text-center text-xs text-muted-foreground">
                    <Link
                      href="/login/password-reset"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Forgot your password?
                    </Link>{' '}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
