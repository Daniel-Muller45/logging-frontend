'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from '@/components/ui/navigation-menu'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/app/assets/logo.png'
import { cn } from '@/lib/utils'
import { Button } from '@/app/components/ui/button'

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

interface NavMenuProps {}
const NavMenu: React.FC<NavMenuProps> = () => {
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
    <nav className="bg-neutral p-3 inline-block w-full">
      <div className="inline lg:hidden"></div>
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
      <NavigationMenu className="float-right">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/login" legacyBehavior passHref>
              <NavigationMenuLink
                  className={
                    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                  }
              >
                Login
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/meals" legacyBehavior passHref>
              <NavigationMenuLink
                className={
                  'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                }
              >
                Meals
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/protected" legacyBehavior passHref>
              <NavigationMenuLink
                  className={
                    'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50'
                  }
              >
                Log
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}

export default NavMenu
