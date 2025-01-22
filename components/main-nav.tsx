import Link from "next/link"
import { Pi } from 'lucide-react'

export function MainNav() {
  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Pi className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          Math Texpedia
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/courses"
          className="transition-colors hover:text-foreground/80"
        >
          Courses
        </Link>
        <Link
          href="/subjects"
          className="transition-colors hover:text-foreground/80"
        >
          Subjects
        </Link>
        <Link
          href="/about"
          className="transition-colors hover:text-foreground/80"
        >
          About
        </Link>
      </nav>
    </div>
  )
}

