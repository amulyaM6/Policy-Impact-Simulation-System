'use client'
import Link from 'next/link'
import { UserButton, useAuth } from '@clerk/nextjs'

export default function Navbar() {
  const { isSignedIn } = useAuth()

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/80 px-6 lg:px-12 py-4 flex items-center justify-between transition-all shadow-sm">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 font-black text-lg">P</span>
          </div>
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
          Policy<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Sim</span>
        </span>
        <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full">
          v2.0 ABM+MC
        </span>
      </Link>

      <div className="flex items-center gap-6">
        {isSignedIn ? (
          <>
            <Link href="/upload" className="text-slate-600 hover:text-indigo-600 transition text-sm font-medium hover:scale-105">
              Upload Policy
            </Link>
            <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 transition text-sm font-medium hover:scale-105">
              Dashboard
            </Link>
            <Link href="/compare" className="text-slate-600 hover:text-indigo-600 transition text-sm font-medium hover:scale-105">
              Compare Policies
            </Link>
            <div className="pl-2 border-l border-slate-200">
              <UserButton />
            </div>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="text-slate-600 hover:text-indigo-600 transition text-sm font-medium">
              Login
            </Link>
            <Link href="/sign-up">
              <button className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm shadow-sm">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 transition-all group-hover:opacity-95"></span>
                <span className="relative block px-5 py-2 rounded-[11px] bg-slate-900 text-white transition-colors group-hover:bg-indigo-600">
                  Sign Up
                </span>
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}