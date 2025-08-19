"use client"

import { UserButton } from "@clerk/nextjs"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  firstName: string | null | undefined
}

export function Header({ firstName }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-xl font-semibold text-foreground lg:block hidden">
            Welcome back, {firstName || "Jefe"}!
          </h2>

          {/* Search bar */}
          <div className="relative max-w-md flex-1 lg:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects, logs, tasks..." className="pl-10 bg-muted/50" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs"></span>
          </Button>

          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}
