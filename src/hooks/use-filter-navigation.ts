'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useCallback } from 'react'

export function useFilterNavigation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const navigate = useCallback(
    (url: string, options?: { scroll?: boolean }) => {
      startTransition(() => {
        router.push(url, options)
      })
    },
    [router]
  )

  return { navigate, isPending, searchParams }
}
