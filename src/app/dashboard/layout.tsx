'use client'
import React from 'react'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { isAuthenticated } from '@/services/authService'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')

      if (!token || !isAuthenticated()) {
        // Use window.location for hard redirect
        window.location.href = '/login'
        return
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#edede9]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 pl-4 pr-4 overflow-x-auto min-w-0">
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools />
            <div className="max-w-full">{children}</div>
          </QueryClientProvider>
        </main>
      </div>
    </div>
  )
}
