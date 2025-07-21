// src/app/scanner/page.tsx

'use client'

import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Suspense, useState } from 'react'

export default function ScannerPage() {
  const [token, setToken] = useState('')
  const router = useRouter()

const handleScan = () => {
  if (!token) return
  router.push(`/result?token=${token.toLowerCase()}`)
} 

  return (
  <Suspense>
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">🔎 Red Flag Scanner</h1>
      <Input
        placeholder="Enter token name or website (e.g. XRP)"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-[300px]"
      />
      <Button onClick={handleScan}>Scan Now</Button>
    </main>
  </Suspense>
  )
}
