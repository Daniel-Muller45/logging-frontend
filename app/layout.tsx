import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/react'
import NavMenu from './components/NavMenu'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import React from 'react'
import Providers from './providers'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.'
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.'
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.'
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.'
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.'
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.'
  }
]

const inter = Inter({ subsets: ['latin'] })
// const ListItem = ({ text, href }) => (
//     <li>
//       <a href={href}>{text}</a>
//     </li>
// );

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

export const metadata = {
  metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
  title:
    'Ora | Revolutionize Your Fitness with AI-Powered Personalized Workouts & Nutrition',
  description: 'An AI-powered fitness marketplace.',
  icons: {
    icon: '/new_logo.ico'
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png'
  }
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en" data-theme="oratheme">
          <Providers>
            <body className={`${inter.className}`}>
              {/*<Navbar></Navbar>*/}
              <NavMenu></NavMenu>
              <div className="w-11/12 mx-auto">
                  {children}
                <Analytics />
              </div>
            </body>
          </Providers>
        </html>
  )
}

// interface RootLayoutProps {
//   children: React.ReactNode
// }
//
// export default function RootLayout({ children }: RootLayoutProps) {
//   return (
//       <html lang="en" suppressHydrationWarning>
//       <body
//           className={cn(
//               'font-sans antialiased',
//               GeistSans.variable,
//               GeistMono.variable
//           )}
//       >
//       <Toaster />
//       <Providers
//           attribute="class"
//           defaultTheme="system"
//           enableSystem
//           disableTransitionOnChange
//       >
//         <div className="flex flex-col min-h-screen">
//           <Header />
//           <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
//         </div>
//         <TailwindIndicator />
//       </Providers>
//       </body>
//       </html>
//   )
// }
