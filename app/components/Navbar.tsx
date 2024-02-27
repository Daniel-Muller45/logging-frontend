'use client'
// Navbar.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../assets/logo.png'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const handleSignOut = () => {
    // Clear localStorage items
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('supabase_id')
    localStorage.removeItem('user_role')

    // Redirect to the home page or login page
    window.location.href = '/'
  }

  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isInfluencer, setInfluencer] = useState(false)

  useEffect(() => {
    setIsSignedIn(Boolean(localStorage.getItem('access_token')))
    setInfluencer(localStorage.getItem('user_role') === 'influencer')
  }, [])

  return (
    <nav className="bg-neutral p-5 inline-block w-full">
      <div className="inline lg:hidden">
        <div className="float-left">
          <Link href="/">
            <Image
              className="inline"
              id="logo"
              src={logo}
              alt="Ora AI"
              width={'100'}
            />
          </Link>
        </div>

        <details className="dropdown dropdown-end inline float-right">
          <summary className="float-right m-1 btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block size-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </summary>
          <ul className="float-right shadow menu dropdown-content bg-base-100 rounded-box mt-10">
            <li>
              <Link className="text-right float-right" href="/">
                Logging
              </Link>
            </li>
            <li>
              <Link className=" " href="/sign-in">
                Login
              </Link>
            </li>
            <li>
              <Link className=" " href="/sign-up">
                Register
              </Link>
            </li>
          </ul>
        </details>
      </div>

      <div className="flex items-center justify-between w-full lg:inline-flex">
        <Link href="/">
          <Image src={logo} alt="Logo" width={100} height={50} />
        </Link>
        <div className="flex items-center justify-end">
          <Link className="mr-10" href="/">
            Logging
          </Link>
          {!isInfluencer && (
            <Link className="mr-10" href="/collection">
              Collection
            </Link>
          )}
          {isInfluencer && (
            <Link className="mr-10" href="/upload">
              Upload
            </Link>
          )}
        </div>
        <div className="flex items-center justify-end">
          {isSignedIn ? (
            <button onClick={handleSignOut} className="mr-10">
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/sign-in" className="mr-10">
                Login
              </Link>
              <Link href="/sign-up" className="mr-10">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
