'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { getPostHog, initPostHog, isPostHogEnabled } from '@/lib/posthog'

/**
 * PostHog provider — mounts once in the root layout via AnalyticsProvider.
 *
 * Admin routes (/admin/*) are excluded so staff traffic does not pollute product analytics.
 */
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isPostHogEnabled()) return
    if (pathname?.startsWith('/admin')) return

    const ph = getPostHog()
    if (!ph) return

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    ph.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider() {
  useEffect(() => {
    initPostHog()
  }, [])

  if (!isPostHogEnabled()) return null

  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  )
}
