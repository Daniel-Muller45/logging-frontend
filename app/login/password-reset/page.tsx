'use client'

import React, {useState} from 'react'
import Link from 'next/link'

import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {passwordReset} from '@/app/utils/api'

export default function ResetPage() {
  const [email, setEmail] = useState('')

  const handleReset = async (event: React.SyntheticEvent) => {
    event.preventDefault() // Prevent page from reloading on form submission

    try {
      const data = await passwordReset(email)

      if (data.status === '200') {
        window.location.href = '/login/reset-password'
      } else {
        console.error('Password Reset failed:', data)
      }
    } catch (error) {
      console.error('Password Reset error:', error)
    }
  }

  return (
    <>
      <div className="container flex h-max w-full my-14 flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl text-primary font-semibold tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset your
              password.
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
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <br />
                  <Button onClick={handleReset}>Reset</Button>
                  <br />
                  <p className="px-8 text-center text-sm text-muted-foreground">
                    Remember your password?{' '}
                    <Link
                      href="/login"
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Login
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
