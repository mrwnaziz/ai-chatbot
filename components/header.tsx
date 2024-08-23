import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel,
} from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'
import { ThemeToggle } from '@/components/theme-toggle'
import { CloseButton } from '@/components/close-button'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/new" rel="nofollow" className="flex items-center text-sm">
          <IconVercel className="size-5 mr-2 dark:hidden" />
          <IconVercel className="hidden size-5 mr-2 dark:block" />
          <span>Chat with MiskHub</span>
        </Link>
      )}
    </>
  )
}

async function UserLoginButton() {
  const session = (await auth()) as Session
  return (
    <div className="flex items-center">
      {session?.user ? (
        <UserMenu user={session.user} />
      ) : (
        <Button variant="link" asChild className="-ml-2">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>

      <div className="flex items-center justify-end space-x-2">
        {/* <React.Suspense fallback={<div className="flex-1" />}>
          <UserLoginButton />
        </React.Suspense> */}
        <ThemeToggle />
        <CloseButton />
      </div>
    </header>
  )
}
