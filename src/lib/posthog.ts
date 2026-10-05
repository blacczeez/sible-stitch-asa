import posthog from 'posthog-js'

/**
 * PostHog client helpers
 *
 * WHERE TO PUT REAL DATA:
 * - NEXT_PUBLIC_POSTHOG_KEY  → Project API Key from PostHog → Project Settings → Project API Key (phc_...)
 * - NEXT_PUBLIC_POSTHOG_HOST → https://us.i.posthog.com (US) or https://eu.i.posthog.com (EU)
 *
 * See docs/posthog.md for the full checklist.
 */

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

/** Treat placeholder / empty keys as disabled so local dev stays quiet. */
export function isPostHogEnabled(): boolean {
  if (!POSTHOG_KEY) return false
  if (POSTHOG_KEY === 'phc_dummy_replace_me') return false
  if (POSTHOG_KEY.startsWith('phc_your_')) return false
  return true
}

let initialized = false

export function initPostHog(): typeof posthog | null {
  if (typeof window === 'undefined') return null
  if (!isPostHogEnabled() || !POSTHOG_KEY) return null

  if (!initialized) {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Capture pageviews manually so App Router navigations are tracked.
      capture_pageview: false,
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      person_profiles: 'identified_only',
    })
    initialized = true
  }

  return posthog
}

export function getPostHog(): typeof posthog | null {
  if (typeof window === 'undefined') return null
  if (!isPostHogEnabled()) return null
  return initialized ? posthog : initPostHog()
}
