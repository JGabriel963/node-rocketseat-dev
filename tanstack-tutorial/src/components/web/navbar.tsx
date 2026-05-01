import { Link } from '@tanstack/react-router'
import { Button } from '../ui/button'
import { ModeToggle } from './mode-toggle'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/claude-logo.svg" alt="Claude Logo" className="size-8" />
          <h1 className="text-lg font-semibold">Claude Code</h1>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button variant="secondary" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
